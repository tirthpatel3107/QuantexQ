import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface CommonSliderProps {
  id?: string;
  label: string;
  description?: string;
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  showRangeLabels?: boolean;
  rangeLabels?: string[];
  rangeLabelPositions?: number[]; // Positions for labels (0-100%)
  className?: string;
}

export function CommonSlider({
  id,
  label,
  description,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  valueFormatter = (val) => `${val}`,
  showRangeLabels = false,
  rangeLabels,
  rangeLabelPositions,
  className,
}: CommonSliderProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <div className="space-y-0.5">
          <Label htmlFor={id} className="text-sm font-medium">
            {label}
          </Label>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {showValue && (
          <span className="text-sm font-medium">
            {valueFormatter(value[0])}
          </span>
        )}
      </div>
      <Slider
        id={id}
        value={value}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={step}
        className="mb-2 cursor-pointer [&>span:last-child]:cursor-pointer"
      />
      {showRangeLabels && rangeLabels && (
        <div className="relative text-sm text-muted-foreground h-5">
          {rangeLabelPositions ? (
            // Custom positioned labels
            rangeLabels.map((label, index) => {
              const position = rangeLabelPositions[index];
              // Adjust alignment for edge labels to prevent overflow
              let alignClass = "-translate-x-1/2";
              if (position === 0) {
                alignClass = ""; // Left align for first label
              } else if (position === 100) {
                alignClass = "-translate-x-full"; // Right align for last label
              }

              return (
                <span
                  key={index}
                  className={`absolute ${alignClass}`}
                  style={{ left: `${position}%` }}
                >
                  {label}
                </span>
              );
            })
          ) : (
            // Evenly spaced labels
            <div className="flex justify-between">
              {rangeLabels.map((label, index) => (
                <span key={index}>{label}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
