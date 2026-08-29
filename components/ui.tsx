import type { ReactNode } from "react";

export function ArrowRight({ size = 15, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden="true"
      className={`icon-dir shrink-0 ${className}`}
    >
      <path
        d="M3 7.5h8M8 4.5l3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Blue fill with near-black label — 9.6:1, and it keeps the palette to three colours. */
export function Button({
  children,
  href = "#demo",
  size = "md",
  variant = "primary",
  className = "",
  onClick,
}: {
  children: ReactNode;
  href?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "outline";
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const sizes = {
    sm: "h-9 px-4 text-[13px]",
    md: "h-11 px-5 text-[14px]",
    lg: "h-[52px] px-7 text-[15px]",
  }[size];

  const variants = {
    primary:
      "bg-blue text-ink hover:brightness-[1.06] active:brightness-95 shadow-[0_1px_0_rgba(10,10,10,.04)]",
    outline: "bg-paper text-ink border border-line hover:border-ink-25 hover:bg-off",
  }[variant];

  return (
    <a
      href={href}
      onClick={onClick}
      data-cursor="send"
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold
        transition-[filter,background-color,border-color] duration-150 ${sizes} ${variants} ${className}`}
    >
      {children}
    </a>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="block h-px w-[18px] bg-blue" aria-hidden="true" />
      <span className="mono-label text-blue-ink">{children}</span>
    </span>
  );
}

export function SectionHeader({
  kicker,
  lines,
  intro,
  aside,
}: {
  kicker: string;
  lines: ReactNode;
  intro?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
      <div className="lg:max-w-[740px]">
        <Kicker>{kicker}</Kicker>
        <div className="mt-5">{lines}</div>
      </div>
      {(intro || aside) && (
        <div className="lg:w-[400px] lg:shrink-0">
          {intro && <p className="text-[16.5px] leading-[1.72] text-ink-70">{intro}</p>}
          {aside}
        </div>
      )}
    </div>
  );
}
