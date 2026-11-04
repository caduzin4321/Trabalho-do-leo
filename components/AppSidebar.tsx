"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { sessaoStore, type Sessao } from "@/lib/users";

const MENU = [
  {
    titulo: "Principal",
    itens: [
      { nome: "Visão geral", href: "/dashboard", icone: "⌂" },
      { nome: "Minhas salas", href: "/dashboard#salas", icone: "▦" },
    ],
  },
  {
    titulo: "Gerenciamento",
    itens: [
      { nome: "Inventário de cabeamento", href: "/inventario", icone: "⌘" },
      { nome: "Gerador de etiquetas", href: "/etiquetas", icone: "▤" },
      { nome: "Testes de certificação", href: "/certificacao", icone: "✓" },
    ],
  },
];

export default function AppSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [carregado, setCarregado] = useState(false);
  const [recolhida, setRecolhida] = useState(false);
  const [mobileAberto, setMobileAberto] = useState(false);

  useEffect(() => {
    setSessao(sessaoStore.get());

    const preferencia = localStorage.getItem("sidebar-recolhida");
    setRecolhida(preferencia === "true");

    setCarregado(true);
  }, []);

  useEffect(() => {
    setMobileAberto(false);
  }, [pathname]);

  function alternarSidebar() {
    const novoEstado = !recolhida;

    setRecolhida(novoEstado);
    localStorage.setItem("sidebar-recolhida", String(novoEstado));
  }

  function sair() {
    sessaoStore.clear();
    router.push("/");
  }

  // Não mostrar a barra na tela de login e recuperação de senha.
  if (
    !carregado ||
    !sessao ||
    pathname === "/" ||
    pathname === "/forgot-password"
  ) {
    return <>{children}</>;
  }

  const menuAdmin = [
    { nome: "Usuários", href: "/usuarios", icone: "♙" },
    { nome: "Criar conta", href: "/register", icone: "+" },
  ];

  const menuUsuario = [
    { nome: "Configurações", href: "/configuracoes", icone: "⚙" },
  ];

  function linkAtivo(href: string) {
    const caminho = href.split("#")[0];

    if (href.includes("#")) {
      return pathname === caminho;
    }

    return pathname === href;
  }

  function renderLink(
    item: { nome: string; href: string; icone: string },
    indice: number
  ) {
    const ativo = linkAtivo(item.href);

    return (
      <Link
        key={`${item.href}-${indice}`}
        href={item.href}
        title={recolhida ? item.nome : undefined}
        onClick={() => setMobileAberto(false)}
        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
          ativo
            ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
            : "text-slate-300 hover:bg-white/10 hover:text-white"
        }`}
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center text-lg">
          {item.icone}
        </span>

        {!recolhida && <span>{item.nome}</span>}
      </Link>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Botão do menu para celular */}
      <button
        type="button"
        onClick={() => setMobileAberto(!mobileAberto)}
        className="fixed left-4 top-4 z-[60] rounded-lg border border-white/10 bg-slate-900 p-3 text-white shadow-lg lg:hidden"
        aria-label="Abrir menu"
      >
        ☰
      </button>

      {/* Fundo escuro do menu mobile */}
      {mobileAberto && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setMobileAberto(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* Barra lateral */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/10 bg-[#081525] text-white shadow-2xl transition-all duration-300 ${
          recolhida ? "w-20" : "w-72"
        } ${
          mobileAberto
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo e nome */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold">
              R
            </div>

            {!recolhida && (
              <div className="min-w-0">
                <h2 className="truncate font-bold">Rede Escolar</h2>
                <p className="text-xs text-slate-400">
                  Gerenciamento de rede
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={alternarSidebar}
            className="hidden rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:block"
            title="Recolher ou expandir menu"
          >
            {recolhida ? "»" : "«"}
          </button>

          <button
            type="button"
            onClick={() => setMobileAberto(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
          >
            ✕
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex-1 space-y-7 overflow-y-auto p-3">
          {MENU.map((grupo) => (
            <section key={grupo.titulo}>
              {!recolhida && (
                <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  {grupo.titulo}
                </p>
              )}

              <div className="space-y-1">
                {grupo.itens.map(renderLink)}
              </div>
            </section>
          ))}

          <section>
            {!recolhida && (
              <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                Conta
              </p>
            )}

            <div className="space-y-1">
              {sessao.isAdmin &&
                menuAdmin.map(renderLink)}

              {menuUsuario.map(renderLink)}
            </div>
          </section>
        </nav>

        {/* Usuário conectado */}
        <div className="border-t border-white/10 p-3">
          {!recolhida && (
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold">
                {sessao.nomeUsuario.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {sessao.nomeUsuario}
                </p>
                <p className="text-xs text-slate-400">
                  {sessao.isAdmin ? "Administrador" : "Usuário"}
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={sair}
            title={recolhida ? "Sair da conta" : undefined}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center text-lg">
              ↪
            </span>

            {!recolhida && "Sair da conta"}
          </button>
        </div>
      </aside>

      {/* Conteúdo das páginas */}
      <main
        className={`min-h-screen min-w-0 transition-all duration-300 ${
          recolhida ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        {children}
      </main>
    </div>
  );
}