"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { sessaoStore, type Sessao } from "@/lib/users";
import {
  IconHome,
  IconSala,
  IconClipboard,
  IconTag,
  IconShield,
  IconUsers,
  IconUserPlus,
  IconLogout,
  IconNetwork,
  IconMenu,
} from "@/components/icons";

export default function AppShell({
  titulo,
  subtitulo,
  children,
}: {
  titulo: string;
  subtitulo?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    const s = sessaoStore.get();
    if (!s) {
      router.push("/");
      return;
    }
    setSessao(s);
  }, [router]);

  function sair() {
    sessaoStore.clear();
    router.push("/");
  }

  if (!sessao) return null;

  const itens = [
    { href: "/dashboard", label: "Visão Geral", Icon: IconHome },
    { href: "/dashboard#salas", label: "Salas", Icon: IconSala },
    { href: "/inventario", label: "Inventário", Icon: IconClipboard },
    { href: "/etiquetas", label: "Gerador de Etiquetas", Icon: IconTag },
    { href: "/certificacao", label: "Testes de Certificação", Icon: IconShield },
    { href: "/usuarios", label: "Usuários", Icon: IconUsers },
  ];

  const sidebar = (
    <div className="flex h-full flex-col bg-[#0a1f4f] text-slate-200">
      <div className="flex items-center gap-2 px-6 py-6 text-white">
        <IconNetwork className="h-9 w-9 text-blue-400" />
        <span className="text-2xl font-bold">NetControl</span>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {itens.map(({ href, label, Icon }) => {
          const ativo = href === pathname; // "Salas" (com #) nunca fica marcado
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuAberto(false)}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                ativo ? "bg-blue-600 text-white" : "hover:bg-white/10"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}

        {sessao.isAdmin && (
          <Link
            href="/register"
            onClick={() => setMenuAberto(false)}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
              pathname === "/register" ? "bg-blue-600 text-white" : "hover:bg-white/10"
            }`}
          >
            <IconUserPlus className="h-5 w-5" />
            Criar Conta
          </Link>
        )}
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <button
          onClick={sair}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium hover:bg-white/10"
        >
          <IconLogout className="h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 lg:pl-64">
      {/* Menu lateral (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">{sidebar}</aside>

      {/* Menu lateral (celular) */}
      {menuAberto && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setMenuAberto(false)} />
          <aside className="absolute inset-y-0 left-0 w-64">{sidebar}</aside>
        </div>
      )}

      <header className="flex items-start justify-between gap-4 px-6 pb-2 pt-8">
        <div className="flex items-start gap-3">
          <button
            onClick={() => setMenuAberto(true)}
            className="mt-1 rounded-md p-1 text-slate-700 hover:bg-slate-200 lg:hidden"
            aria-label="Abrir menu"
          >
            <IconMenu className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-[#0a1f4f]">{titulo}</h1>
            {subtitulo && <p className="mt-1 text-slate-500">{subtitulo}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold uppercase text-blue-700">
            {sessao.nomeUsuario.slice(0, 1)}
          </div>
          <div className="hidden text-sm sm:block">
            <p className="font-semibold text-slate-800">{sessao.nomeUsuario}</p>
            <p className="text-xs text-slate-500">{sessao.isAdmin ? "Administrador" : "Usuário"}</p>
          </div>
        </div>
      </header>

      <main className="px-6 py-6">{children}</main>
    </div>
  );
}