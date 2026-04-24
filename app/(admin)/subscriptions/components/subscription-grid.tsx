"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Play, Pause, XCircle, Calendar, RefreshCw, ArrowUpCircle, Eye, Building2, CreditCard } from "lucide-react";
import { Subscription } from "@/lib/mock-data";

const statusBadge: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  expired: "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20",
  trial: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  past_due: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  suspended: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
};

interface SubscriptionGridProps {
  data: Subscription[];
  onAction: (action: string, sub: Subscription) => void;
  onViewDetail: (sub: Subscription) => void;
}

export function SubscriptionGrid({ data, onAction, onViewDetail }: SubscriptionGridProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center h-full text-muted-foreground text-sm">
        <CreditCard className="h-12 w-12 mb-4 opacity-20" />
        <p>No subscriptions found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {data.map((sub) => (
        <div key={sub.id} className="bg-card border border-border rounded-xl p-4 flex flex-col hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-sm line-clamp-1">{sub.company}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px] py-0">{sub.planName}</Badge>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2 text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Manage Subscription</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onViewDetail(sub)}>
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onAction("assign_plan", sub)}>
                  <ArrowUpCircle className="mr-2 h-4 w-4" /> Assign / Upgrade Plan
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAction("extend_trial", sub)}>
                  <Calendar className="mr-2 h-4 w-4" /> Start / Extend Trial
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAction("adjust_expiry", sub)}>
                  <Calendar className="mr-2 h-4 w-4" /> Adjust Expiry Date
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAction("toggle_renew", sub)}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Toggle Auto-Renew
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {sub.status === "active" || sub.status === "trial" ? (
                  <DropdownMenuItem onClick={() => onAction("pause", sub)}>
                    <Pause className="mr-2 h-4 w-4" /> Pause Subscription
                  </DropdownMenuItem>
                ) : sub.status === "suspended" ? (
                  <DropdownMenuItem onClick={() => onAction("resume", sub)}>
                    <Play className="mr-2 h-4 w-4" /> Resume Subscription
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => onAction("cancel", sub)}>
                  <XCircle className="mr-2 h-4 w-4" /> Cancel Subscription
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Status</span>
              <Badge className={`text-[10px] border capitalize ${statusBadge[sub.status] || statusBadge.active}`}>
                {sub.status.replace("_", " ")}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">{formatCurrency(sub.price)} <span className="text-xs text-muted-foreground font-normal">/{sub.billingCycle === "monthly" ? "mo" : "yr"}</span></span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Started</span>
              <span>{formatDate(sub.startDate)}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border flex flex-col gap-1 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>{sub.autoRenew && sub.status === "active" ? "Renews" : "Ends"}</span>
              <span className="font-medium text-foreground">{formatDate(sub.endDate)}</span>
            </div>
            {sub.isTrial && (
              <div className="flex justify-between text-blue-500">
                <span>Trial ends</span>
                <span>{formatDate(sub.trialEndDate || sub.endDate)}</span>
              </div>
            )}
          </div>
          
          <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => onViewDetail(sub)}>
            <Eye className="w-4 h-4 mr-2" /> View Details
          </Button>
        </div>
      ))}
    </div>
  );
}
