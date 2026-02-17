import { Triangle } from "lucide-react";

export function FlowControlStack() {
  return (
    <div className="flex flex-col gap-1 p-2 bg-card dark:bg-card-elevated border border-border dark:border-white/5 rounded-sm shadow-xl w-[300px] antialiased">
      <div className="bg-muted/30 dark:bg-black/20 border border-border dark:border-white/5 rounded-sm px-3 py-2.5 flex items-center justify-between group cursor-pointer hover:border-primary/30 dark:hover:border-white/10 transition-colors shadow-sm">
        <div className="flex items-center gap-3">
          <Triangle className="h-4 w-4 text-warning fill-transparent stroke-[2.5]" />
          <span className="text-[12px] font-bold text-foreground dark:text-gray-200 uppercase tracking-wide">
            KICK DETECTION
          </span>
        </div>
        <span className="text-[10px] font-bold text-muted-foreground dark:text-slate-500 tracking-wider">
          ARMED
        </span>
      </div>

      <div className="bg-muted/30 dark:bg-black/20 border border-border dark:border-white/5 rounded-sm px-3 py-2.5 flex items-center justify-between group cursor-pointer hover:border-primary/30 dark:hover:border-white/10 transition-colors shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 rounded-full border-[2px] border-muted-foreground/50 dark:border-slate-600 flex items-center justify-center">
            <div className="h-1.5 w-1.5 bg-muted-foreground/50 dark:bg-slate-600 rounded-full" />
          </div>
          <span className="text-[12px] font-bold text-foreground dark:text-gray-200 uppercase tracking-wide">
            LOSS DETECTION
          </span>
        </div>
        <span className="text-[10px] font-bold text-muted-foreground dark:text-slate-500 tracking-wider">
          ARMED
        </span>
      </div>

      <div className="bg-muted/30 dark:bg-black/20 border border-border dark:border-white/5 rounded-sm p-2.5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[12px] font-bold text-foreground dark:text-gray-200 ml-1">
            PRC
          </span>
          <div className="flex items-center bg-muted/50 dark:bg-black/40 rounded-[1px] p-0.5 border border-border dark:border-white/5">
            <span className="text-[10px] text-muted-foreground dark:text-slate-500 px-2 py-0.5 hover:text-foreground dark:hover:text-slate-300 cursor-pointer transition-colors font-medium">
              Enabled
            </span>
            <ControlNumberButton label="0.000 PSI" />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold text-muted-foreground dark:text-slate-500 w-8 ml-1">
            MAN
          </span>
          <div className="flex flex-wrap bg-muted/50 dark:bg-black/20 rounded-[2px]">
            <ControlNumberButton label="1" />
            <ControlNumberButton label="2" />
            <ControlNumberButton label="3" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-muted-foreground dark:text-slate-500 w-8 ml-1">
              AUX
            </span>
            <div className="flex flex-wrap bg-muted/50 dark:bg-black/20 rounded-[2px]">
              <ControlNumberButton label="1" />
              <ControlNumberButton label="2" />
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-[11px] font-bold text-muted-foreground dark:text-slate-500 ml-1 w-16">
              CEMENT
            </span>
            <div className="flex flex-wrap bg-muted/50 dark:bg-black/20 rounded-[2px]">
              <ControlNumberButton label="1" />
              {/* <ControlNumberButton label="2" /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlNumberButton({ label }: { label: string }) {
  return (
    <button className="my-1 mr-1 px-2.5 py-0.5 bg-primary dark:bg-primary/80 text-primary-foreground dark:text-primary-foreground text-[10px] font-bold rounded-[1px] shadow-sm hover:opacity-90 transition-opacity">
      {label}
    </button>
  );
}
