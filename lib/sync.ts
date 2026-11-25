// lib/sync.ts  (NAVEGADOR)
//
// Espelha o localStorage no banco permanente (via /api/db).
// O localStorage continua sendo a "base de trabalho" do site, exatamente como
// antes. Cada alteração é copiada para o banco, e ao entrar no site os dados
// do banco são trazidos de volta. Se o banco não estiver configurado
// (sem DATABASE_URL), nada disso faz efeito e o site funciona como sempre.

const CHAVE_USUARIOS = "auth:usuarios";
const CHAVE_SESSAO = "auth:sessao";
const CHAVE_PENDENTES = "sync:pendentes";

export const CHAVES_SINCRONIZADAS = [
  CHAVE_USUARIOS,
  "app:salas",
  "inv:pontosRede",
  "inv:patchPanels",
  "inv:switches",
  "inv:testes",
  "inv:maquinas",
];

let ativo: boolean | null = null; // null = ainda não sabemos
let hidratado = false; // já trouxemos os dados do banco nesta página?
let bancoSemUsuarios = false; // banco vazio: só aceita criar o 1º usuário
let sessaoHidratada: string | null = null;
const timers = new Map<string, ReturnType<typeof setTimeout>>();

function sessaoId(): string | null {
  try {
    const raw = window.localStorage.getItem(CHAVE_SESSAO);
    return raw ? (JSON.parse(raw).id as string) : null;
  } catch {
    return null;
  }
}

function cabecalhos(): HeadersInit {
  const id = sessaoId();
  return id
    ? { "content-type": "application/json", "x-sessao-id": id }
    : { "content-type": "application/json" };
}

function lerPendentes(): string[] {
  try {
    return JSON.parse(window.localStorage.getItem(CHAVE_PENDENTES) ?? "[]");
  } catch {
    return [];
  }
}
function salvarPendentes(lista: string[]) {
  window.localStorage.setItem(CHAVE_PENDENTES, JSON.stringify(lista));
}
function marcarPendente(chave: string) {
  const l = lerPendentes();
  if (!l.includes(chave)) salvarPendentes([...l, chave]);
}
function limparPendente(chave: string) {
  salvarPendentes(lerPendentes().filter((c) => c !== chave));
}

function lerLocal(chave: string): unknown[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(chave) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

async function enviar(chave: string): Promise<boolean> {
  try {
    const r = await fetch("/api/db", {
      method: "PUT",
      headers: cabecalhos(),
      body: JSON.stringify({ chave, valor: lerLocal(chave) }),
    });
    if (r.ok) limparPendente(chave);
    return r.ok;
  } catch {
    return false; // sem internet: continua pendente e será reenviado depois
  }
}

// Chamado pelos stores sempre que gravam algo no localStorage.
export function notificarMudanca(chave: string) {
  if (typeof window === "undefined" || ativo === false) return;
  marcarPendente(chave);
  // Antes de trazer os dados do banco não enviamos nada, para nunca
  // sobrescrever o banco com dados locais vazios/desatualizados.
  const podeEnviar = hidratado || (bancoSemUsuarios && chave === CHAVE_USUARIOS);
  if (!podeEnviar) return;
  clearTimeout(timers.get(chave));
  timers.set(
    chave,
    setTimeout(() => {
      timers.delete(chave);
      void enviar(chave);
    }, 400)
  );
}

async function enviarPendentesAgora() {
  for (const [chave, t] of timers) {
    clearTimeout(t);
    timers.delete(chave);
    await enviar(chave);
  }
}

export interface StatusRemoto {
  ativo: boolean;
  temUsuarios: boolean;
}

export async function statusRemoto(): Promise<StatusRemoto> {
  try {
    const r = await fetch("/api/db/status", { cache: "no-store" });
    const s = (await r.json()) as StatusRemoto;
    ativo = s.ativo;
    bancoSemUsuarios = s.ativo && !s.temUsuarios;
    return s;
  } catch {
    return { ativo: false, temUsuarios: false };
  }
}

export function aplicarDados(dados: Record<string, unknown>): boolean {
  let mudou = false;
  for (const chave of CHAVES_SINCRONIZADAS) {
    if (!(chave in dados)) continue;
    const novo = JSON.stringify(dados[chave]);
    if (window.localStorage.getItem(chave) !== novo) {
      window.localStorage.setItem(chave, novo);
      mudou = true;
    }
  }
  return mudou;
}

// Login conferido no banco. "indisponivel" = usar o login local como antes.
export type LoginRemoto =
  | { tipo: "ok"; usuario: unknown; dados: Record<string, unknown> }
  | { tipo: "negado" }
  | { tipo: "indisponivel" };

export async function loginRemoto(usuario: string, senha: string): Promise<LoginRemoto> {
  try {
    const r = await fetch("/api/db/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ usuario, senha }),
    });
    if (r.status === 401) return { tipo: "negado" };
    if (!r.ok) return { tipo: "indisponivel" };
    const corpo = await r.json();
    return { tipo: "ok", usuario: corpo.usuario, dados: corpo.dados ?? {} };
  } catch {
    return { tipo: "indisponivel" };
  }
}

// Traz os dados do banco para o navegador (ou envia os locais, se o banco
// ainda não tiver aquela informação). Retorna true se a página precisa recarregar.
export async function sincronizar(): Promise<{ recarregar: boolean; sessaoInvalida: boolean }> {
  const resultado = { recarregar: false, sessaoInvalida: false };
  const id = sessaoId();
  if (hidratado && sessaoHidratada === id) return resultado;

  const status = await statusRemoto();
  if (!status.ativo) return resultado;

  // Banco vazio (primeira vez): envia o que já existe neste navegador.
  if (!status.temUsuarios) {
    if (lerLocal(CHAVE_USUARIOS).length === 0) return resultado; // ainda não há nada para enviar
    if (!(await enviar(CHAVE_USUARIOS))) return resultado;
    bancoSemUsuarios = false;
  }
  if (!id) return resultado; // sem login ainda: espera o login

  let r: Response;
  try {
    r = await fetch("/api/db", { headers: cabecalhos(), cache: "no-store" });
  } catch {
    return resultado; // sem internet: segue só com o localStorage
  }
  if (r.status === 401) {
    resultado.sessaoInvalida = true;
    return resultado;
  }
  if (!r.ok) return resultado;

  const { dados } = (await r.json()) as { dados: Record<string, unknown> };
  const pendentes = lerPendentes();
  const aTrazer: Record<string, unknown> = {};
  const aEnviar: string[] = [];

  for (const chave of CHAVES_SINCRONIZADAS) {
    const local = lerLocal(chave);
    if (pendentes.includes(chave)) {
      aEnviar.push(chave); // alteração local ainda não enviada: ela vence
    } else if (chave in dados) {
      aTrazer[chave] = dados[chave];
    } else if (local.length > 0) {
      aEnviar.push(chave); // banco ainda não tem este dado
    }
  }

  resultado.recarregar = aplicarDados(aTrazer);
  hidratado = true;
  sessaoHidratada = id;
  for (const chave of aEnviar) await enviar(chave);
  await enviarPendentesAgora();
  return resultado;
}
