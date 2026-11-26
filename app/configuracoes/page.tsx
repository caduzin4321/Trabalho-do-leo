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
          <p className="mb-2 text-sm text-lime-300">
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
        <section className="mb-6 rounded-xl border border-white/10 bg-[#111D2A] p-6">
          <h2 className="mb-5 text-xl font-semibold text-white">
            Perfil do usuário
          </h2>

          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lime-300 text-2xl font-bold text-[#101810]">
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
        <section className="mb-6 rounded-xl border border-white/10 bg-[#111D2A] p-6">
          <h2 className="mb-3 text-xl font-semibold text-white">
            Segurança
          </h2>

          <p className="mb-4 text-sm text-slate-400">
            Mantenha sua conta protegida e atualize sua senha quando necessário.
          </p>

          <Link
            href="/forgot-password"
            className="inline-flex rounded-lg bg-lime-300 px-5 py-3 text-sm font-bold text-[#101810] transition hover:bg-lime-200"
          >
            Recuperar ou alterar senha
          </Link>
        </section>

        {/* Preferências */}
        <section className="mb-6 rounded-xl border border-white/10 bg-[#111D2A] p-6">
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

            <span className="rounded-lg bg-lime-300/10 px-3 py-2 text-sm text-lime-300">
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
        <section className="rounded-xl border border-white/10 bg-[#111D2A] p-6">
          <h2 className="mb-3 text-xl font-semibold text-white">
            Sobre o sistema
          </h2>

          <p className="text-sm leading-7 text-slate-400">
            Nexo, sistema de gerenciamento de rede, desenvolvido
            para auxiliar na organização das salas, inventário de
            cabeamento, identificação dos equipamentos e testes
            de certificação da infraestrutura de rede.
          </p>

          <p className="mt-4 text-xs text-slate-400">
            Versão 1.0
          </p>
        </section>

        <div className="mt-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-lime-300 hover:text-lime-200"
          >
            ← Voltar ao painel principal
          </Link>
        </div>
      </div>
    </div>
  );
}