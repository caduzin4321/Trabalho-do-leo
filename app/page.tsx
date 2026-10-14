"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usuariosStore, sessaoStore } from "@/lib/users";

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
  const [ativo, setAtivo] = useState(false); // false = Entrar | true = Criar conta

  // Login
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erroLogin, setErroLogin] = useState("");

  // Cadastro
  const [regUsuario, setRegUsuario] = useState("");
  const [regSenha, setRegSenha] = useState("");
  const [regConfirmar, setRegConfirmar] = useState("");
  const [erroReg, setErroReg] = useState("");

  useEffect(() => {
    setExistemUsuarios(usuariosStore.list().length > 0);
    setAdminLogado(!!sessaoStore.get()?.isAdmin);
    setPronto(true);
  }, []);

  // Mesma regra do /register: a primeira conta é livre (vira admin);
  // depois disso, só o admin logado cria novas contas.
  const podeCadastrar = !existemUsuarios || adminLogado;

  function trocar(paraCadastro: boolean) {
    setErroLogin("");
    setErroReg("");
    setAtivo(paraCadastro);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const encontrado = usuariosStore.autenticar(usuario, senha);
    if (!encontrado) {
      setErroLogin("Usuário ou senha incorretos.");
      return;
    }
    sessaoStore.set(encontrado);
    router.push("/dashboard");
  }

  function handleCadastro(e: React.FormEvent) {
    e.preventDefault();
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
      // Admin criando conta de outra pessoa: não troca a própria sessão
      router.push("/usuarios");
    } else {
      // Primeira conta do site: entra automaticamente como admin
      sessaoStore.set(novo);
      router.push("/dashboard");
    }
  }

  if (!pronto) {
    return <div className="min-h-screen bg-transparent" />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent px-4">
      <style>{`
        @keyframes move {
          0%, 49.99% { opacity: 0; z-index: 1; }
          50%, 100% { opacity: 1; z-index: 5; }
        }
      `}</style>

      <div className="relative min-h-[520px] w-[768px] max-w-full overflow-hidden rounded-[30px] bg-white shadow-[0_5px_15px_rgba(0,0,0,0.35)]">
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
            {/* Painel esquerdo: aparece quando está em "Criar conta" */}
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

            {/* Painel direito: aparece quando está em "Entrar" */}
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
  );
}