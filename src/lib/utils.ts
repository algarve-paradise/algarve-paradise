import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const PT_MONTHS_SHORT = ["jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];
const PT_MONTHS_LONG = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

function toDate(d: Date | string): Date {
  return typeof d === "string" ? new Date(d) : d;
}

/** dd/mm/yyyy — same output as toLocaleDateString("pt-PT") */
export function formatDate(date: Date | string): string {
  const d = toDate(date);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

/** "dd mês." — replaces toLocaleDateString("pt-PT", { day: "2-digit", month: "short" }) */
export function formatDateShort(date: Date | string): string {
  const d = toDate(date);
  return `${String(d.getDate()).padStart(2, "0")} ${PT_MONTHS_SHORT[d.getMonth()]}`;
}

/** "mês." — replaces toLocaleDateString("pt-PT", { month: "short" }) */
export function formatMonthShort(date: Date | string): string {
  const d = toDate(date);
  return PT_MONTHS_SHORT[d.getMonth()];
}

/** "d de mês de yyyy" — replaces toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" }) */
export function formatDateLong(date: Date | string): string {
  const d = toDate(date);
  return `${d.getDate()} de ${PT_MONTHS_LONG[d.getMonth()]} de ${d.getFullYear()}`;
}
