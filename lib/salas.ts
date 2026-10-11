export interface Sala {
  id: string;
  slug: string;
  nome: string;
  bloco?: string;
  descricao?: string;
  criadoEm: string;
}

export type SalaSlug = string;

const KEY = "app:salas";

// "Laboratório de Informática" -> "laboratorio-de-informatica"
function gerarSlug(nome: string): string {
  return (
    nome
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "sala"
  );
}

// Garante que o slug não repita o de outra sala
function slugUnico(nome: string, existentes: Sala[]): string {
  const base = gerarSlug(nome);
  let slug = base;
  let n = 2;
  while (existentes.some((s) => s.slug === slug)) {
    slug = `${base}-${n}`;
    n++;
  }
  return slug;
}

function readAll(): Sala[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(KEY);
  if (!raw) return [];

  try {
    const items = JSON.parse(raw) as Sala[];

    // Migração: salas antigas ainda não têm slug
    let precisaSalvar = false;
    items.forEach((s, i) => {
      if (!s.slug) {
        s.slug = slugUnico(s.nome, items.slice(0, i));
        precisaSalvar = true;
      }
    });
    if (precisaSalvar) writeAll(items);

    return items;
  } catch {
    return [];
  }
}

function writeAll(items: Sala[]): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(KEY, JSON.stringify(items));
}

export const salasStore = {
  list(): Sala[] {
    return readAll().sort((a, b) => a.nome.localeCompare(b.nome));
  },

  get(id: string): Sala | undefined {
    return readAll().find((sala) => sala.id === id);
  },

  criar(dados: { nome: string; bloco?: string; descricao?: string }): Sala {
    const items = readAll();

    const nova: Sala = {
      id: crypto.randomUUID(),
      slug: slugUnico(dados.nome, items),
      nome: dados.nome,
      bloco: dados.bloco,
      descricao: dados.descricao,
      criadoEm: new Date().toISOString(),
    };

    items.push(nova);
    writeAll(items);

    return nova;
  },

  atualizar(id: string, dados: { bloco?: string; descricao?: string }): void {
    const items = readAll().map((sala) =>
      sala.id === id ? { ...sala, ...dados } : sala
    );

    writeAll(items);
  },

  remover(id: string): void {
    const items = readAll().filter((sala) => sala.id !== id);
    writeAll(items);
  },
};

export function getSala(slug: SalaSlug): Sala | undefined {
  return readAll().find(
    (sala) => sala.slug === slug || sala.id === slug || sala.nome === slug
  );
}