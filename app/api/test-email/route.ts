
import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST() {
  // Disponível somente durante o desenvolvimento local
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Rota disponível somente em desenvolvimento." },
      { status: 404 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY não foi configurada." },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: "Trabalho-do-leo <onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject: "Teste de envio de e-mail",
      html: "<p>O envio de e-mail do Trabalho-do-leo foi testado.</p>",
    });

    if (error) {
      console.error("Erro do Resend:", error.message);
      return NextResponse.json(
        { error: "O Resend não conseguiu enviar o e-mail." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data?.id,
      message: "Solicitação de envio aceita pelo Resend.",
    });
  } catch {
    return NextResponse.json(
      { error: "Falha ao tentar enviar o e-mail." },
      { status: 500 }
    );
  }
}
