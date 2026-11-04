
"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    categoria: "GERENCIAMENTO DE REDES",
    titulo: "Sua rede escolar em um só lugar.",
    descricao:
      "Organize salas, equipamentos e conexões com praticidade e eficiência.",
    destaque: "Controle total da infraestrutura",
    numero: "01",
    cor: "from-blue-600/30 to-cyan-500/10",
  },
  {
    categoria: "INVENTÁRIO INTELIGENTE",
    titulo: "Tenha controle de cada conexão.",
    descricao:
      "Gerencie pontos de rede, switches, patch panels e cabeamentos.",
    destaque: "Inventário organizado",
    numero: "02",
    cor: "from-cyan-600/30 to-blue-500/10",
  },
  {
    categoria: "ORGANIZAÇÃO ESCOLAR",
    titulo: "Cada sala conectada e organizada.",
    descricao:
      "Consulte ambientes, acompanhe equipamentos e facilite a manutenção.",
    destaque: "Infraestrutura eficiente",
    numero: "03",
    cor: "from-indigo-600/30 to-blue-500/10",
  },
];

export default function ApresentacaoCarousel() {
  const [atual, setAtual] = useState(0);

  useEffect(() => {
    const intervalo = window.setInterval(() => {
      setAtual((anterior) => (anterior + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(intervalo);
  }, []);

  function anterior() {
    setAtual((valor) => (valor - 1 + slides.length) % slides.length);
  }

  function proximo() {
    setAtual((valor) => (valor + 1) % slides.length);
  }

  const slide = slides[atual];

  return (
    <section
      aria-label="Apresentação do sistema"
      className="relative flex min-h-[340px] flex-col overflow-hidden rounded-[28px] border border-blue-400/20 bg-[#081525] p-6 text-white shadow-2xl shadow-black/30 lg:h-[520px] lg:min-h-0 lg:p-8"
    >
      {/* Efeitos de fundo */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${slide.cor} transition-all duration-700`}
      />

      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Cabeçalho */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold shadow-lg shadow-blue-900/40">
            R
          </div>

          <div>
            <h2 className="font-bold tracking-wide">
              REDE ESCOLAR
            </h2>

            <p className="text-[10px] tracking-[2px] text-blue-300">
              GESTÃO INTELIGENTE
            </p>
          </div>
        </div>

        <span className="rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1 text-[10px] font-semibold text-blue-200">
          SISTEMA
        </span>
      </div>

      {/* Conteúdo do cartaz */}
      <div
        key={atual}
        className="relative z-10 my-auto animate-[aparecer_0.6s_ease]"
        aria-live="polite"
      >
        <p className="mb-4 mt-8 text-[10px] font-bold tracking-[3px] text-cyan-300">
          {slide.categoria}
        </p>

        <h1 className="max-w-md text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
          {slide.titulo}
        </h1>

        <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
          {slide.descricao}
        </p>

        {/* Ilustração de painel de rede */}
        <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.05] p-4 shadow-xl backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">
              Painel de infraestrutura
            </span>

            <span className="flex items-center gap-2 text-[10px] text-green-300">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Organizado
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { icone: "▦", nome: "Salas" },
              { icone: "⌘", nome: "Conexões" },
              { icone: "▤", nome: "Inventário" },
            ].map((item) => (
              <div
                key={item.nome}
                className="rounded-xl border border-white/10 bg-[#10243c] p-3 text-center"
              >
                <span className="block text-2xl text-cyan-300">
                  {item.icone}
                </span>

                <span className="mt-1 block text-[10px] text-slate-300">
                  {item.nome}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <span className="block h-full w-3/4 rounded-full bg-blue-400" />
            </span>

            <span className="text-[10px] text-slate-400">
              {slide.destaque}
            </span>
          </div>
        </div>
      </div>

      {/* Rodapé e controles */}
      <div className="relative z-10 mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <div>
          <p className="text-[10px] tracking-widest text-slate-400">
            CONHEÇA NOSSO SISTEMA
          </p>

          <p className="mt-1 text-xs font-semibold text-blue-200">
            Tecnologia e organização
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={anterior}
            aria-label="Cartaz anterior"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
          >
            ‹
          </button>

          <span className="min-w-10 text-center text-xs font-semibold text-blue-200">
            {slide.numero} / 03
          </span>

          <button
            type="button"
            onClick={proximo}
            aria-label="Próximo cartaz"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
          >
            ›
          </button>
        </div>
      </div>

      {/* Indicadores */}
      <div className="relative z-10 mt-3 flex gap-2">
        {slides.map((item, indice) => (
          <button
            key={item.numero}
            type="button"
            onClick={() => setAtual(indice)}
            aria-label={`Ir para cartaz ${indice + 1}`}
            aria-current={atual === indice ? "true" : undefined}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              atual === indice
                ? "w-9 bg-blue-400"
                : "w-3 bg-white/20 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes aparecer {
          from {
            opacity: 0;
            transform: translateY(10px);
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
