import * as React from "react";
import {
  Tabs as BaseTabs,
  TabsList as BaseTabsList,
  TabsTrigger as BaseTabsTrigger,
  TabsContent as BaseTabsContent,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type CommonTabsProps = React.ComponentPropsWithoutRef<typeof BaseTabs>;

export function CommonTabs({ className, ...props }: CommonTabsProps) {
  return <BaseTabs className={className} {...props} />;
}

export type CommonTabsListProps = React.ComponentPropsWithoutRef<
  typeof BaseTabsList
>;

export function CommonTabsList({ className, ...props }: CommonTabsListProps) {
  return (
    <BaseTabsList
      className={cn(
        "flex items-center gap-1 border-b border-border pb-0 relative bg-transparent p-0 h-auto text-foreground mb-5",
        className,
      )}
      {...props}
    />
  );
}

export type CommonTabsTriggerProps = React.ComponentPropsWithoutRef<
  typeof BaseTabsTrigger
>;

export function CommonTabsTrigger({
  className,
  children,
  ...props
}: CommonTabsTriggerProps) {
  return (
    <BaseTabsTrigger
      className={cn(
        "px-12 py-4 text-sm font-semibold transition-all duration-300 relative z-10",
        "text-muted-foreground hover:text-foreground hover:bg-white/5",
        "data-[state=active]:text-primary data-[state=active]:bg-primary/5",
        "data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary data-[state=active]:after:shadow-glow",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">{children}</div>
    </BaseTabsTrigger>
  );
}

export type CommonTabsContentProps = React.ComponentPropsWithoutRef<
  typeof BaseTabsContent
>;

export function CommonTabsContent({
  className,
  ...props
}: CommonTabsContentProps) {
  return (
    <BaseTabsContent
      className={cn(
        "mt-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
        className,
      )}
      {...props}
    />
  );
}

export type CommonTabsItem = {
  value: string;
  label: React.ReactNode;
  icon?: React.ElementType;
  className?: string;
};

export interface CommonTabsNavProps {
  items: CommonTabsItem[];
  className?: string;
}

export function CommonTabsNav({ items, className }: CommonTabsNavProps) {
  return (
    <CommonTabsList className={className}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <CommonTabsTrigger
            key={item.value}
            value={item.value}
            className={item.className}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {typeof item.label === "string" ? (
              <span>{item.label}</span>
            ) : (
              item.label
            )}
          </CommonTabsTrigger>
        );
      })}
    </CommonTabsList>
  );
}
