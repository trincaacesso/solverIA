"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { SectionHeading } from "../ui/section-heading";

const traditional = [
  "Manual work",
  "Slow response",
  "Human errors",
  "No integration",
  "Limited hours",
];

const solver = [
  "Full automation",
  "Instant AI response",
  "24/7 availability",
  "Fully integrated",
  "Infinitely scalable",
];

export function WhySolverIA() {
  return (
    <section className="relative border-y border-white/5 bg-ink-900/40 py-24 sm:py-28">
      <div className="container-px">
        <SectionHeading
          eyebrow="Why SolverIA"
          title={<>The difference is <span className="text-gradient">night and day</span></>}
          description="See how an AI-powered operation compares to doing everything by hand."
        />

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
          {/* Traditional */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/10 bg-white/[0.02] p-7"
          >
            <h3 className="font-display text-xl font-bold text-slate-300">
              Traditional Company
            </h3>
            <ul className="mt-6 space-y-3">
              {traditional.map((t) => (
                <li key={t} className="flex items-center gap-3 text-sm text-slate-400">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-red-500/10 text-red-400">
                    <X className="h-3.5 w-3.5" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* SolverIA */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-brand-violet/40 bg-grad-brand-soft p-7 shadow-glow"
          >
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-cyan/20 blur-3xl" />
            <h3 className="font-display text-xl font-extrabold text-white">
              SolverIA
            </h3>
            <ul className="mt-6 space-y-3">
              {solver.map((t) => (
                <li key={t} className="flex items-center gap-3 text-sm font-medium text-white">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-400/20 text-emerald-300">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
