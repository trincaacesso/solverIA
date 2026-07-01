"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type Stat = {
  prefix?: string;
  value: number;
  suffix?: string;
  fixed?: string; // non-numeric display like "24/7"
  label: string;
};

const stats: Stat[] = [
  { prefix: "+", value: 10000, suffix: "", label: "Hours Saved" },
  { prefix: "+", value: 95, suffix: "%", label: "Automation Rate" },
  { fixed: "24/7", value: 0, label: "Availability" },
  { prefix: "+", value: 40, suffix: "%", label: "Average Sales Increase" },
];

function Counter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || stat.fixed) return;
    let raf = 0;
    let start: number | null = null;
    const duration = 1600;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(stat.value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, stat]);

  return (
    <p ref={ref} className="font-display text-4xl font-extrabold text-white sm:text-5xl">
      {stat.fixed ? (
        <span className="text-gradient">{stat.fixed}</span>
      ) : (
        <>
          <span className="text-gradient">
            {stat.prefix}
            {display.toLocaleString("en-US")}
            {stat.suffix}
          </span>
        </>
      )}
    </p>
  );
}

export function Numbers() {
  return (
    <section className="relative py-24 sm:py-28">
      <div className="ambient-glow pointer-events-none absolute inset-0 -z-10 opacity-50" />
      <div className="container-px">
        <div className="grid grid-cols-2 gap-6 rounded-3xl border border-white/10 bg-white/[0.02] p-8 sm:p-12 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <Counter stat={s} />
              <p className="mt-2 text-sm font-medium text-slate-400">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
