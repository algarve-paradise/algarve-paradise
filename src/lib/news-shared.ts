import type { NewsCategory } from "@/types/content";

export const newsCategories: NewsCategory[] = [
  "Algarve",
  "Municipios",
  "Economia",
  "Turismo",
  "Seguranca",
  "Eventos",
];

export function slugifyNewsTitle(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
