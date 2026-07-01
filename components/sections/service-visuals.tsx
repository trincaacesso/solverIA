"use client";

import { motion } from "framer-motion";
import {
  Check,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
  CalendarDays,
  Mail,
  MessageCircle,
  Smartphone,
  FileText,
  PenTool,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

/* 1 — AI WhatsApp Agents: chat mockup */
export function WhatsAppVisual() {
  const bubbles = [
    { me: false, text: "Hi! Do you have the Pro plan available?" },
    { me: true, text: "Yes! The Pro plan is $499/mo and includes 24/7 support. 🚀" },
    { me: false, text: "Can I schedule a demo for tomorrow?" },
    { me: true, text: "Absolutely — I booked you for 3:00 PM. Confirmed! ✅" },
  ];
  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-white/10 bg-ink-900 p-4 shadow-card">
      <div className="mb-3 flex items-center gap-3 border-b border-white/5 pb-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
          <MessageCircle className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-white">SolverIA Agent</p>
          <p className="text-[11px] text-emerald-400">online now</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {bubbles.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px] leading-snug ${
              b.me
                ? "self-end bg-emerald-500/20 text-emerald-50"
                : "self-start bg-white/5 text-slate-200"
            }`}
          >
            {b.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* 2 — Business Dashboards: KPIs + bars */
export function DashboardVisual() {
  const kpis = [
    { label: "Revenue", value: "$128k", icon: DollarSign, up: "+18%" },
    { label: "Sales", value: "1,204", icon: ShoppingCart, up: "+9%" },
    { label: "ROI", value: "312%", icon: TrendingUp, up: "+24%" },
    { label: "Customers", value: "3,540", icon: Users, up: "+12%" },
  ];
  const bars = [40, 65, 52, 80, 72, 95, 68];
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-ink-900 p-5 shadow-card">
      <div className="grid grid-cols-2 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="flex items-center justify-between">
              <k.icon className="h-4 w-4 text-brand-cyan" />
              <span className="text-[10px] font-semibold text-emerald-400">{k.up}</span>
            </div>
            <p className="mt-2 font-display text-lg font-bold text-white">{k.value}</p>
            <p className="text-[11px] text-slate-500">{k.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex h-24 items-end gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-3">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
            className="flex-1 rounded-t bg-grad-brand"
          />
        ))}
      </div>
    </div>
  );
}

/* 3 — Process Automation: horizontal flow */
export function AutomationVisual() {
  const steps = ["Purchase", "Contract", "CRM", "Invoice", "Email", "Financial", "Completed"];
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-ink-900 p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {steps.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-2"
          >
            <span
              className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                i === steps.length - 1
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                  : "border-white/10 bg-white/[0.03] text-slate-200"
              }`}
            >
              {s}
            </span>
            {i < steps.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-slate-600" />}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* 4 — Smart Scheduling: mini calendar + integrations */
export function SchedulingVisual() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const booked = [4, 9, 12, 18, 23, 27];
  const integrations = [
    { icon: CalendarDays, label: "Google" },
    { icon: Mail, label: "Outlook" },
    { icon: MessageCircle, label: "WhatsApp" },
    { icon: Smartphone, label: "SMS" },
  ];
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-ink-900 p-5 shadow-card">
      <p className="mb-3 text-sm font-semibold text-white">June 2026</p>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d) => (
          <div
            key={d}
            className={`grid aspect-square place-items-center rounded-md text-[11px] ${
              booked.includes(d)
                ? "bg-grad-brand font-bold text-ink-950"
                : "bg-white/[0.03] text-slate-400"
            }`}
          >
            {d}
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {integrations.map((it) => (
          <span
            key={it.label}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-slate-300"
          >
            <it.icon className="h-3.5 w-3.5 text-brand-cyan" /> {it.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* 5 — AI Marketing: examples grid */
export function MarketingVisual() {
  const items = [
    "Ad Creation",
    "Copywriting",
    "Campaign Analysis",
    "Lead Scoring",
    "Remarketing",
    "Segmentation",
    "Performance Insights",
  ];
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-ink-900 p-5 shadow-card">
      <div className="flex flex-wrap gap-2">
        {items.map((it, i) => (
          <motion.span
            key={it}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="rounded-lg border border-white/10 bg-grad-brand-soft px-3 py-2 text-xs font-medium text-slate-100"
          >
            {it}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* 6 — Proposal Generator: PDF mock */
export function ProposalVisual() {
  const rows = [
    { icon: FileText, label: "Proposal" },
    { icon: PenTool, label: "Digital Signature" },
    { icon: ShieldCheck, label: "Company Branding" },
  ];
  return (
    <div className="mx-auto w-full max-w-xs rounded-2xl border border-white/10 bg-white p-5 text-ink-900 shadow-card">
      <div className="flex items-center justify-between">
        <span className="font-display text-sm font-extrabold">SolverIA</span>
        <span className="rounded bg-ink-950 px-2 py-0.5 text-[10px] font-semibold text-white">
          PROPOSAL
        </span>
      </div>
      <div className="mt-3 h-2 w-2/3 rounded bg-ink-900/80" />
      <div className="mt-2 space-y-1.5">
        <div className="h-1.5 w-full rounded bg-ink-900/15" />
        <div className="h-1.5 w-5/6 rounded bg-ink-900/15" />
        <div className="h-1.5 w-4/6 rounded bg-ink-900/15" />
      </div>
      <div className="mt-4 space-y-2 border-t border-ink-900/10 pt-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-2 text-xs font-medium">
            <r.icon className="h-3.5 w-3.5 text-brand-violet" /> {r.label}
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-grad-brand px-3 py-2 text-center text-xs font-bold text-ink-950">
        Total · $4,900
      </div>
    </div>
  );
}

/* 7 — AI Sales Assistant: qualification + score */
export function SalesAssistantVisual() {
  const qa = [
    ["Name", "Michael Ross"],
    ["City", "Austin, TX"],
    ["Budget", "$5,000"],
    ["Product", "AI WhatsApp Agent"],
    ["Purchase Time", "This month"],
  ];
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-ink-900 p-5 shadow-card">
      <div className="space-y-2">
        {qa.map(([q, a], i) => (
          <motion.div
            key={q}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs"
          >
            <span className="text-slate-500">{q}</span>
            <span className="font-medium text-slate-100">{a}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-center">
        <p className="text-[11px] uppercase tracking-widest text-emerald-300/80">Lead Score</p>
        <p className="font-display text-4xl font-extrabold text-emerald-300">95%</p>
        <p className="mt-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-200">
          <Check className="h-3.5 w-3.5" /> Ready for Sales Team
        </p>
      </div>
    </div>
  );
}
