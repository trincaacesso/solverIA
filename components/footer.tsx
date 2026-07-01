import Link from "next/link";
import { Linkedin, Instagram, MessageCircle, Mail } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/utils";

const groups = [
  {
    title: "Services",
    links: [
      { label: "AI WhatsApp Agents", href: "#services" },
      { label: "Business Dashboards", href: "#services" },
      { label: "Process Automation", href: "#services" },
      { label: "AI Marketing", href: "#services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#solution" },
      { label: "Industries", href: "#industries" },
      { label: "Contact", href: "#contact" },
      { label: "Privacy", href: "#" },
    ],
  },
];

const socials = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: MessageCircle, href: WHATSAPP_URL, label: "WhatsApp" },
  { icon: Mail, href: "mailto:hello@solveria.com", label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-950 py-16">
      <div className="container-px">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="#top" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-grad-brand font-display text-lg font-extrabold text-ink-950">
                S
              </span>
              <span className="font-display text-lg font-extrabold tracking-tight text-white">
                Solver<span className="text-brand-cyan">IA</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              We save time and increase sales using Artificial Intelligence.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.02] text-slate-400 transition-colors hover:border-brand-violet/40 hover:text-white"
                >
                  <s.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <h4 className="font-display text-sm font-bold text-white">{g.title}</h4>
              <ul className="mt-4 space-y-3">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-500 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} SolverIA. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Built with AI · Designed for growth
          </p>
        </div>
      </div>
    </footer>
  );
}
