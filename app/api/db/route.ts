import { NextResponse } from "next/server";
import {
  CHAVES_PERMITIDAS,
  CHAVE_USUARIOS,
  dbAtivo,
  garantirTabela,
  gravar,
  identificar,
  lerTudo,
} from "@/lib/db";

export const dynamic = "force-dynamic";

const naoAtivo = () =>
  NextResponse.json({ error: "Banco de dados não configurado." }, { status: 503 });

// Lê todos os dados salvos. Exige usuário logado (cadastrado no banco).
export async function GET(req: Request) {
  if (!dbAtivo()) return naoAtivo();
  try {
    await garantirTabela();
    const { usuario } = await identificar(req);
    if (!usuario) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
    return NextResponse.json({ dados: await lerTudo() });
  } catch (e) {
    console.error("GET /api/db", e);
    return NextResponse.json({ error: "Erro ao ler o banco." }, { status: 500 });
  }
}

// Grava uma lista inteira (uma "chave") no banco.
export async function PUT(req: Request) {
  if (!dbAtivo()) return naoAtivo();
  try {
    const body = (await req.json()) as { chave?: string; valor?: unknown };
    const { chave, valor } = body;

    if (!chave || !CHAVES_PERMITIDAS.includes(chave) || !Array.isArray(valor)) {
      return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
    }

    await garantirTabela();
    const { usuario, semUsuarios } = await identificar(req);

    if (semUsuarios) {
      // Banco ainda vazio: só aceita a criação do primeiro usuário (o administrador).
      if (chave !== CHAVE_USUARIOS) {
        return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
      }
    } else {
      if (!usuario) {
        return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
      }
      // Somente administradores mexem na lista de usuários.
      if (chave === CHAVE_USUARIOS && !usuario.isAdmin) {
        return NextResponse.json({ error: "Somente administradores." }, { status: 403 });
      }
    }

    await gravar(chave, valor);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("PUT /api/db", e);
    return NextResponse.json({ error: "Erro ao gravar no banco." }, { status: 500 });
  }
}
