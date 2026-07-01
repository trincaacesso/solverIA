"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, MessageCircle, Send } from "lucide-react";
import { ButtonLink } from "../ui/button";
import { WHATSAPP_URL } from "@/lib/utils";

export function FinalCTA() {
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !message || !emailOk) {
      setStatus("err");
      setMsg("Please fill in every field with a valid email.");
      return;
    }
    setStatus("ok");
    setMsg(`Thanks, ${name}! We'll be in touch within 24 hours.`);
    form.reset();
  }

  return (
    <section id="contact" className="relative py-24 sm:py-28">
      <div className="container-px">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-ink-900/60 p-8 sm:p-12"
        >
          <div className="ambient-glow pointer-events-none absolute inset-0 -z-10" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-violet/20 blur-3xl" />

          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="eyebrow">Get Started</span>
              <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-[2.75rem]">
                Ready to transform your business?
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-slate-400 sm:text-lg">
                Let's automate your company with Artificial Intelligence.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="#contact">
                  <CalendarCheck className="h-4 w-4" /> Schedule a Demo
                </ButtonLink>
                <ButtonLink href={WHATSAPP_URL} external variant="ghost">
                  <MessageCircle className="h-4 w-4 text-emerald-400" /> Talk on WhatsApp
                </ButtonLink>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="glass rounded-2xl p-6" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="name"
                  placeholder="Your name"
                  className="w-full rounded-xl border border-white/10 bg-ink-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-brand-violet focus:outline-none"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Work email"
                  className="w-full rounded-xl border border-white/10 bg-ink-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-brand-violet focus:outline-none"
                />
              </div>
              <textarea
                name="message"
                rows={3}
                placeholder="Tell us about your business…"
                className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-ink-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-brand-violet focus:outline-none"
              />
              <button type="submit" className="btn-glow mt-4 w-full justify-center">
                <span className="relative z-10 inline-flex items-center gap-2">
                  <Send className="h-4 w-4" /> Send message
                </span>
              </button>
              {status !== "idle" && (
                <p
                  className={`mt-3 text-sm ${
                    status === "ok" ? "text-brand-cyan" : "text-red-400"
                  }`}
                  role="status"
                >
                  {msg}
                </p>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
