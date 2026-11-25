import { NextResponse } from "next/server";
import { dbAtivo, garantirTabela, lerTudo, listarUsuarios } from "@/lib/db";

export const dynamic = "force-dynamic";

// Login conferido no servidor. Em caso de sucesso devolve também os dados
// salvos, para o navegador (novo, ou com o armazenamento apagado) se restaurar.
export async function POST(req: Request) {
  if (!dbAtivo()) {
    return NextResponse.json({ error: "Banco não configurado." }, { status: 503 });
  }
  try {
    const { usuario, senha } = (await req.json()) as {
      usuario?: string;
      senha?: string;
    };
    await garantirTabela();
    const usuarios = await listarUsuarios();

    if (usuarios.length === 0) {
      // Banco vazio: o cliente usa o login local e depois envia seus dados.
      return NextResponse.json({ semUsuarios: true }, { status: 409 });
    }

    const encontrado = usuarios.find(
      (u) =>
        typeof usuario === "string" &&
        u.nomeUsuario.toLowerCase() === usuario.toLowerCase() &&
        u.senha === senha
    );
    if (!encontrado) {
      return NextResponse.json({ error: "Usuário ou senha incorretos." }, { status: 401 });
    }

    return NextResponse.json({ usuario: encontrado, dados: await lerTudo() });
  } catch (e) {
    console.error("POST /api/db/login", e);
    return NextResponse.json({ error: "Erro no servidor." }, { status: 500 });
  }
}
