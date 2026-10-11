
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import {
  pontosRedeStore,
  patchPanelsStore,
  switchesStore,
} from "@/lib/storage";
import { salasStore, type Sala } from "@/lib/salas";
import type {
  PontoRede,
  PatchPanel,
  SwitchEquip,
  CategoriaCabo,
} from "@/lib/types";
import { Input, Select, Button, Card, Label } from "@/components/ui";

const CATEGORIAS: CategoriaCabo[] = [
  "Cat5e",
  "Cat6",
  "Cat6A",
  "Cat7",
];

const rotuloSala = (s: Sala) =>
  s.bloco ? `${s.nome} — ${s.bloco}` : s.nome;

function SemSalas() {
  return (
    <p className="mt-1 text-xs text-amber-600">
      Nenhuma sala cadastrada.{" "}
      <Link href="/dashboard" className="font-medium underline">
        Crie uma no dashboard
      </Link>
      .
    </p>
  );
}

export default function InventarioPage() {
  const [tab, setTab] = useState<
    "pontos" | "patchpanels" | "switches"
  >("pontos");

  return (
    <AppShell
      titulo="Inventário de Cabeamento"
      subtitulo="Cadastre patch panels e switches primeiro, depois relacione cada ponto de rede a eles."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { key: "pontos", label: "Pontos de Rede" },
          { key: "patchpanels", label: "Patch Panels" },
          { key: "switches", label: "Switches" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() =>
              setTab(t.key as typeof tab)
            }
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-blue-600 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "pontos" && <PontosRedeTab />}
      {tab === "patchpanels" && <PatchPanelsTab />}
      {tab === "switches" && <SwitchesTab />}
    </AppShell>
  );
}

// ==================================================
// PONTOS DE REDE
// ==================================================

function PontosRedeTab() {
  const [pontos, setPontos] = useState<PontoRede[]>([]);
  const [patchPanels, setPatchPanels] = useState<PatchPanel[]>([]);
  const [switches, setSwitches] = useState<SwitchEquip[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);

  const [form, setForm] = useState({
    salaId: "",
    codigo: "",
    patchPanelId: "",
    portaPatchPanel: "",
    switchId: "",
    portaSwitch: "",
    categoriaCabo: "Cat6" as CategoriaCabo,
    comprimentoMetros: "",
    observacoes: "",
  });

  function refresh() {
    setPontos(pontosRedeStore.list());
    setPatchPanels(patchPanelsStore.list());
    setSwitches(switchesStore.list());
    setSalas(salasStore.list());
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const sala = salas.find((s) => s.id === form.salaId);

    if (
      !form.codigo.trim() ||
      !sala ||
      !form.patchPanelId ||
      !form.switchId
    ) {
      alert(
        "Preencha a sala, o código, o patch panel e o switch."
      );
      return;
    }

    pontosRedeStore.create({
      codigo: form.codigo.trim(),
      local: sala.nome,
      ambiente: sala.bloco ?? "",
      patchPanelId: form.patchPanelId,
      portaPatchPanel: Number(form.portaPatchPanel) || 0,
      switchId: form.switchId,
      portaSwitch: Number(form.portaSwitch) || 0,
      categoriaCabo: form.categoriaCabo,
      comprimentoMetros:
        Number(form.comprimentoMetros) || 0,
      observacoes: form.observacoes,
      criadoEm: new Date().toISOString(),
    });

    setForm({
      salaId: "",
      codigo: "",
      patchPanelId: "",
      portaPatchPanel: "",
      switchId: "",
      portaSwitch: "",
      categoriaCabo: "Cat6",
      comprimentoMetros: "",
      observacoes: "",
    });

    refresh();
  }

  function remover(id: string) {
    if (confirm("Remover este ponto de rede?")) {
      pontosRedeStore.remove(id);
      refresh();
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <h2 className="mb-4 font-semibold text-slate-800">
          Novo Ponto de Rede
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label>Sala</Label>
            <Select
              value={form.salaId}
              onChange={(e) =>
                setForm({ ...form, salaId: e.target.value })
              }
            >
              <option value="">Selecione a sala...</option>
              {salas.map((s) => (
                <option key={s.id} value={s.id}>
                  {rotuloSala(s)}
                </option>
              ))}
            </Select>
            {salas.length === 0 && <SemSalas />}
          </div>

          <div>
            <Label>Código do ponto</Label>
            <Input
              value={form.codigo}
              onChange={(e) =>
                setForm({ ...form, codigo: e.target.value })
              }
              placeholder="Ex.: A-101-PT01"
              required
            />
          </div>

          <div>
            <Label>Patch Panel</Label>
            <Select
              value={form.patchPanelId}
              onChange={(e) =>
                setForm({
                  ...form,
                  patchPanelId: e.target.value,
                })
              }
            >
              <option value="">Selecione...</option>
              {patchPanels.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.codigo} ({p.local})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label>Porta do Patch Panel</Label>
            <Input
              type="number"
              min="1"
              value={form.portaPatchPanel}
              onChange={(e) =>
                setForm({
                  ...form,
                  portaPatchPanel: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Switch</Label>
            <Select
              value={form.switchId}
              onChange={(e) =>
                setForm({ ...form, switchId: e.target.value })
              }
            >
              <option value="">Selecione...</option>
              {switches.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.codigo} ({s.local})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label>Porta do Switch</Label>
            <Input
              type="number"
              min="1"
              value={form.portaSwitch}
              onChange={(e) =>
                setForm({
                  ...form,
                  portaSwitch: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Categoria do Cabo</Label>
            <Select
              value={form.categoriaCabo}
              onChange={(e) =>
                setForm({
                  ...form,
                  categoriaCabo: e.target.value as CategoriaCabo,
                })
              }
            >
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label>Comprimento (metros)</Label>
            <Input
              type="number"
              min="0"
              step="0.1"
              value={form.comprimentoMetros}
              onChange={(e) =>
                setForm({
                  ...form,
                  comprimentoMetros: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Observações</Label>
            <Input
              value={form.observacoes}
              onChange={(e) =>
                setForm({
                  ...form,
                  observacoes: e.target.value,
                })
              }
              placeholder="Observações opcionais"
            />
          </div>

          <Button type="submit" className="w-full">
            Cadastrar Ponto
          </Button>
        </form>
      </Card>

      <Card className="lg:col-span-2">
        <h2 className="mb-4 font-semibold text-slate-800">
          Pontos Cadastrados ({pontos.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-3">Código</th>
                <th className="py-2 pr-3">Sala / Bloco</th>
                <th className="py-2 pr-3">Patch Panel</th>
                <th className="py-2 pr-3">Switch</th>
                <th className="py-2 pr-3">Categoria</th>
                <th className="py-2 pr-3">Comp. (m)</th>
                <th className="py-2 pr-3">Ações</th>
              </tr>
            </thead>

            <tbody>
              {pontos.map((p) => {
                const pp = patchPanels.find(
                  (x) => x.id === p.patchPanelId
                );
                const sw = switches.find(
                  (x) => x.id === p.switchId
                );

                return (
                  <tr
                    key={p.id}
                    className="border-b border-slate-100"
                  >
                    <td className="py-2 pr-3 font-medium">
                      {p.codigo}
                    </td>
                    <td className="py-2 pr-3">
                      {p.local}
                      {p.ambiente && (
                        <span className="block text-xs text-slate-400">
                          {p.ambiente}
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-3">
                      {pp
                        ? `${pp.codigo} / porta ${p.portaPatchPanel}`
                        : "—"}
                    </td>
                    <td className="py-2 pr-3">
                      {sw
                        ? `${sw.codigo} / porta ${p.portaSwitch}`
                        : "—"}
                    </td>
                    <td className="py-2 pr-3">
                      {p.categoriaCabo}
                    </td>
                    <td className="py-2 pr-3">
                      {p.comprimentoMetros}
                    </td>
                    <td className="py-2 pr-3">
                      <button
                        type="button"
                        onClick={() => remover(p.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                );
              })}

              {pontos.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-6 text-center text-slate-400"
                  >
                    Nenhum ponto cadastrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ==================================================
// PATCH PANELS
// ==================================================

function PatchPanelsTab() {
  const [items, setItems] = useState<PatchPanel[]>([]);
  const [form, setForm] = useState({
    codigo: "",
    local: "",
  });

  function refresh() {
    setItems(patchPanelsStore.list());
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.codigo.trim() || !form.local.trim()) {
      alert("Informe o código e o local do patch panel.");
      return;
    }

    patchPanelsStore.create({
      codigo: form.codigo.trim(),
      local: form.local.trim(),
      criadoEm: new Date().toISOString(),
    });

    setForm({ codigo: "", local: "" });
    refresh();
  }

  function remover(id: string) {
    if (
      confirm(
        "Deseja remover este patch panel? Verifique os pontos associados antes de excluir."
      )
    ) {
      patchPanelsStore.remove(id);
      refresh();
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <h2 className="mb-4 font-semibold text-slate-800">
          Novo Patch Panel
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label>Código</Label>
            <Input
              value={form.codigo}
              onChange={(e) =>
                setForm({ ...form, codigo: e.target.value })
              }
              placeholder="Ex.: PP-01"
              required
            />
          </div>

          <div>
            <Label>Local</Label>
            <Input
              value={form.local}
              onChange={(e) =>
                setForm({ ...form, local: e.target.value })
              }
              placeholder="Ex.: Rack principal"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Cadastrar Patch Panel
          </Button>
        </form>
      </Card>

      <Card className="lg:col-span-2">
        <h2 className="mb-4 font-semibold text-slate-800">
          Patch Panels Cadastrados ({items.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-3">Código</th>
                <th className="py-2 pr-3">Local</th>
                <th className="py-2 pr-3">Ações</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100"
                >
                  <td className="py-3 pr-3 font-medium">
                    {item.codigo}
                  </td>
                  <td className="py-3 pr-3">{item.local}</td>
                  <td className="py-3 pr-3">
                    <button
                      type="button"
                      onClick={() => remover(item.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="py-6 text-center text-slate-400"
                  >
                    Nenhum patch panel cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ==================================================
// SWITCHES
// ==================================================

function SwitchesTab() {
  const [items, setItems] = useState<SwitchEquip[]>([]);
  const [form, setForm] = useState({
    codigo: "",
    local: "",
  });

  function refresh() {
    setItems(switchesStore.list());
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.codigo.trim() || !form.local.trim()) {
      alert("Informe o código e o local do switch.");
      return;
    }

    switchesStore.create({
      codigo: form.codigo.trim(),
      local: form.local.trim(),
      criadoEm: new Date().toISOString(),
    });

    setForm({ codigo: "", local: "" });
    refresh();
  }

  function remover(id: string) {
    if (
      confirm(
        "Deseja remover este switch? Verifique os pontos associados antes de excluir."
      )
    ) {
      switchesStore.remove(id);
      refresh();
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <h2 className="mb-4 font-semibold text-slate-800">
          Novo Switch
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label>Código</Label>
            <Input
              value={form.codigo}
              onChange={(e) =>
                setForm({ ...form, codigo: e.target.value })
              }
              placeholder="Ex.: SW-01"
              required
            />
          </div>

          <div>
            <Label>Local</Label>
            <Input
              value={form.local}
              onChange={(e) =>
                setForm({ ...form, local: e.target.value })
              }
              placeholder="Ex.: Rack principal"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Cadastrar Switch
          </Button>
        </form>
      </Card>

      <Card className="lg:col-span-2">
        <h2 className="mb-4 font-semibold text-slate-800">
          Switches Cadastrados ({items.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-3">Código</th>
                <th className="py-2 pr-3">Local</th>
                <th className="py-2 pr-3">Ações</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100"
                >
                  <td className="py-3 pr-3 font-medium">
                    {item.codigo}
                  </td>
                  <td className="py-3 pr-3">{item.local}</td>
                  <td className="py-3 pr-3">
                    <button
                      type="button"
                      onClick={() => remover(item.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="py-6 text-center text-slate-400"
                  >
                    Nenhum switch cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
