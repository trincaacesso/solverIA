"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Sparkles,
  UserCheck,
  CalendarCheck,
  FileSignature,
  Database,
  BellRing,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "../ui/section-heading";

type Step = { icon: LucideIcon; title: string };

const steps: Step[] = [
  { icon: MessageSquare, title: "Customer sends a message" },
  { icon: Sparkles, title: "AI responds instantly" },
  { icon: UserCheck, title: "Lead is qualified" },
  { icon: CalendarCheck, title: "Meeting is scheduled" },
  { icon: FileSignature, title: "Proposal is created" },
  { icon: Database, title: "CRM is updated" },
  { icon: BellRing, title: "Team is notified" },
  { icon: LayoutDashboard, title: "Dashboard refreshed" },
];

export function HowWeHelp() {
  return (
    <section className="relative border-y border-white/5 bg-ink-900/40 py-24 sm:py-28">
      <div className="ambient-glow pointer-events-none absolute inset-0 -z-10 opacity-60" />
      <div className="container-px">
        <SectionHeading
          eyebrow="How We Help Businesses"
          title={<>One conversation, <span className="text-gradient">fully automated</span></>}
          description="From the first message to a closed deal — SolverIA orchestrates every step without human bottlenecks."
        />

        <div className="relative mt-16">
          {/* connecting line (desktop) */}
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent lg:block" />

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
            className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 lg:grid-cols-8"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-ink-800 shadow-card">
                  <span className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-grad-brand text-[11px] font-bold text-ink-950">
                    {i + 1}
                  </span>
                  <step.icon className="h-7 w-7 text-brand-cyan" />
                </div>
                <p className="mt-3 max-w-[10rem] text-xs font-medium leading-snug text-slate-300">
                  {step.title}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
