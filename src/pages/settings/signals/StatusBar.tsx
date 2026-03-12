interface StatusBarProps {
  totalSignals: number;
  usedSignals: number;
}

export function StatusBar({ totalSignals, usedSignals }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between text-[13px] text-muted-foreground px-1">
      <div className="flex items-center gap-4">
        <span>
          Total Signals:{" "}
          <span className="font-semibold">{totalSignals}</span>
        </span>
        <span className="text-muted-foreground/50">|</span>
        <span>
          Used: <span className="font-semibold">{usedSignals}</span>
        </span>
      </div>
    </div>
  );
}
