import { ReactNode, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CommonAccordionItemProps {
  title: string;
  tags?: string;
  healthStatus?: string;
  healthCount?: string;
  children?: ReactNode;
  defaultExpanded?: boolean;
}

export function CommonAccordionItem({
  title,
  tags,
  healthStatus = "OK",
  healthCount = "3/3",
  children,
  defaultExpanded = true,
}: CommonAccordionItemProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getHealthColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ok":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full hover:text-foreground/80 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Health:</span>
          <span className={`font-medium ${getHealthColor(healthStatus)}`}>
            {healthStatus}
          </span>
          <span>{healthCount}</span>
        </div>
      </button>
      {isExpanded && (
        <>
          {tags && (
            <div className="text-sm text-muted-foreground pl-6">
              Tags: {tags}
            </div>
          )}
          {children && <div className="pl-6">{children}</div>}
        </>
      )}
    </div>
  );
}
