import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "glow" | "ghost";

export function ButtonLink({
  href,
  children,
  variant = "glow",
  className,
  external,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
}) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2",
    variant === "glow" ? "btn-glow" : "btn-ghost",
    className,
  );
  const inner = <span className="relative z-10 inline-flex items-center gap-2">{children}</span>;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
