
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usuariosStore, sessaoStore } from "@/lib/users";
import ApresentacaoCarousel from "@/components/ApresentacaoCarousel";

const inputClasse =
  "my-2 w-full rounded-lg bg-gray-100 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-gray-400";

const botaoClasse =
  "mt-3 rounded-lg bg-black px-11 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-gray-800";

const botaoPainelClasse =
  "mt-3 rounded-lg border border-white bg-transparent px-11 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10";

export default function Home() {
  const router = useRouter();

  const [pronto, setPronto] = useState(false);
  const [existemUsuarios, setExistemUsuarios] = useState(false);
  const [adminLogado, setAdminLogado] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);
  const [ativo, setAtivo] = useState(false); // false = Entrar | true = Criar conta

  // Dados do login
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erroLogin, setErroLogin] = useState("");

  // Dados do cadastro
  const [regUsuario, setRegUsuario] = useState("");
  const [regSenha, setRegSenha] = useState("");
  const [regConfirmar, setRegConfirmar] = useState("");
  const [erroReg, setErroReg] = useState("");

  useEffect(() => {
    setExistemUsuarios(usuariosStore.list().length > 0);
    setAdminLogado(!!sessaoStore.get()?.isAdmin);
    setPronto(true);
  }, []);

  // Fecha a janela com ESC e bloqueia a rolagem do fundo.
  useEffect(() => {
    if (!modalAberto) return;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function fecharComEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setModalAberto(false);
      }
    }

    window.addEventListener("keydown", fecharComEsc);

    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", fecharComEsc);
    };
  }, [modalAberto]);

  const podeCadastrar = !existemUsuarios || adminLogado;

  function abrirLogin() {
    setAtivo(false);
    setErroLogin("");
    setErroReg("");
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setErroLogin("");
    setErroReg("");
  }

  function trocar(paraCadastro: boolean) {
    setErroLogin("");
    setErroReg("");
    setAtivo(paraCadastro);
  }

  // Autenticação original do projeto
  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const encontrado = usuariosStore.autenticar(usuario, senha);

    if (!encontrado) {
      setErroLogin("Usuário ou senha incorretos.");
      return;
    }

    sessaoStore.set(encontrado);
    router.push("/dashboard");
  }

  // Cadastro original do projeto
  function handleCadastro(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!regUsuario || !regSenha) {
      setErroReg("Preencha usuário e senha.");
      return;
    }

    if (regSenha !== regConfirmar) {
      setErroReg("As senhas não coincidem.");
      return;
    }

    if (usuariosStore.existe(regUsuario)) {
      setErroReg("Esse nome de usuário já existe.");
      return;
    }

    const novo = usuariosStore.criar(regUsuario, regSenha);

    if (adminLogado) {
      router.push("/usuarios");
    } else {
      sessaoStore.set(novo);
      router.push("/dashboard");
    }
  }

  if (!pronto) {
    return (
      <main className="min-h-screen bg-[#080D14]" />
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#080D14] text-white">

      {/* ================================== */}
      {/* CABEÇALHO */}
      {/* ================================== */}

      <header className="relative z-20 border-b border-white/10 bg-[#080D14]">
        <div className="relative mx-auto flex h-[76px] max-w-[1250px] items-center justify-between px-5 md:px-8">

          <a href="#" className="flex items-center gap-3">
            <img src="/logo-nexo.png" alt="Nexo" className="h-10 w-10 object-contain" />

            <div>
              <p className="text-sm font-bold tracking-wide">
                NEXO
              </p>

              <p className="text-[9px] tracking-[2px] text-slate-500">
                GERENCIAMENTO DE REDE
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 md:absolute md:left-1/2 md:flex md:-translate-x-1/2">
            <a
              href="#inicio"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              Início
            </a>

            <a
              href="#recursos"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              Recursos
            </a>

            <a
              href="#sobre"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              Sobre
            </a>
          </nav>

          <button
            type="button"
            onClick={abrirLogin}
            className="rounded-lg bg-lime-300 px-5 py-2.5 text-sm font-bold text-[#101810] transition hover:bg-lime-200"
          >
            Entrar
          </button>

        </div>
      </header>

      {/* ================================== */}
      {/* APRESENTAÇÃO PRINCIPAL */}
      {/* ================================== */}

      <section
        id="inicio"
        className="relative overflow-hidden"
      >
        {/* Luzes decorativas */}
        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-lime-300/5 blur-[120px]" />

        <div className="relative mx-auto grid max-w-[1250px] items-center gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[1fr_0.95fr] lg:gap-14">

          {/* Texto principal */}
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/5 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-lime-300" />

              <span className="text-[10px] font-bold tracking-[2px] text-lime-300">
                GESTÃO INTELIGENTE DE REDES
              </span>
            </div>

            <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.08] tracking-tight md:text-6xl lg:text-[68px]">
              Toda sua rede.
              <br />

              <span className="text-lime-300">
                Em um só lugar.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 md:text-lg">
              Uma plataforma desenvolvida para facilitar o gerenciamento
              da infraestrutura de rede escolar. Organize salas,
              equipamentos, cabeamentos e conexões com mais praticidade.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={abrirLogin}
                className="rounded-lg bg-lime-300 px-7 py-4 text-sm font-bold text-[#101810] shadow-lg shadow-lime-300/10 transition hover:-translate-y-1 hover:bg-lime-200"
              >
                Entrar
              </button>

              <a
                href="#recursos"
                className="rounded-lg border border-white/15 px-7 py-4 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
              >
                Conhecer recursos
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-7">
              <div>
                <p className="text-lg font-bold text-white">
                  Organização
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Controle dos ambientes
                </p>
              </div>

              <div>
                <p className="text-lg font-bold text-white">
                  Inventário
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Gestão de equipamentos
                </p>
              </div>

              <div>
                <p className="text-lg font-bold text-white">
                  Certificação
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Testes de conexão
                </p>
              </div>
            </div>
          </div>

          {/* Carrossel */}
          <div className="w-full min-w-0">
            <ApresentacaoCarousel />
          </div>

        </div>
      </section>

      {/* ================================== */}
      {/* RECURSOS */}
      {/* ================================== */}

      <section
        id="recursos"
        className="border-t border-white/10 bg-[#0C141F] py-20"
      >
        <div className="mx-auto max-w-[1250px] px-5 md:px-8">

          <div className="mb-12 max-w-2xl">
            <p className="mb-4 text-xs font-bold tracking-[3px] text-lime-300">
              FUNCIONALIDADES
            </p>

            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Tudo o que você precisa para gerenciar sua rede.
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              Ferramentas para auxiliar na organização e no acompanhamento
              da infraestrutura tecnológica da escola.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {/* Recurso 1 */}
            <div className="rounded-2xl border border-white/10 bg-[#111D2A] p-7 transition hover:-translate-y-1 hover:border-blue-400/40">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-2xl text-blue-300">
                ⌘
              </div>

              <h3 className="text-lg font-bold text-white">
                Inventário de cabeamento
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                Registre pontos de rede, patch panels, switches,
                portas e categorias de cabos.
              </p>
            </div>

            {/* Recurso 2 */}
            <div className="rounded-2xl border border-white/10 bg-[#111D2A] p-7 transition hover:-translate-y-1 hover:border-blue-400/40">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/15 text-2xl text-cyan-300">
                ▦
              </div>

              <h3 className="text-lg font-bold text-white">
                Gerenciamento de salas
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                Organize os ambientes da escola e acompanhe
                os equipamentos cadastrados em cada sala.
              </p>
            </div>

            {/* Recurso 3 */}
            <div className="rounded-2xl border border-white/10 bg-[#111D2A] p-7 transition hover:-translate-y-1 hover:border-blue-400/40">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-lime-300/10 text-2xl text-lime-300">
                ✓
              </div>

              <h3 className="text-lg font-bold text-white">
                Testes de certificação
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                Registre testes e confira os resultados de
                certificação das conexões.
              </p>
            </div>

            {/* Recurso 4 */}
            <div className="rounded-2xl border border-white/10 bg-[#111D2A] p-7 transition hover:-translate-y-1 hover:border-blue-400/40">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/15 text-2xl text-purple-300">
                ▤
              </div>

              <h3 className="text-lg font-bold text-white">
                Gerador de etiquetas
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                Gere identificações para facilitar a localização
                e a organização dos pontos de rede.
              </p>
            </div>

            {/* Recurso 5 */}
            <div className="rounded-2xl border border-white/10 bg-[#111D2A] p-7 transition hover:-translate-y-1 hover:border-blue-400/40">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/15 text-2xl text-orange-300">
                ♙
              </div>

              <h3 className="text-lg font-bold text-white">
                Gerenciamento de usuários
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                Controle as contas de acesso e as permissões
                de utilização do sistema.
              </p>
            </div>

            {/* Recurso 6 */}
            <div className="rounded-2xl border border-white/10 bg-[#111D2A] p-7 transition hover:-translate-y-1 hover:border-blue-400/40">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/15 text-2xl text-green-300">
                ⚙
              </div>

              <h3 className="text-lg font-bold text-white">
                Controle da infraestrutura
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                Centralize informações importantes para facilitar
                o acompanhamento e a manutenção da rede.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================================== */}
      {/* SOBRE */}
      {/* ================================== */}

      <section
        id="sobre"
        className="border-t border-white/10 py-20"
      >
        <div className="mx-auto max-w-[1000px] px-5 text-center md:px-8">

          <p className="mb-4 text-xs font-bold tracking-[3px] text-lime-300">
            SOBRE A PLATAFORMA
          </p>

          <h2 className="text-3xl font-extrabold text-white md:text-4xl">
            Tecnologia a serviço da organização escolar.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-slate-400 md:text-base">
            O Nexo, sistema de gerenciamento de rede, foi desenvolvido
            para auxiliar na organização da infraestrutura de redes,
            oferecendo recursos para cadastrar ambientes, controlar
            cabeamentos, identificar conexões e acompanhar os equipamentos.
          </p>

          <button
            type="button"
            onClick={abrirLogin}
            className="mt-8 rounded-lg bg-lime-300 px-7 py-4 text-sm font-bold text-[#101810] transition hover:bg-lime-200"
          >
            Começar a utilizar →
          </button>

        </div>
      </section>

      {/* ================================== */}
      {/* RODAPÉ */}
      {/* ================================== */}

      <footer className="border-t border-white/10 bg-[#060B12] py-8">
        <div className="mx-auto flex max-w-[1250px] flex-col items-center justify-between gap-4 px-5 text-center md:flex-row md:px-8 md:text-left">

          <div>
            <p className="text-sm font-bold text-white">
              NEXO
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Sistema de Gerenciamento de Rede
            </p>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} · Todos os direitos reservados.
          </p>

        </div>
      </footer>

      {/* ================================== */}
      {/* MODAL DE LOGIN E CADASTRO (animado) */}
      {/* ================================== */}

      {modalAberto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 px-4 py-8 backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              fecharModal();
            }
          }}
        >
          <style>{`
            @keyframes move {
              0%, 49.99% { opacity: 0; z-index: 1; }
              50%, 100% { opacity: 1; z-index: 5; }
            }
          `}</style>

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Entrar ou criar conta"
            className="relative my-auto min-h-[520px] w-[768px] max-w-full overflow-hidden rounded-[30px] bg-white shadow-[0_5px_15px_rgba(0,0,0,0.35)]"
          >
            {/* Botão fechar */}
            <button
              type="button"
              onClick={fecharModal}
              aria-label="Fechar janela"
              className="absolute right-4 top-4 z-[1100] flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-600 transition hover:bg-gray-200"
            >
              ×
            </button>

            {/* ---------- Criar conta ---------- */}
            <div
              className={`absolute left-0 top-0 h-full w-full transition-all duration-[600ms] ease-in-out md:w-1/2 ${
                ativo
                  ? "z-[5] opacity-100 md:translate-x-full md:animate-[move_0.6s]"
                  : "z-[1] opacity-0 max-md:hidden"
              }`}
            >
              <form
                onSubmit={handleCadastro}
                className="flex h-full flex-col items-center justify-center bg-white px-10"
              >
                <h1 className="mb-4 text-3xl font-bold text-gray-900">Criar Conta</h1>
                <span className="mb-2 text-xs text-gray-500">
                  {existemUsuarios ? "Cadastre um novo usuário" : "Crie a conta do administrador"}
                </span>

                <input
                  type="text"
                  placeholder="Usuário"
                  required
                  value={regUsuario}
                  onChange={(e) => setRegUsuario(e.target.value)}
                  className={inputClasse}
                />
                <input
                  type="password"
                  placeholder="Senha"
                  required
                  value={regSenha}
                  onChange={(e) => setRegSenha(e.target.value)}
                  className={inputClasse}
                />
                <input
                  type="password"
                  placeholder="Confirmar senha"
                  required
                  value={regConfirmar}
                  onChange={(e) => setRegConfirmar(e.target.value)}
                  className={inputClasse}
                />

                {erroReg && <p className="mt-1 text-center text-sm text-red-500">{erroReg}</p>}

                <button type="submit" className={botaoClasse}>
                  Criar conta
                </button>

                <button
                  type="button"
                  onClick={() => trocar(false)}
                  className="mt-4 text-sm text-gray-600 hover:underline md:hidden"
                >
                  Já tenho conta
                </button>
              </form>
            </div>

            {/* ---------- Entrar ---------- */}
            <div
              className={`absolute left-0 top-0 z-[2] h-full w-full transition-all duration-[600ms] ease-in-out md:w-1/2 ${
                ativo ? "md:translate-x-full max-md:hidden" : ""
              }`}
            >
              <form
                onSubmit={handleLogin}
                className="flex h-full flex-col items-center justify-center bg-white px-10"
              >
                <h1 className="mb-4 text-3xl font-bold text-gray-900">Entrar</h1>
                <span className="mb-2 text-xs text-gray-500">use seu usuário e senha</span>

                <input
                  type="text"
                  placeholder="Usuário"
                  required
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className={inputClasse}
                />
                <input
                  type="password"
                  placeholder="Senha"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className={inputClasse}
                />

                <Link
                  href="/forgot-password"
                  onClick={fecharModal}
                  className="mb-1 mt-3 text-sm text-gray-700 hover:underline"
                >
                  Esqueceu a senha?
                </Link>

                {erroLogin && <p className="mt-1 text-center text-sm text-red-500">{erroLogin}</p>}

                <button type="submit" className={botaoClasse}>
                  Entrar
                </button>

                {podeCadastrar && (
                  <button
                    type="button"
                    onClick={() => trocar(true)}
                    className="mt-4 text-sm text-gray-600 hover:underline md:hidden"
                  >
                    Criar uma conta
                  </button>
                )}
              </form>
            </div>

            {/* ---------- Painel que desliza (só no computador/tablet) ---------- */}
            <div
              className={`absolute left-1/2 top-0 z-[1000] hidden h-full w-1/2 overflow-hidden transition-all duration-[600ms] ease-in-out md:block ${
                ativo ? "-translate-x-full rounded-[0_150px_100px_0]" : "rounded-[150px_0_0_100px]"
              }`}
            >
              <div
                className={`relative -left-full h-full w-[200%] bg-gradient-to-r from-gray-700 to-black text-white transition-all duration-[600ms] ease-in-out ${
                  ativo ? "translate-x-1/2" : "translate-x-0"
                }`}
              >
                {/* Painel esquerdo: aparece em "Criar conta" */}
                <div
                  className={`absolute top-0 flex h-full w-1/2 flex-col items-center justify-center px-8 text-center transition-all duration-[600ms] ease-in-out ${
                    ativo ? "translate-x-0" : "-translate-x-[200%]"
                  }`}
                >
                  <h1 className="text-3xl font-bold">Bem-vindo de volta!</h1>
                  <p className="my-5 text-sm leading-5 tracking-wide">
                    Já tem uma conta? Entre com seus dados para acessar o sistema.
                  </p>
                  <button type="button" onClick={() => trocar(false)} className={botaoPainelClasse}>
                    Entrar
                  </button>
                </div>

                {/* Painel direito: aparece em "Entrar" */}
                <div
                  className={`absolute right-0 top-0 flex h-full w-1/2 flex-col items-center justify-center px-8 text-center transition-all duration-[600ms] ease-in-out ${
                    ativo ? "translate-x-[200%]" : "translate-x-0"
                  }`}
                >
                  {podeCadastrar ? (
                    <>
                      <h1 className="text-3xl font-bold">
                        {existemUsuarios ? "Olá, amigo!" : "Primeiro acesso"}
                      </h1>
                      <p className="my-5 text-sm leading-5 tracking-wide">
                        {existemUsuarios
                          ? "Cadastre um novo usuário para usar o sistema."
                          : "Crie a conta do administrador para começar a usar o sistema."}
                      </p>
                      <button type="button" onClick={() => trocar(true)} className={botaoPainelClasse}>
                        Criar conta
                      </button>
                    </>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold">Novo por aqui?</h1>
                      <p className="my-5 text-sm leading-5 tracking-wide">
                        Peça ao administrador do sistema para criar a sua conta.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
