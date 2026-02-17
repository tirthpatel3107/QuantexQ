import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Square } from "lucide-react";
import { useSimulation } from "@/hooks/useSimulation";
import { CommonAlertDialog, CommonButton } from "@/components/common";

import { SIMULATION_TIMER_STORAGE_KEY } from "@/constants/config";

function loadPosition(): { x: number; y: number } | null {
  try {
    const raw = localStorage.getItem(SIMULATION_TIMER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { x: number; y: number };
    if (typeof parsed.x === "number" && typeof parsed.y === "number")
      return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

function savePosition(x: number, y: number) {
  try {
    localStorage.setItem(
      SIMULATION_TIMER_STORAGE_KEY,
      JSON.stringify({ x, y }),
    );
  } catch {
    /* ignore */
  }
}

interface SimulationTimerWidgetProps {
  /** Called when user clicks the stop button (parent can open confirm dialog or widget uses its own) */
  onStopClick?: () => void;
  /** If true, widget renders its own stop-confirm dialog; otherwise parent handles it */
  useOwnStopDialog?: boolean;
}

export function SimulationTimerWidget({
  onStopClick,
  useOwnStopDialog = true,
}: SimulationTimerWidgetProps) {
  const { showTimer, formattedElapsed, setRunning } = useSimulation();
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    loadPosition,
  );
  const [stopDialogOpen, setStopDialogOpen] = useState(false);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
  } | null>(null);

  useEffect(() => {
    if (position === null) return;
    savePosition(position.x, position.y);
  }, [position]);

  const handleStopClick = useCallback(() => {
    if (useOwnStopDialog) setStopDialogOpen(true);
    else onStopClick?.();
  }, [useOwnStopDialog, onStopClick]);

  const handleConfirmStop = useCallback(() => {
    setRunning(false);
    setStopDialogOpen(false);
  }, [setRunning]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      e.preventDefault();
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startLeft: position?.x ?? rect.left,
        startTop: position?.y ?? rect.top,
      };
      (
        el as unknown as { setPointerCapture?: (id: number) => void }
      ).setPointerCapture?.(e.pointerId);
    },
    [position],
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    setPosition({ x: d.startLeft + dx, y: d.startTop + dy });
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    dragRef.current = null;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  }, []);

  if (!showTimer) return null;

  const style: React.CSSProperties =
    position !== null
      ? { left: position.x, top: position.y }
      : { right: 16, top: 56 };

  const widget = (
    <div
      role="status"
      aria-live="polite"
      className="fixed z-50 flex cursor-grab active:cursor-grabbing items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-lg select-none touch-none"
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={() => {
        dragRef.current = null;
      }}
    >
      <span className="text-base font-bold tabular-nums text-foreground pointer-events-none">
        {formattedElapsed}
      </span>
      <CommonButton
        size="icon"
        onClick={handleStopClick}
        className="h-8 w-8 shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        aria-label="Stop operation"
        icon={Square}
      />
    </div>
  );

  return (
    <>
      {createPortal(widget, document.body)}
      {useOwnStopDialog && (
        <CommonAlertDialog
          open={stopDialogOpen}
          onOpenChange={setStopDialogOpen}
          title="Stop operation?"
          description="Are you sure you want to stop? This will halt the current operation."
          cancelText="Cancel"
          actionText="Stop"
          onAction={handleConfirmStop}
          actionClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        />
      )}
    </>
  );
}
