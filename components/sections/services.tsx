"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  BarChart3,
  RefreshCw,
  CalendarClock,
  Megaphone,
  FileText,
  PhoneCall,
  Check,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "../ui/section-heading";
import {
  WhatsAppVisual,
  DashboardVisual,
  AutomationVisual,
  SchedulingVisual,
  MarketingVisual,
  ProposalVisual,
  SalesAssistantVisual,
} from "./service-visuals";

type Service = {
  id: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  features: string[];
  visual: React.ReactNode;
};

const services: Service[] = [
  {
    id: "whatsapp",
    icon: Bot,
    title: "AI WhatsApp Agents",
    desc: "A virtual employee available 24/7 capable of answering questions, scheduling appointments, qualifying leads, generating quotes and transferring conversations to human agents.",
    features: [
      "Answers customer questions",
      "Product information",
      "Pricing",
      "Scheduling",
      "Sales",
      "Lead qualification",
      "Human handoff",
    ],
    visual: <WhatsAppVisual />,
  },
  {
    id: "dashboards",
    icon: BarChart3,
    title: "Business Dashboards",
    desc: "Centralize your business information in one place with modern charts and real-time KPIs your whole team can trust.",
    features: ["Revenue", "Sales", "Profit", "Marketing", "ROI", "CAC", "Customers", "Inventory"],
    visual: <DashboardVisual />,
  },
  {
    id: "automation",
    icon: RefreshCw,
    title: "Process Automation",
    desc: "We eliminate repetitive tasks by connecting your tools into one seamless, automated workflow — no manual work required.",
    features: ["Customer Purchase", "Contract", "CRM", "Invoice", "Email", "Financial", "Completed"],
    visual: <AutomationVisual />,
  },
  {
    id: "scheduling",
    icon: CalendarClock,
    title: "Smart Scheduling",
    desc: "A modern calendar that books, reminds and reschedules automatically, integrated with the tools you already use.",
    features: [
      "Google Calendar, Outlook, WhatsApp, Email & SMS",
      "Automatic reminders",
      "Automatic rescheduling",
      "Availability verification",
    ],
    visual: <SchedulingVisual />,
  },
  {
    id: "marketing",
    icon: Megaphone,
    title: "AI Marketing",
    desc: "Generate ads, write copy and analyze campaigns with AI that learns what converts for your audience.",
    features: [
      "Ad Creation",
      "Copywriting",
      "Campaign Analysis",
      "Lead Scoring",
      "Remarketing",
      "Customer Segmentation",
      "Performance Insights",
    ],
    visual: <MarketingVisual />,
  },
  {
    id: "proposal",
    icon: FileText,
    title: "Proposal Generator",
    desc: "Create beautiful, branded proposals with contracts, timelines and digital signatures — ready to send in seconds.",
    features: [
      "Proposal",
      "Contract",
      "Timeline",
      "Digital Signature",
      "Company Branding",
    ],
    visual: <ProposalVisual />,
  },
  {
    id: "sales-assistant",
    icon: PhoneCall,
    title: "AI Sales Assistant",
    desc: "An assistant that runs the full qualification conversation and scores every lead so your team only talks to buyers.",
    features: ["Name", "City", "Budget", "Product", "Purchase Time"],
    visual: <SalesAssistantVisual />,
  },
];

export function Services() {
  const [active, setActive] = useState(0);
  const current = services[active];

  return (
    <section id="services" className="relative py-24 sm:py-28">
      <div className="container-px">
        <SectionHeading
          eyebrow="Services"
          title={<>Explore each <span className="text-gradient">AI solution</span> in detail</>}
          description="Pick a service to see exactly how it works and what it delivers for your business."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr]">
          {/* Selector list */}
          <div className="flex flex-col gap-2.5">
            {services.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                className={`group relative flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-all ${
                  active === i
                    ? "border-brand-violet/40 bg-grad-brand-soft"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 ring-white/10 transition-colors ${
                    active === i ? "bg-grad-brand text-ink-950" : "bg-white/[0.04] text-brand-cyan"
                  }`}
                >
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-sm font-bold text-white">
                    {s.title}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-slate-500">
                    {s.desc}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="relative rounded-3xl border border-white/10 bg-ink-900/50 p-6 sm:p-8">
            <div className="ambient-glow pointer-events-none absolute inset-0 -z-10 rounded-3xl opacity-40" />
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="grid gap-8 lg:grid-cols-2 lg:items-center"
              >
                <div>
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-grad-brand text-ink-950">
                    <current.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-extrabold text-white">
                    {current.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {current.desc}
                  </p>
                  <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {current.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-200">
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-cyan/15 text-brand-cyan">
                          <Check className="h-3 w-3" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>{current.visual}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
