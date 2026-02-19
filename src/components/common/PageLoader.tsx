import React from "react";
import { cn } from "@/lib/utils";

interface PageLoaderProps {
  className?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md transition-all duration-500",
        className,
      )}
    >
      <div className="relative flex items-center justify-center">
        {/* Decorative Rings */}
        <div className="absolute h-48 w-48 rounded-full border border-primary/5 animate-[ping_3s_linear_infinite]" />
        <div className="absolute h-40 w-40 rounded-full border border-primary/10 animate-[pulse_4s_ease-in-out_infinite]" />

        {/* Rotating Outer Ring */}
        <div className="absolute h-32 w-32 rounded-full border-2 border-transparent border-t-primary/40 border-r-primary/40 animate-[spin_1.5s_linear_infinite]" />

        {/* Rotating Inner Ring */}
        <div className="absolute h-24 w-24 rounded-full border-2 border-transparent border-b-primary border-l-primary animate-[spin_2s_linear_infinite_reverse]" />

        {/* Central Logo Container */}
        <div className="relative h-14 w-14 flex items-center justify-center overflow-hidden rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent animate-pulse" />
          <div className="relative h-8 w-8 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <circle
                cx="32"
                cy="32"
                r="18"
                stroke="currentColor"
                strokeWidth="6"
              />
              <circle cx="32" cy="32" r="7" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="mt-12 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold tracking-widest uppercase text-foreground/90">
            Quantex<span className="text-primary italic">Q</span>
          </h2>
        </div>

        <div className="h-[2px] w-32 bg-primary/10 rounded-full overflow-hidden mt-2">
          <div className="h-full w-1/3 bg-primary rounded-full animate-[loading-bar_1.5s_ease-in-out_infinite]" />
        </div>

        {/* <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground/60 animate-pulse">
          Initializing Systems
        </p> */}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes loading-bar {
          0% { transform: translateX(-100%); width: 10%; }
          50% { width: 40%; }
          100% { transform: translateX(300%); width: 10%; }
        }
      `,
        }}
      />
    </div>
  );
};
