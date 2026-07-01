"use client";

import { motion } from "framer-motion";
import {
  Bot,
  LayoutDashboard,
  RefreshCw,
  Database,
  FileText,
  CalendarCheck,
  Repeat,
  BarChart3,
  Boxes,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "../ui/section-heading";
import { ButtonLink } from "../ui/button";

const includes: { icon: LucideIcon; label: string }[] = [
  { icon: Bot, label: "AI WhatsApp Agent" },
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: RefreshCw, label: "Process Automation" },
  { icon: Database, label: "CRM Integration" },
  { icon: FileText, label: "Proposal Generator" },
  { icon: CalendarCheck, label: "Google Calendar Integration" },
  { icon: Repeat, label: "Automatic Follow-up" },
  { icon: BarChart3, label: "Reports" },
];

export function CompleteSolution() {
  return (
    <section id="solution" className="relative border-y border-white/5 bg-ink-900/40 py-24 sm:py-28">
      <div className="ambient-glow pointer-events-none absolute inset-0 -z-10 opacity-60" />
      <div className="container-px">
        <SectionHeading
          eyebrow="Our Complete Solution"
          title={<>Everything connected in <span className="text-gradient">one premium package</span></>}
          description="One AI ecosystem where your agent, dashboard, automations and CRM all work together — no silos, no manual glue."
        />

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1fr_.9fr]">
          {/* included list */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {includes.map((it) => (
              <motion.div
                key={it.label}
                variants={{ hidden: { opacity: 0, x: -18 }, show: { opacity: 1, x: 0 } }}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-grad-brand-soft ring-1 ring-white/10">
                  <it.icon className="h-5 w-5 text-brand-cyan" />
                </span>
                <span className="text-sm font-semibold text-white">{it.label}</span>
                <span className="ml-auto text-xs font-bold text-emerald-400">✓</span>
              </motion.div>
            ))}
          </motion.div>

          {/* central connected hub */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center"
          >
            <div className="absolute inset-0 rounded-full bg-grad-brand-soft blur-2xl" />
            <div className="absolute inset-6 rounded-full border border-white/10" />
            <div className="absolute inset-16 rounded-full border border-white/10" />
            <div className="relative grid h-28 w-28 place-items-center rounded-full bg-grad-brand shadow-glow">
              <div className="text-center">
                <Boxes className="mx-auto h-7 w-7 text-ink-950" />
                <p className="mt-1 font-display text-xs font-extrabold text-ink-950">
                  SolverIA
                </p>
              </div>
            </div>
            {/* orbiting nodes */}
            {includes.slice(0, 6).map((it, i) => {
              const angle = (i / 6) * Math.PI * 2;
              const r = 42;
              const x = 50 + Math.cos(angle) * r;
              const y = 50 + Math.sin(angle) * r;
              return (
                <div
                  key={it.label}
                  className="absolute grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-ink-800 shadow-card"
                  style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }}
                >
                  <it.icon className="h-5 w-5 text-brand-cyan" />
                </div>
              );
            })}
          </motion.div>
        </div>

        <div className="mt-12 flex justify-center">
          <ButtonLink href="#contact">Get the complete package</ButtonLink>
        </div>
      </div>
    </section>
  );
}
