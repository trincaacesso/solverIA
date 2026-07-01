"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionHeading } from "../ui/section-heading";

const faqs = [
  {
    q: "How long does implementation take?",
    a: "Most clients go live within a few days to two weeks. We handle setup, integrations and training the AI on your business so you don't have to.",
  },
  {
    q: "Do I need technical knowledge?",
    a: "Not at all. SolverIA is fully managed and no-code for you. We configure everything and you simply use the dashboard and receive results.",
  },
  {
    q: "Can it integrate with my current system?",
    a: "Yes. We integrate with WhatsApp, Google Calendar, Outlook, your CRM, email, SMS and most popular business tools through native connectors and APIs.",
  },
  {
    q: "Is support included?",
    a: "Every plan includes support, and Pro and Enterprise clients get priority assistance plus a dedicated specialist to keep optimizing your automations.",
  },
  {
    q: "Can the AI learn my business?",
    a: "Absolutely. We train the AI on your products, pricing, tone of voice and processes so every response sounds like it comes from your best employee.",
  },
];

function FaqItem({
  q,
  a,
  isOpen,
  onToggle,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] transition-colors hover:border-white/20">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-display text-base font-semibold text-white">{q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-grad-brand-soft text-brand-cyan"
        >
          <Plus className="h-4 w-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-slate-400">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-24 sm:py-28">
      <div className="container-px">
        <SectionHeading
          eyebrow="FAQ"
          title={<>Questions? <span className="text-gradient">We've got answers</span></>}
        />
        <div className="mx-auto mt-12 flex max-w-3xl flex-col gap-3">
          {faqs.map((f, i) => (
            <FaqItem
              key={f.q}
              q={f.q}
              a={f.a}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
