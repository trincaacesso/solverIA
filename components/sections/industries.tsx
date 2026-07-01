"use client";

import { motion } from "framer-motion";
import {
  HeartPulse,
  UtensilsCrossed,
  Dumbbell,
  Home,
  ShoppingBag,
  Scale,
  HardHat,
  Megaphone,
  Car,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "../ui/section-heading";
import { RevealGroup, RevealItem } from "../ui/reveal";

const industries: { icon: LucideIcon; label: string }[] = [
  { icon: HeartPulse, label: "Healthcare" },
  { icon: UtensilsCrossed, label: "Restaurants" },
  { icon: Dumbbell, label: "Gyms" },
  { icon: Home, label: "Real Estate" },
  { icon: ShoppingBag, label: "Retail" },
  { icon: Scale, label: "Law Firms" },
  { icon: HardHat, label: "Construction" },
  { icon: Megaphone, label: "Marketing Agencies" },
  { icon: Car, label: "Automotive" },
  { icon: GraduationCap, label: "Education" },
];

export function Industries() {
  return (
    <section id="industries" className="relative py-24 sm:py-28">
      <div className="container-px">
        <SectionHeading
          eyebrow="Industries"
          title={<>Built for <span className="text-gradient">every kind of business</span></>}
          description="SolverIA adapts to your niche, your language and your sales process."
        />

        <RevealGroup className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {industries.map((it) => (
            <RevealItem key={it.label}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center transition-colors hover:border-brand-cyan/40"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-grad-brand-soft ring-1 ring-white/10 transition-transform group-hover:scale-110">
                  <it.icon className="h-6 w-6 text-brand-cyan" />
                </span>
                <span className="text-sm font-semibold text-white">{it.label}</span>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
