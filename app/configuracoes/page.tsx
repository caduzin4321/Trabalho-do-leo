"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sessaoStore, type Sessao } from "@/lib/users";

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [sessao, setSessao] = useState<Sessao | null>(null);

  useEffect(() => {
    const usuario = sessaoStore.get();

    if (!usuario) {
      router.replace("/");
      return;
    }

    setSessao(usuario);
  }, [router]);

  if (!sessao) return null;

  return (
    <div className="min-h-screen px-5 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="mb-2 text-sm text-blue-400">
            Sistema / Configurações
          </p>

          <h1 className="text-3xl font-bold text-white">
            Configurações
          </h1>

          <p className="mt-2 text-slate-400">
            Gerencie suas informações e preferências do sistema.
          </p>
        </div>

        {/* Perfil */}
        <section className="mb-6 rounded-xl border border-white/10 bg-[#0d1c30]/90 p-6">
          <h2 className="mb-5 text-xl font-semibold text-white">
            Perfil do usuário
          </h2>

          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
              {sessao.nomeUsuario.charAt(0).toUpperCase()}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">
                {sessao.nomeUsuario}
              </h3>

              <p className="text-sm text-slate-400">
                {sessao.isAdmin ? "Administrador" : "Usuário comum"}
              </p>
            </div>
          </div>
        </section>

        {/* Segurança */}
        <section className="mb-6 rounded-xl border border-white/10 bg-[#0d1c30]/90 p-6">
          <h2 className="mb-3 text-xl font-semibold text-white">
            Segurança
          </h2>

          <p className="mb-4 text-sm text-slate-400">
            Mantenha sua conta protegida e atualize sua senha quando necessário.
          </p>

          <Link
            href="/forgot-password"
            className="inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Recuperar ou alterar senha
          </Link>
        </section>

        {/* Preferências */}
        <section className="mb-6 rounded-xl border border-white/10 bg-[#0d1c30]/90 p-6">
          <h2 className="mb-3 text-xl font-semibold text-white">
            Preferências do sistema
          </h2>

          <div className="flex items-center justify-between gap-4 border-b border-white/10 py-4">
            <div>
              <p className="font-medium text-white">
                Tema visual
              </p>

              <p className="text-sm text-slate-400">
                Aparência atual do sistema.
              </p>
            </div>

            <span className="rounded-lg bg-blue-500/20 px-3 py-2 text-sm text-blue-300">
              Azul escuro
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="font-medium text-white">
                Menu lateral
              </p>

              <p className="text-sm text-slate-400">
                Você pode recolher ou expandir o menu pelo botão lateral.
              </p>
            </div>

            <span className="text-sm text-green-400">
              Disponível
            </span>
          </div>
        </section>

        {/* Sobre */}
        <section className="rounded-xl border border-white/10 bg-[#0d1c30]/90 p-6">
          <h2 className="mb-3 text-xl font-semibold text-white">
            Sobre o sistema
          </h2>

          <p className="text-sm leading-7 text-slate-400">
            Sistema de Gerenciamento da Rede Escolar, desenvolvido
            para auxiliar na organização das salas, inventário de
            cabeamento, identificação dos equipamentos e testes
            de certificação da infraestrutura de rede.
          </p>

          <p className="mt-4 text-xs text-slate-500">
            Versão 1.0
          </p>
        </section>

        <div className="mt-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-blue-400 hover:text-blue-300"
          >
            ← Voltar ao painel principal
          </Link>
        </div>
      </div>
    </div>
  );
}