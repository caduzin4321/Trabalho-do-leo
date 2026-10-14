"use client";

import { useState } from "react";
import Link from "next/link";
import { usuariosStore } from "@/lib/users";

const inputClasse =
  "my-2 w-full rounded-lg bg-gray-100 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-gray-400";

const botaoClasse =
  "mt-3 rounded-lg bg-black px-11 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-gray-800";

const botaoPainelClasse =
  "mt-3 inline-block rounded-lg border border-white bg-transparent px-11 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10";

export default function EsqueciSenhaPage() {
  const [usuario, setUsuario] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!usuario.trim() || !novaSenha) {
      setErro("Preencha o usuário e a nova senha.");
      return;
    }
    if (novaSenha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }

    const ok = usuariosStore.redefinirSenha(usuario.trim(), novaSenha);
    if (!ok) {
      setErro("Usuário não encontrado.");
      return;
    }
    setSucesso(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="relative min-h-[520px] w-[768px] max-w-full overflow-hidden rounded-[30px] bg-white shadow-[0_5px_15px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
        {/* ---------- Formulário ---------- */}
        <div className="absolute left-0 top-0 h-full w-full md:w-1/2">
          {sucesso ? (
            <div className="flex h-full flex-col items-center justify-center bg-white px-10 text-center">
              <h1 className="mb-3 text-3xl font-bold text-gray-900">Senha alterada!</h1>
              <p className="mb-2 text-sm text-gray-600">
                Sua senha foi redefinida. Agora é só entrar com a nova senha.
              </p>
              <Link href="/" className={botaoClasse}>
                Ir para o login
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex h-full flex-col items-center justify-center bg-white px-10"
            >
              <h1 className="mb-4 text-center text-3xl font-bold text-gray-900">Esqueci a senha</h1>
              <span className="mb-2 text-center text-xs text-gray-500">
                informe seu usuário e escolha uma nova senha
              </span>

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
                placeholder="Nova senha"
                required
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className={inputClasse}
              />
              <input
                type="password"
                placeholder="Confirmar nova senha"
                required
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                className={inputClasse}
              />

              {erro && <p className="mt-1 text-center text-sm text-red-500">{erro}</p>}

              <button type="submit" className={botaoClasse}>
                Redefinir senha
              </button>

              <Link href="/" className="mt-4 text-sm text-gray-600 hover:underline md:hidden">
                Voltar ao login
              </Link>
            </form>
          )}
        </div>

        {/* ---------- Painel lateral (só no computador/tablet) ---------- */}
        <div className="absolute left-1/2 top-0 hidden h-full w-1/2 overflow-hidden rounded-[150px_0_0_100px] md:block">
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-r from-gray-700 to-black px-8 text-center text-white">
            <h1 className="text-3xl font-bold">Lembrou da senha?</h1>
            <p className="my-5 text-sm leading-5 tracking-wide">
              Volte para a tela de login e entre com os seus dados.
            </p>
            <Link href="/" className={botaoPainelClasse}>
              Voltar ao login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}