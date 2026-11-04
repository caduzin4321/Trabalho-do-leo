
"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    numero: "01",
    categoria: "INFRAESTRUTURA DE REDE",
    titulo: "Conectividade organizada.",
    destaque: "Organização",
    descricao:
      "Gerencie pontos de rede, switches, patch panels e cabeamentos em um só lugar.",
    itens: [
      { simbolo: "⌘", nome: "Pontos de rede" },
      { simbolo: "▣", nome: "Switches" },
      { simbolo: "⌁", nome: "Cabeamento" },
    ],
  },
  {
    numero: "02",
    categoria: "GERENCIAMENTO ESCOLAR",
    titulo: "Cada sala sob controle.",
    destaque: "Gerenciamento",
    descricao:
      "Organize os ambientes da escola e acompanhe os equipamentos cadastrados em cada sala.",
    itens: [
      { simbolo: "▦", nome: "Salas" },
      { simbolo: "▣", nome: "Equipamentos" },
      { simbolo: "◇", nome: "Ambientes" },
    ],
  },
  {
    numero: "03",
    categoria: "CONTROLE E CERTIFICAÇÃO",
    titulo: "Mais controle para sua rede.",
    destaque: "Segurança",
    descricao:
      "Gere etiquetas, identifique conexões e registre testes de certificação da infraestrutura.",
    itens: [
      { simbolo: "✓", nome: "Certificação" },
      { simbolo: "▤", nome: "Etiquetas" },
      { simbolo: "↗", nome: "Conexões" },
    ],
  },
];

export default function ApresentacaoCarousel() {
  const [atual, setAtual] = useState(0);
  const slide = slides[atual];

  function proximo() {
    setAtual((valor) => (valor + 1) % slides.length);
  }

  function anterior() {
    setAtual((valor) => (valor - 1 + slides.length) % slides.length);
  }

  useEffect(() => {
    const intervalo = window.setInterval(() => {
      setAtual((valor) => (valor + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(intervalo);
  }, []);

  return (
    <section
      aria-label="Apresentação dos recursos do sistema"
      className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#101B2A] p-5 shadow-2xl md:p-7"
    >
      {/* Efeitos de iluminação */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-[90px]" />

      <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-lime-400/10 blur-[90px]" />

      {/* Cabeçalho do carrossel */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-extrabold text-white">
            R
          </div>

          <div>
            <p className="text-sm font-bold text-white">
              REDE ESCOLAR
            </p>

            <p className="text-[9px] tracking-[2px] text-slate-400">
              GESTÃO DE INFRAESTRUTURA
            </p>
          </div>
        </div>

        <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-[9px] font-bold tracking-wider text-lime-300">
          PLATAFORMA
        </span>
      </div>

      {/* Conteúdo */}
      <div
        key={atual}
        className="relative z-10 my-8 min-h-[290px] animate-[aparecer_0.5s_ease]"
        aria-live="polite"
      >
        <p className="mb-5 text-[10px] font-bold tracking-[3px] text-lime-300">
          {slide.categoria}
        </p>

        <h2 className="max-w-md text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl">
          {slide.titulo}
        </h2>

        <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
          {slide.descricao}
        </p>

        {/* Painel ilustrativo */}
        <div className="mt-8 rounded-xl border border-white/10 bg-[#080F19]/80 p-4">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              Recursos da plataforma
            </span>

            <span className="flex items-center gap-2 text-[10px] text-green-400">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Organizado
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {slide.itens.map((item) => (
              <div
                key={item.nome}
                className="flex min-w-0 flex-col items-center justify-center rounded-lg border border-blue-400/10 bg-[#142438] px-1 py-5 transition hover:border-blue-400/40"
              >
                <span className="text-2xl text-cyan-300">
                  {item.simbolo}
                </span>

                <span className="mt-2 text-center text-[10px] text-slate-300">
                  {item.nome}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-xs text-slate-400">
              {slide.destaque}
            </span>

            <span className="text-xs font-bold text-lime-300">
              {slide.numero} / 03
            </span>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-5">
        <div className="flex items-center gap-2">
          {slides.map((item, indice) => (
            <button
              key={item.numero}
              type="button"
              onClick={() => setAtual(indice)}
              aria-label={`Ir para apresentação ${indice + 1}`}
              aria-current={atual === indice ? "true" : undefined}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                atual === indice
                  ? "w-9 bg-lime-300"
                  : "w-3 bg-slate-600 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={anterior}
            aria-label="Apresentação anterior"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-lg text-white transition hover:bg-white/10"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={proximo}
            aria-label="Próxima apresentação"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-lg text-white transition hover:bg-white/10"
          >
            ›
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes aparecer {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
