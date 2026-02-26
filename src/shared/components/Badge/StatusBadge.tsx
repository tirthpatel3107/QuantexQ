import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/shared/utils/utils";

export interface StatusBadgeProps extends BadgeProps {
  status: string;
}

export function StatusBadge({ status, className, children, ...props }: StatusBadgeProps) {
  const getStatusColor = (s: string) => {
    switch (s.toLowerCase()) {
      case "primary":
        return "bg-blue-500 text-white hover:bg-blue-600";
      case "connected":
        return "bg-green-500 text-white hover:bg-green-600";
      case "warning":
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      case "disconnected":
        return "bg-red-500 text-white hover:bg-red-600";
      default:
        return "bg-gray-500 text-white hover:bg-gray-600";
    }
  };

  return (
    <Badge
      variant="default"
      className={cn(getStatusColor(status), className)}
      {...props}
    >
      {children || status}
    </Badge>
  );
}
