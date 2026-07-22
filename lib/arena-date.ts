// Lightweight date helpers (pt-BR) for the Arena Futevôlei dashboard.
// Native Date only — avoids pulling in date-fns.

const WEEKDAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

/** Midnight copy of a date (drops time). */
function atMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Add (or subtract) days, returning a new date at midnight. */
export function addDays(date: Date, amount: number): Date {
  const d = atMidnight(date);
  d.setDate(d.getDate() + amount);
  return d;
}

/** Start of the week. Defaults to Monday (weekStartsOn = 1). */
export function startOfWeek(date: Date, weekStartsOn = 1): Date {
  const d = atMidnight(date);
  const diff = (d.getDay() - weekStartsOn + 7) % 7;
  return addDays(d, -diff);
}

/** Are two dates the same calendar day? */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** yyyy-MM-dd (local). */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parse a yyyy-MM-dd string as a local date. */
export function parseISODate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Short weekday label, e.g. "SEG". */
export function weekdayShort(date: Date): string {
  return WEEKDAYS_SHORT[date.getDay()].toUpperCase();
}

/** Day of month, zero-padded, e.g. "07". */
export function dayOfMonth(date: Date): string {
  return String(date.getDate()).padStart(2, "0");
}

/** Long label, e.g. "22 de Julho de 2025". */
export function longDate(date: Date): string {
  return `${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}`;
}
