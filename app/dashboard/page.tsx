"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { salasStore, type Sala } from "@/lib/salas";
import { pontosRedeStore, patchPanelsStore, switchesStore } from "@/lib/storage";
import type { PontoRede, PatchPanel, SwitchEquip } from "@/lib/types";
import { Input, Label, Button } from "@/components/ui";
import {
  IconSala,
  IconPort,
  IconServer,
  IconBolt,
  IconArrow,
  IconPulse,
  IconCheck,
  IconAlert,
  IconPlug,
  IconTag,
  IconShield,
  IconClipboard,
  IconPlus,
  IconEye,
  IconPencil,
  IconTrash,
} from "@/components/icons";

const norm = (s: string) => (s ?? "").trim().toLowerCase();

function Modal({
  titulo,
  onClose,
  children,
  largura = "max-w-md",
}: {
  titulo: string;
  onClose: () => void;
  children: ReactNode;
  largura?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4"
      onClick={onClose}
    >
      <div
        className={`max-h-[85vh] w-full ${largura} overflow-y-auto rounded-xl bg-white p-6 shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-[#0a1f4f]">{titulo}</h2>
          <button
            onClick={onClose}
            className="text-2xl leading-none text-slate-400 hover:text-slate-700"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function CardResumo({
  icone,
  cor,
  titulo,
  valor,
  legenda,
}: {
  icone: ReactNode;
  cor: string;
  titulo: string;
  valor: string | number;
  legenda: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${cor}`}>
        {icone}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">{titulo}</p>
        <p className="text-4xl font-bold text-[#0a1f4f]">{valor}</p>
        <p className="text-xs text-slate-400">{legenda}</p>
      </div>
    </div>
  );
}

function Selo({ tipo, children }: { tipo: "ok" | "aviso"; children: ReactNode }) {
  const estilos =
    tipo === "ok"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-amber-50 text-amber-700 border-amber-200";
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${estilos}`}
    >
      {tipo === "ok" ? <IconCheck className="h-3.5 w-3.5" /> : <IconAlert className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}

export default function DashboardPage() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [pontos, setPontos] = useState<PontoRede[]>([]);
  const [patchPanels, setPatchPanels] = useState<PatchPanel[]>([]);
  const [switches, setSwitches] = useState<SwitchEquip[]>([]);

  const [modalNova, setModalNova] = useState(false);
  const [formNova, setFormNova] = useState({ nome: "", bloco: "", descricao: "" });
  const [erro, setErro] = useState("");

  const [detalhesId, setDetalhesId] = useState<string | null>(null);
  const [editarId, setEditarId] = useState<string | null>(null);
  const [formEdit, setFormEdit] = useState({ bloco: "", descricao: "" });

  function refresh() {
    setSalas(salasStore.list());
    setPontos(pontosRedeStore.list());
    setPatchPanels(patchPanelsStore.list());
    setSwitches(switchesStore.list());
  }

  useEffect(refresh, []);

  const pontosDaSala = (s: Sala) => pontos.filter((p) => norm(p.local) === norm(s.nome));
  const ppDaSala = (s: Sala) => patchPanels.filter((p) => norm(p.local) === norm(s.nome));
  const swDaSala = (s: Sala) => switches.filter((w) => norm(w.local) === norm(s.nome));

  // ---- Status da infraestrutura ----
  const pontosIncompletos = pontos.filter(
    (p) =>
      !patchPanels.some((x) => x.id === p.patchPanelId) ||
      !switches.some((x) => x.id === p.switchId)
  ).length;
  const totalEquip = patchPanels.length + switches.length;

  // ---- Ações ----
  function abrirNova() {
    setFormNova({ nome: "", bloco: "", descricao: "" });
    setErro("");
    setModalNova(true);
  }

  function salvarNova(e: React.FormEvent) {
    e.preventDefault();
    const nome = formNova.nome.trim();
    if (!nome) {
      setErro("Informe o nome da sala.");
      return;
    }
    if (salas.some((s) => norm(s.nome) === norm(nome))) {
      setErro("Já existe uma sala com esse nome.");
      return;
    }
    salasStore.criar({
      nome,
      bloco: formNova.bloco.trim() || undefined,
      descricao: formNova.descricao.trim() || undefined,
    });
    refresh();
    setModalNova(false);
  }

  function abrirEditar(s: Sala) {
    setFormEdit({ bloco: s.bloco ?? "", descricao: s.descricao ?? "" });
    setEditarId(s.id);
  }

  function salvarEdicao(e: React.FormEvent) {
    e.preventDefault();
    if (!editarId) return;
    salasStore.atualizar(editarId, {
      bloco: formEdit.bloco.trim() || undefined,
      descricao: formEdit.descricao.trim() || undefined,
    });
    refresh();
    setEditarId(null);
  }

  function remover(s: Sala) {
    if (confirm(`Remover a sala "${s.nome}"? Os equipamentos do inventário não serão apagados.`)) {
      salasStore.remover(s.id);
      setDetalhesId(null);
      refresh();
    }
  }

  const salaDetalhes = salas.find((s) => s.id === detalhesId) ?? null;
  const salaEditar = salas.find((s) => s.id === editarId) ?? null;

  const ATALHOS = [
    {
      href: "/inventario",
      titulo: "Inventário de cabeamento",
      desc: "Organize portas, patch panels e pontos de rede.",
      Icone: IconPlug,
    },
    {
      href: "/etiquetas",
      titulo: "Gerador de etiquetas",
      desc: "Crie etiquetas padronizadas.",
      Icone: IconTag,
    },
    {
      href: "/certificacao",
      titulo: "Testes de certificação",
      desc: "Registre e valide resultados.",
      Icone: IconShield,
    },
  ];

  const botaoIcone =
    "rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-50";

  return (
    <AppShell titulo="Visão Geral" subtitulo="Gerencie a infraestrutura de rede da escola em um só lugar.">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <CardResumo
          icone={<IconSala className="h-7 w-7 text-blue-600" />}
          cor="bg-blue-50"
          titulo="Salas cadastradas"
          valor={String(salas.length).padStart(2, "0")}
          legenda="Salas ativas na rede da escola."
        />
        <CardResumo
          icone={<IconPort className="h-7 w-7 text-blue-600" />}
          cor="bg-blue-50"
          titulo="Pontos de rede"
          valor={pontos.length}
          legenda="Total de pontos cadastrados."
        />
        <CardResumo
          icone={<IconServer className="h-7 w-7 text-blue-600" />}
          cor="bg-blue-50"
          titulo="Equipamentos"
          valor={totalEquip}
          legenda="Switches e patch panels."
        />
      </div>

      {/* Acesso rápido + Status */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-5">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-3">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0a1f4f]">
            <IconBolt className="h-5 w-5 text-blue-600" /> Acesso rápido
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {ATALHOS.map(({ href, titulo, desc, Icone }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
                  <Icone className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{titulo}</h3>
                <p className="mt-1 flex-1 text-xs text-slate-500">{desc}</p>
                <IconArrow className="mt-3 h-5 w-5 self-end text-blue-600" />
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0a1f4f]">
            <IconPulse className="h-5 w-5 text-blue-600" /> Status da infraestrutura
          </h2>
          <div className="divide-y divide-slate-100">
            <div className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <IconPlug className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Cabeamento</p>
                  <p className="text-xs text-slate-400">Organização e identificação dos cabos.</p>
                </div>
              </div>
              {pontosIncompletos === 0 ? (
                <Selo tipo="ok">Cabeamento organizado</Selo>
              ) : (
                <Selo tipo="aviso">{pontosIncompletos} ponto(s) incompleto(s)</Selo>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <IconClipboard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Inventário</p>
                  <p className="text-xs text-slate-400">Equipamentos e pontos cadastrados.</p>
                </div>
              </div>
              {totalEquip > 0 ? (
                <Selo tipo="ok">Inventário atualizado</Selo>
              ) : (
                <Selo tipo="aviso">Nenhum equipamento</Selo>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Minhas salas */}
      <section id="salas" className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-[#0a1f4f]">
            <IconSala className="h-5 w-5 text-blue-600" /> Minhas salas
          </h2>
          <button
            onClick={abrirNova}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <IconPlus className="h-4 w-4" /> Adicionar sala
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600">
                <th className="rounded-l-lg px-4 py-3 font-semibold">Sala</th>
                <th className="px-4 py-3 font-semibold">Bloco</th>
                <th className="px-4 py-3 font-semibold">Pontos de rede</th>
                <th className="rounded-r-lg px-4 py-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {salas.map((s) => (
                <tr key={s.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                        <IconSala className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-slate-800">{s.nome}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{s.bloco || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{pontosDaSala(s).length} pontos</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setDetalhesId(s.id)} className={botaoIcone} title="Ver detalhes">
                        <IconEye className="h-4 w-4" />
                      </button>
                      <button onClick={() => abrirEditar(s)} className={botaoIcone} title="Editar">
                        <IconPencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => remover(s)}
                        className={`${botaoIcone} hover:border-red-200 hover:bg-red-50 hover:text-red-600`}
                        title="Remover"
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {salas.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    Nenhuma sala cadastrada ainda. Clique em &quot Adicionar sala &quot para começar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal: nova sala */}
      {modalNova && (
        <Modal titulo="Nova sala" onClose={() => setModalNova(false)}>
          <form onSubmit={salvarNova} className="space-y-3">
            <div>
              <Label>Nome da sala *</Label>
              <Input
                autoFocus
                value={formNova.nome}
                onChange={(e) => setFormNova({ ...formNova, nome: e.target.value })}
                placeholder="ex: Laboratório de Informática"
              />
            </div>
            <div>
              <Label>Bloco / Andar</Label>
              <Input
                value={formNova.bloco}
                onChange={(e) => setFormNova({ ...formNova, bloco: e.target.value })}
                placeholder="ex: Bloco A"
              />
            </div>
            <div>
              <Label>Descrição / Observações</Label>
              <Input
                value={formNova.descricao}
                onChange={(e) => setFormNova({ ...formNova, descricao: e.target.value })}
              />
            </div>
            {erro && <p className="text-sm text-red-600">{erro}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setModalNova(false)}>
                Cancelar
              </Button>
              <Button type="submit">Criar sala</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: editar sala */}
      {salaEditar && (
        <Modal titulo={`Editar: ${salaEditar.nome}`} onClose={() => setEditarId(null)}>
          <form onSubmit={salvarEdicao} className="space-y-3">
            <div>
              <Label>Nome da sala</Label>
              <Input value={salaEditar.nome} disabled className="bg-slate-100 text-slate-500" />
              <p className="mt-1 text-xs text-slate-400">
                O nome não pode ser alterado, pois liga a sala aos equipamentos do inventário.
              </p>
            </div>
            <div>
              <Label>Bloco / Andar</Label>
              <Input
                autoFocus
                value={formEdit.bloco}
                onChange={(e) => setFormEdit({ ...formEdit, bloco: e.target.value })}
              />
            </div>
            <div>
              <Label>Descrição / Observações</Label>
              <Input
                value={formEdit.descricao}
                onChange={(e) => setFormEdit({ ...formEdit, descricao: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setEditarId(null)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: detalhes da sala */}
      {salaDetalhes && (
        <Modal titulo={salaDetalhes.nome} onClose={() => setDetalhesId(null)} largura="max-w-lg">
          {salaDetalhes.bloco && <p className="text-sm text-slate-500">{salaDetalhes.bloco}</p>}
          {salaDetalhes.descricao && (
            <p className="mt-1 text-sm text-slate-600">{salaDetalhes.descricao}</p>
          )}
          <p className="mt-1 text-xs text-slate-400">
            Criada em {new Date(salaDetalhes.criadoEm).toLocaleDateString("pt-BR")}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { n: pontosDaSala(salaDetalhes).length, l: "Pontos" },
              { n: ppDaSala(salaDetalhes).length, l: "Patch Panels" },
              { n: swDaSala(salaDetalhes).length, l: "Switches" },
            ].map((c) => (
              <div key={c.l} className="rounded-lg bg-slate-100 py-2">
                <p className="text-lg font-bold text-slate-900">{c.n}</p>
                <p className="text-xs text-slate-500">{c.l}</p>
              </div>
            ))}
          </div>

          <h4 className="mb-1 mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Pontos de Rede
          </h4>
          {pontosDaSala(salaDetalhes).length === 0 ? (
            <p className="text-sm text-slate-400">Nenhum ponto nesta sala.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-1 pr-2">Código</th>
                    <th className="py-1 pr-2">Patch Panel</th>
                    <th className="py-1 pr-2">Switch</th>
                    <th className="py-1 pr-2">Cabo</th>
                  </tr>
                </thead>
                <tbody>
                  {pontosDaSala(salaDetalhes).map((p) => {
                    const pp = patchPanels.find((x) => x.id === p.patchPanelId);
                    const sw = switches.find((x) => x.id === p.switchId);
                    return (
                      <tr key={p.id} className="border-b border-slate-100">
                        <td className="py-1 pr-2 font-medium text-slate-900">{p.codigo}</td>
                        <td className="py-1 pr-2">{pp ? `${pp.codigo} / ${p.portaPatchPanel}` : "—"}</td>
                        <td className="py-1 pr-2">{sw ? `${sw.codigo} / ${p.portaSwitch}` : "—"}</td>
                        <td className="py-1 pr-2">{p.categoriaCabo}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <h4 className="mb-1 mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Patch Panels
          </h4>
          {ppDaSala(salaDetalhes).length === 0 ? (
            <p className="text-sm text-slate-400">Nenhum patch panel nesta sala.</p>
          ) : (
            <ul className="space-y-1 text-sm text-slate-700">
              {ppDaSala(salaDetalhes).map((p) => (
                <li key={p.id}>
                  <span className="font-medium">{p.codigo}</span> — {p.totalPortas} portas
                </li>
              ))}
            </ul>
          )}

          <h4 className="mb-1 mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Switches
          </h4>
          {swDaSala(salaDetalhes).length === 0 ? (
            <p className="text-sm text-slate-400">Nenhum switch nesta sala.</p>
          ) : (
            <ul className="space-y-1 text-sm text-slate-700">
              {swDaSala(salaDetalhes).map((w) => (
                <li key={w.id}>
                  <span className="font-medium">{w.codigo}</span>
                  {w.modelo ? ` (${w.modelo})` : ""} — {w.totalPortas} portas
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/inventario"
            className="mt-5 inline-block text-xs font-medium text-blue-600 hover:underline"
          >
            Gerenciar no inventário →
          </Link>
        </Modal>
      )}
    </AppShell>
  );
}