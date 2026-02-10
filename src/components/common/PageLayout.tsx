import type { ReactNode } from "react";
import { Header } from "@/components/dashboard/Header";
import { cn } from "@/lib/utils";

export interface PageLayoutProps {
  /** Main content; Header is rendered above. */
  children: ReactNode;
  /** Extra class for the outer wrapper. */
  className?: string;
  /** Extra class for the main content area (below header). */
  mainClassName?: string;
}

/**
 * Standard page shell: full-height background, fixed Header, scrollable main.
 * Use for Dashboard, Profile, Settings, Mud Properties.
 */
export function PageLayout({ children, className, mainClassName }: PageLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background flex flex-col", className)}>
      <Header />
      <main className={cn("flex-1 overflow-auto", mainClassName)}>{children}</main>
    </div>
  );
}
