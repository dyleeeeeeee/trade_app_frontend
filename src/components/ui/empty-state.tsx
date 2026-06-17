import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * EmptyState — a designed state, never a stalled spinner. Every data view
 * that can be empty renders one. Copy explains the state and implies the
 * resolution; "No data found." is forbidden.
 */
interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick?: () => void; href?: string };
}

export function EmptyState({ icon: Icon, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center px-6 py-16 text-center", className)}
      {...props}
    >
      {Icon && (
        <div
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-hairline/[0.08] bg-surface-overlay/60"
          aria-hidden="true"
        >
          <Icon className="h-8 w-8 text-text-tertiary" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-h3 text-text-primary">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-balance text-body-sm text-text-secondary">{description}</p>
      )}
      {action && (
        <Button
          variant="primary"
          size="md"
          className="mt-6"
          onClick={action.onClick}
          {...(action.href ? { asChild: true } : {})}
        >
          {action.href ? <a href={action.href}>{action.label}</a> : action.label}
        </Button>
      )}
    </div>
  );
}
