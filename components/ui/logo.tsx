import { cn } from "@/lib/utils";

/**
 * SolverIA mascot — a hand-drawn crowned face with "x x" eyes.
 * Rendered in currentColor so it adapts to context (white on dark, etc.).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("h-8 w-8", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* crown */}
      <path d="M19.5 21 C18.8 16 18.4 12 18.6 9.6 C21.5 12 24 13.7 26.4 15 C28.4 11.6 30.4 9 32 6.8 C33.7 9.2 35.6 11.8 37.8 15 C40.3 13.6 42.9 11.9 45.6 9.6 C45.8 12.3 45.3 16.3 44.6 21" />
      {/* crown base */}
      <path d="M19.5 21 C25 22.2 39 22.2 44.6 21" />
      {/* head */}
      <path d="M32 24.5 C41 24.5 47.5 31 47.5 39.5 C47.5 48 41 53.5 32 53.5 C23 53.5 16.5 48 16.5 39.5 C16.5 31 23 24.5 32 24.5 Z" />
      {/* left eye (x) */}
      <path d="M24 36 L28.4 40.4 M28.4 36 L24 40.4" />
      {/* right eye (x) */}
      <path d="M35.6 36 L40 40.4 M40 36 L35.6 40.4" />
      {/* mouth */}
      <path d="M28 46.5 C29.8 48.4 34.2 48.4 36 46.5" />
    </svg>
  );
}

/**
 * Full SolverIA logo — mascot + wordmark ("solver" light, "IA" cyan).
 */
export function Logo({
  className,
  markClassName,
  wordClassName,
  showMark = true,
}: {
  className?: string;
  markClassName?: string;
  wordClassName?: string;
  showMark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {showMark && (
        <LogoMark className={cn("h-8 w-8 text-white", markClassName)} />
      )}
      <span
        className={cn(
          "font-display text-[19px] font-semibold tracking-tight",
          wordClassName,
        )}
      >
        <span className="font-light text-slate-200/90">solver</span>
        <span className="text-brand-cyan">IA</span>
      </span>
    </span>
  );
}
