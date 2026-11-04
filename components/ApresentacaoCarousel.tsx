
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usuariosStore, sessaoStore } from "@/lib/users";
import ApresentacaoCarousel from "@/components/ApresentacaoCarousel";

export default function Home() {
  const router = useRouter();

  const [pronto, setPronto] = useState(false);
  const [existemUsuarios, setExistemUsuarios] = useState(false);
  const [adminLogado, setAdminLogado] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);
  const [modoCadastro, setModoCadastro] = useState(false);

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
    setModoCadastro(false);
    setErroLogin("");
    setErroReg("");
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setErroLogin("");
    setErroReg("");
  }

  function alternarModo() {
    setModoCadastro((valor) => !valor);
    setErroLogin("");
    setErroReg("");
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
        <div className="mx-auto flex h-[76px] max-w-[1250px] items-center justify-between px-5 md:px-8">

          <a href="#" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-extrabold text-white shadow-lg shadow-blue-900/30">
              R
            </div>

            <div>
              <p className="text-sm font-bold tracking-wide">
                REDE ESCOLAR
              </p>

              <p className="text-[9px] tracking-[2px] text-slate-500">
                GERENCIAMENTO DE INFRAESTRUTURA
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
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
            Acessar sistema <span aria-hidden="true">↗</span>
          </button>

        </div>
      </header>

      {/* ================================== */}
      {/* FAIXA DE INFORMAÇÕES */}
      {/* ================================== */}

      <div className="border-b border-lime-300/10 bg-lime-300 py-2.5 text-center">
        <p className="px-3 text-[10px] font-semibold tracking-wide text-[#17220C] md:text-xs">
          TECNOLOGIA, ORGANIZAÇÃO E CONTROLE PARA A INFRAESTRUTURA DA SUA ESCOLA
        </p>
      </div>

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
                Acessar sistema <span aria-hidden="true">→</span>
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
            O Sistema de Gerenciamento da Rede Escolar foi desenvolvido
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
              REDE ESCOLAR
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Sistema de Gerenciamento da Rede Escolar
            </p>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} · Todos os direitos reservados.
          </p>

        </div>
      </footer>

      {/* ================================== */}
      {/* MODAL DE LOGIN E CADASTRO */}
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
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal"
            className="relative my-auto w-full max-w-[460px] overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl"
          >

            {/* Botão fechar */}
            <button
              type="button"
              onClick={fecharModal}
              aria-label="Fechar janela"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-600 transition hover:bg-gray-200"
            >
              ×
            </button>

            {/* Cabeçalho */}
            <div className="bg-[#0B1522] px-7 pb-7 pt-8 text-center">

              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                R
              </div>

              <h2
                id="titulo-modal"
                className="text-2xl font-bold text-white"
              >
                {modoCadastro ? "Criar conta" : "Bem-vindo de volta"}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                {modoCadastro
                  ? "Preencha os dados para criar uma conta."
                  : "Entre com suas credenciais para continuar."}
              </p>
            </div>

            {/* Formulários */}
            <div className="px-7 py-7">

              {!modoCadastro ? (

                /* LOGIN */
                <form
                  onSubmit={handleLogin}
                  className="space-y-4"
                >
                  <div>
                    <label
                      htmlFor="login-usuario"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Usuário
                    </label>

                    <input
                      id="login-usuario"
                      type="text"
                      placeholder="Digite seu usuário"
                      autoComplete="username"
                      required
                      value={usuario}
                      onChange={(event) => setUsuario(event.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="login-senha"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Senha
                    </label>

                    <input
                      id="login-senha"
                      type="password"
                      placeholder="Digite sua senha"
                      autoComplete="current-password"
                      required
                      value={senha}
                      onChange={(event) => setSenha(event.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Link
                      href="/forgot-password"
                      onClick={fecharModal}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>

                  {erroLogin && (
                    <p
                      role="alert"
                      className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600"
                    >
                      {erroLogin}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    Entrar no sistema →
                  </button>

                </form>

              ) : (

                /* CADASTRO */
                <form
                  onSubmit={handleCadastro}
                  className="space-y-4"
                >
                  <div>
                    <label
                      htmlFor="cadastro-usuario"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Nome de usuário
                    </label>

                    <input
                      id="cadastro-usuario"
                      type="text"
                      placeholder="Crie um usuário"
                      autoComplete="username"
                      required
                      value={regUsuario}
                      onChange={(event) => setRegUsuario(event.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cadastro-senha"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Senha
                    </label>

                    <input
                      id="cadastro-senha"
                      type="password"
                      placeholder="Crie uma senha"
                      autoComplete="new-password"
                      required
                      value={regSenha}
                      onChange={(event) => setRegSenha(event.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cadastro-confirmar"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Confirmar senha
                    </label>

                    <input
                      id="cadastro-confirmar"
                      type="password"
                      placeholder="Digite a senha novamente"
                      autoComplete="new-password"
                      required
                      value={regConfirmar}
                      onChange={(event) => setRegConfirmar(event.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {erroReg && (
                    <p
                      role="alert"
                      className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600"
                    >
                      {erroReg}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    Criar conta →
                  </button>

                </form>
              )}

              {/* Alternar entre login e cadastro */}
              <div className="mt-6 border-t border-gray-100 pt-5 text-center">

                {podeCadastrar ? (
                  <p className="text-sm text-gray-500">
                    {modoCadastro
                      ? "Já possui uma conta?"
                      : "Ainda não possui uma conta?"}

                    <button
                      type="button"
                      onClick={() => {
                        alternarModo();
                      }}
                      className="ml-1 font-bold text-blue-600 hover:underline"
                    >
                      {modoCadastro ? "Entrar" : "Criar conta"}
                    </button>
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    O acesso de novos usuários é criado pelo administrador.
                  </p>
                )}

              </div>

              <p className="mt-5 text-center text-[10px] text-gray-400">
                SISTEMA DE GERENCIAMENTO DA REDE ESCOLAR
              </p>

            </div>
          </div>
        </div>
      )}

    </main>
  );
}
