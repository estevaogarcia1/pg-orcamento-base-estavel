import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: "default" | "primary" | "accent" | "success" | "warning";
  href?: string;
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  function StatCard(
    { title, value, description, icon: Icon, trend, variant = "default", href },
    ref
  ) {
    const variants = {
      default: "bg-card",
      primary: "bg-primary text-primary-foreground",
      accent: "bg-accent text-accent-foreground",
      success: "bg-success text-success-foreground",
      warning: "bg-warning text-warning-foreground",
    };

    const iconVariants = {
      default: "bg-accent/10 text-accent",
      primary: "bg-primary-foreground/20 text-primary-foreground",
      accent: "bg-accent-foreground/20 text-accent-foreground",
      success: "bg-success-foreground/20 text-success-foreground",
      warning: "bg-warning-foreground/20 text-warning-foreground",
    };

    const content = (
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p
            className={cn(
              "text-sm font-medium",
              variant === "default" ? "text-muted-foreground" : "opacity-80"
            )}
          >
            {title}
          </p>
          <p className="text-3xl font-bold">{value}</p>
          {description && (
            <p
              className={cn(
                "text-sm",
                variant === "default" ? "text-muted-foreground" : "opacity-70"
              )}
            >
              {description}
            </p>
          )}
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                trend.positive ? "text-success" : "text-destructive"
              )}
            >
              <span>{trend.positive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className={cn("rounded-lg p-3", iconVariants[variant])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    );

    const baseClasses = cn(
      "rounded-xl p-6 shadow-md transition-all duration-200 hover:shadow-lg animate-fade-in",
      variants[variant],
      href && "cursor-pointer hover:scale-[1.02]"
    );

    if (href) {
      return (
        <Link to={href} className={baseClasses}>
          {content}
        </Link>
      );
    }

    return (
      <div ref={ref} className={baseClasses}>
        {content}
      </div>
    );
  }
);

StatCard.displayName = "StatCard";
