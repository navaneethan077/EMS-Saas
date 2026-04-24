import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  prefix?: string;
}

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  prefix,
}: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", iconBg)}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
            isPositive
              ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10"
              : "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10"
          )}
        >
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(change)}%
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground tracking-tight">
          {prefix && <span className="text-lg text-muted-foreground font-semibold">{prefix}</span>}
          {value}
        </p>
        <p className="text-sm text-muted-foreground mt-1">{title}</p>
      </div>
    </div>
  );
}
