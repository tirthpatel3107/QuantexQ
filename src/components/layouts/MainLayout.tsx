import { ReactNode } from "react";
import { Header } from "@/components/features/dashboard/Header";
import { Sidebar } from "@/components/features/dashboard/Sidebar";
import { useAppSidebar } from "@/context/appSidebar";
import { cn } from "@/utils/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isOpen } = useAppSidebar();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={isOpen} />
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isOpen ? "lg:ml-[287px]" : "ml-0",
        )}
      >
        <Header />
        <main className="pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
