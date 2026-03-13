// React & Hooks
import type { ReactNode } from "react";

// Icons & Utils
import { cn } from "@/utils/lib/utils";

export interface PageLayoutProps {
  /** Main content. */
  children: ReactNode;
  /** Extra class for the outer wrapper. */
  className?: string;
  /** Extra class for the main content area. */
  mainClassName?: string;
}

/**
 * Standard page content wrapper: scrollable main area.
 * Use for Dashboard, Profile, Settings, Mud Properties.
 * Note: Header and Sidebar are now handled by MainLayout in routes.
 */
export function PageLayout({
  children,
  className,
  mainClassName,
}: PageLayoutProps) {
  return (
    <div className={cn("min-h-[calc(100vh-4.15rem)] bg-background flex flex-col", className)}>
      <main className={cn("flex-1 overflow-auto", mainClassName)}>
        {children}
      </main>
    </div>
  );
}
