import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface CommonToggleProps {
  id?: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function CommonToggle({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  className,
}: CommonToggleProps) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className || ""}`}>
      <div className="space-y-0.5 min-w-0 flex-1 pr-2">
        <Label htmlFor={id} className="cursor-pointer">
          {label}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="shrink-0"
      />
    </div>
  );
}
