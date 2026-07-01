import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** WhatsApp deep link — replace with the real business number. */
export const WHATSAPP_URL =
  "https://wa.me/5599999999999?text=Hi%20SolverIA%2C%20I%27d%20like%20to%20know%20more%20about%20your%20AI%20solutions.";

/** Demo scheduling link — replace with the real Calendly/Cal.com URL. */
export const DEMO_URL = "#contact";
