"use client";

import { motion } from "framer-motion";
import {
  Bot,
  BarChart3,
  RefreshCw,
  CalendarClock,
  Megaphone,
  FileText,
  PhoneCall,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "../ui/section-heading";
import { RevealGroup, RevealItem } from "../ui/reveal";

type Item = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

const items: Item[] = [
  {
    icon: Bot,
    title: "AI WhatsApp Agents",
    desc: "Virtual employees that answer, qualify and sell on WhatsApp around the clock.",
  },
  {
    icon: BarChart3,
    title: "Business Dashboards",
    desc: "All your revenue, sales and marketing KPIs centralized in one live view.",
  },
  {
    icon: RefreshCw,
    title: "Process Automation",
    desc: "Eliminate repetitive tasks and connect every tool in your operation.",
  },
  {
    icon: CalendarClock,
    title: "Smart Scheduling",
    desc: "Automatic booking, reminders and rescheduling across your calendars.",
  },
  {
    icon: Megaphone,
    title: "AI Marketing",
    desc: "Ad creation, copywriting and campaign analysis powered by AI.",
  },
  {
    icon: FileText,
    title: "Proposal Automation",
    desc: "Branded proposals, contracts and e-signatures generated in seconds.",
  },
  {
    icon: PhoneCall,
    title: "AI Sales Assistant",
    desc: "Qualifies leads, scores intent and hands off hot prospects to your team.",
  },
];

export function WhatWeDo() {
  return (
    <section id="what-we-do" className="relative py-24 sm:py-28">
      <div className="container-px">
        <SectionHeading
          eyebrow="What We Do"
          title={<>Everything your business needs, <span className="text-gradient">powered by AI</span></>}
          description="Modular AI solutions that plug into your operation and start delivering results from day one."
        />

        <RevealGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <RevealItem key={item.title}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-brand-violet/40 ${
                  i === items.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-violet/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-grad-brand-soft ring-1 ring-white/10">
                  <item.icon className="h-6 w-6 text-brand-cyan" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {item.desc}
                </p>
              </motion.article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
