import { NextResponse } from "next/server";
import { dbAtivo, garantirTabela, listarUsuarios } from "@/lib/db";

export const dynamic = "force-dynamic";

// Informa (sem expor dados) se o banco está ligado e se já existe algum usuário.
export async function GET() {
  if (!dbAtivo()) return NextResponse.json({ ativo: false, temUsuarios: false });
  try {
    await garantirTabela();
    const usuarios = await listarUsuarios();
    return NextResponse.json({ ativo: true, temUsuarios: usuarios.length > 0 });
  } catch (e) {
    console.error("GET /api/db/status", e);
    return NextResponse.json({ ativo: false, temUsuarios: false });
  }
}
