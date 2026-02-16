import { cn } from "@/lib/utils";

interface PsiGaugeIconProps {
  className?: string;
}

export function PsiGaugeIcon({ className }: PsiGaugeIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn(className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <circle cx="16" cy="16" r="12" />
      <path d="M16 8v4M16 20v4M8 16h4M20 16h4M10.34 10.34l2.83 2.83M18.83 18.83l2.83 2.83M10.34 21.66l2.83-2.83M18.83 13.17l2.83-2.83" />
      <text
        x="16"
        y="17.5"
        textAnchor="middle"
        fill="currentColor"
        style={{ fontSize: 6, fontWeight: 600 }}
      >
        PSI
      </text>
    </svg>
  );
}
