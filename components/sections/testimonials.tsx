"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SectionHeading } from "../ui/section-heading";

type Testimonial = {
  quote: string;
  name: string;
  company: string;
  initials: string;
  gradient: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "SolverIA's WhatsApp agent replies to every lead in seconds. We booked 3x more demos in the first month without hiring anyone.",
    name: "Sofia Almeida",
    company: "Nexa Real Estate",
    initials: "SA",
    gradient: "from-brand-violet to-brand-cyan",
  },
  {
    quote:
      "The automation connected our CRM, invoices and follow-ups end to end. My team finally stopped doing copy-paste work.",
    name: "Daniel Costa",
    company: "BrightGym Studios",
    initials: "DC",
    gradient: "from-brand-indigo to-brand-violet",
  },
  {
    quote:
      "The dashboard gave me a single source of truth for revenue and ROI. I make faster decisions with real numbers now.",
    name: "Marina Silva",
    company: "Aurora Marketing",
    initials: "MS",
    gradient: "from-brand-cyan to-brand-blue",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 sm:py-28">
      <div className="container-px">
        <SectionHeading
          eyebrow="Testimonials"
          title={<>Loved by <span className="text-gradient">growing companies</span></>}
          description="Real outcomes from teams that put AI to work with SolverIA."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.02] p-7 transition-colors hover:border-brand-violet/30"
            >
              <Quote className="h-8 w-8 text-brand-violet/40" />
              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-300">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-white/5 pt-5">
                <span
                  className={`grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br ${t.gradient} font-display text-sm font-bold text-ink-950`}
                >
                  {t.initials}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{t.name}</span>
                  <span className="block text-xs text-slate-500">{t.company}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
