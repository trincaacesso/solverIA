"use client";

import { motion } from "framer-motion";
import {
  Building2,
  BrainCircuit,
  Workflow,
  LayoutDashboard,
  TrendingUp,
  ArrowDown,
  MessageCircle,
  CalendarCheck,
} from "lucide-react";
import { ButtonLink } from "../ui/button";
import { LogoMark } from "../ui/logo";
import { WHATSAPP_URL } from "@/lib/utils";

const flow = [
  { icon: Building2, label: "Your Company", tint: "text-slate-200" },
  { icon: BrainCircuit, label: "Artificial Intelligence", tint: "text-brand-violet" },
  { icon: Workflow, label: "Automations", tint: "text-brand-indigo" },
  { icon: LayoutDashboard, label: "Dashboard", tint: "text-brand-cyan" },
  { icon: TrendingUp, label: "Results", tint: "text-emerald-400" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-36 pb-20 sm:pt-40 lg:pt-44">
      {/* ambient background */}
      <div className="ambient-glow pointer-events-none absolute inset-0 -z-10" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-lines [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />

      <div className="container-px grid items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
        {/* Left — copy */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-brand-cyan" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-cyan" />
            </span>
            AI Automation Agency
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            We solve business problems with{" "}
            <span className="text-gradient">Artificial Intelligence.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg"
          >
            We automate repetitive tasks, increase productivity, improve customer
            service and help companies sell more using Artificial Intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.19 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <ButtonLink href="#contact">
              <CalendarCheck className="h-4 w-4" /> Schedule a Demo
            </ButtonLink>
            <ButtonLink href={WHATSAPP_URL} external variant="ghost">
              <MessageCircle className="h-4 w-4 text-emerald-400" /> Talk on WhatsApp
            </ButtonLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-500"
          >
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> 24/7 availability
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" /> No-code setup
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-violet" /> Live in days
            </span>
          </motion.div>
        </div>

        {/* Right — futuristic flow illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-grad-brand-soft blur-2xl" />
          <div className="glass rounded-[1.75rem] p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500">
                <LogoMark className="h-4 w-4 text-brand-cyan" /> SolverIA Engine
              </span>
              <span className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              </span>
            </div>

            <div className="flex flex-col items-stretch gap-2.5">
              {flow.map((step, i) => (
                <div key={step.label} className="flex flex-col items-center gap-2.5">
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
                    className="group flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 transition-colors hover:border-white/20"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/[0.04] ring-1 ring-white/10">
                      <step.icon className={`h-5 w-5 ${step.tint}`} />
                    </span>
                    <span className="text-sm font-semibold text-slate-200">
                      {step.label}
                    </span>
                    <span className="ml-auto h-2 w-2 rounded-full bg-brand-cyan/80 shadow-[0_0_12px_2px_rgba(34,211,238,.6)]" />
                  </motion.div>
                  {i < flow.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.15 }}
                    >
                      <ArrowDown className="h-4 w-4 text-slate-600" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* floating badge */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="glass absolute -right-4 top-1/3 hidden rounded-2xl px-4 py-3 shadow-glow sm:block"
          >
            <p className="text-2xl font-extrabold text-white">+40%</p>
            <p className="text-[11px] text-slate-400">avg. sales lift</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
