// lib/db.ts  (SOMENTE SERVIDOR)
//
// Conexão com o banco de dados permanente (Postgres da Neon).
// A string de conexão fica na variável de ambiente DATABASE_URL, que existe
// apenas no servidor: o navegador nunca a vê. Quem não tiver essa string
// (ou acesso ao painel da Neon) não consegue ler nem escrever no banco.

import { neon } from "@neondatabase/serverless";

export const CHAVE_USUARIOS = "auth:usuarios";

// Somente estas chaves podem ser gravadas no banco.
export const CHAVES_PERMITIDAS = [
  CHAVE_USUARIOS,
  "app:salas",
  "inv:pontosRede",
  "inv:patchPanels",
  "inv:switches",
  "inv:testes",
  "inv:maquinas",
];

export interface UsuarioDb {
  id: string;
  nomeUsuario: string;
  senha: string;
  isAdmin: boolean;
  criadoEm?: string;
}

export function dbAtivo(): boolean {
  return !!process.env.DATABASE_URL;
}

function cliente() {
  return neon(process.env.DATABASE_URL as string);
}

let tabelaPronta: Promise<void> | null = null;

// Cria a tabela automaticamente na primeira vez que o banco é usado.
export function garantirTabela(): Promise<void> {
  if (!tabelaPronta) {
    tabelaPronta = (async () => {
      const sql = cliente();
      await sql`
        CREATE TABLE IF NOT EXISTS kv_store (
          chave TEXT PRIMARY KEY,
          valor JSONB NOT NULL,
          atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
    })().catch((erro) => {
      tabelaPronta = null;
      throw erro;
    });
  }
  return tabelaPronta;
}

export async function lerTudo(): Promise<Record<string, unknown>> {
  const sql = cliente();
  const linhas = (await sql`SELECT chave, valor FROM kv_store`) as {
    chave: string;
    valor: unknown;
  }[];
  const dados: Record<string, unknown> = {};
  for (const l of linhas) dados[l.chave] = l.valor;
  return dados;
}

export async function gravar(chave: string, valor: unknown): Promise<void> {
  const sql = cliente();
  const json = JSON.stringify(valor);
  await sql`
    INSERT INTO kv_store (chave, valor, atualizado_em)
    VALUES (${chave}, ${json}::jsonb, now())
    ON CONFLICT (chave)
    DO UPDATE SET valor = EXCLUDED.valor, atualizado_em = now()
  `;
}

export async function listarUsuarios(): Promise<UsuarioDb[]> {
  const sql = cliente();
  const linhas = (await sql`
    SELECT valor FROM kv_store WHERE chave = ${CHAVE_USUARIOS}
  `) as { valor: unknown }[];
  const valor = linhas[0]?.valor;
  return Array.isArray(valor) ? (valor as UsuarioDb[]) : [];
}

// Identifica quem está chamando a API pelo cabeçalho x-sessao-id
// (o id do usuário, um UUID aleatório que só o próprio navegador logado conhece).
export async function identificar(req: Request) {
  const usuarios = await listarUsuarios();
  const id = req.headers.get("x-sessao-id");
  const usuario = id ? usuarios.find((u) => u.id === id) : undefined;
  return { usuarios, usuario, semUsuarios: usuarios.length === 0 };
}
