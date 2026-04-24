"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Building2, 
  Calendar, 
  CreditCard, 
  Clock, 
  ShieldCheck, 
  Zap,
  Info,
  History
} from "lucide-react";
import { Subscription, plans } from "@/lib/mock-data";

interface SubscriptionDetailProps {
  subscription: Subscription | null;
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string, sub: Subscription) => void;
}

const statusBadge: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  expired: "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20",
  trial: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  past_due: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  suspended: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
};

export function SubscriptionDetail({ subscription, isOpen, onClose, onAction }: SubscriptionDetailProps) {
  if (!subscription) return null;

  const plan = plans.find(p => p.id === subscription.planId);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">{subscription.company}</DialogTitle>
              <DialogDescription>
                Subscription ID: {subscription.id}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Main Info */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Current Plan
              </h4>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-lg">{subscription.planName}</p>
                    <p className="text-sm text-muted-foreground capitalize">{subscription.billingCycle} billing</p>
                  </div>
                  <Badge className={`border capitalize ${statusBadge[subscription.status] || statusBadge.active}`}>
                    {subscription.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-primary mt-2">
                  {formatCurrency(subscription.price)}
                  <span className="text-sm text-muted-foreground font-normal ml-1">
                    /{subscription.billingCycle === "monthly" ? "mo" : "yr"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Dates & Billing
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/20 rounded-lg p-3 border border-border/50">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Started On</p>
                  <p className="text-sm font-medium">{formatDate(subscription.startDate)}</p>
                </div>
                <div className="bg-muted/20 rounded-lg p-3 border border-border/50">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
                    {subscription.autoRenew ? "Next Billing" : "Ends On"}
                  </p>
                  <p className="text-sm font-medium">{formatDate(subscription.endDate)}</p>
                </div>
                {subscription.isTrial && (
                  <div className="bg-blue-500/5 rounded-lg p-3 border border-blue-500/10 col-span-2">
                    <p className="text-[10px] uppercase tracking-wider text-blue-500 font-medium mb-1">Trial Status</p>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Ends {formatDate(subscription.trialEndDate || subscription.endDate)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Settings & Status */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Subscription Settings
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Auto-Renew</p>
                      <p className="text-xs text-muted-foreground">{subscription.autoRenew ? "Enabled" : "Disabled"}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onAction("toggle_renew", subscription)}>
                    Toggle
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Payment Method</p>
                      <p className="text-xs text-muted-foreground">Visa ending in 4242</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">Default</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                Quick Actions
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="justify-start h-9" onClick={() => onAction("assign_plan", subscription)}>
                  <Zap className="w-3.5 h-3.5 mr-2" /> Upgrade
                </Button>
                <Button variant="outline" size="sm" className="justify-start h-9" onClick={() => onAction("adjust_expiry", subscription)}>
                  <Clock className="w-3.5 h-3.5 mr-2" /> Extend
                </Button>
                {subscription.status === "active" ? (
                  <Button variant="outline" size="sm" className="justify-start h-9" onClick={() => onAction("pause", subscription)}>
                    <Pause className="w-3.5 h-3.5 mr-2" /> Pause
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="justify-start h-9" onClick={() => onAction("resume", subscription)}>
                    <Play className="w-3.5 h-3.5 mr-2" /> Resume
                  </Button>
                )}
                <Button variant="outline" size="sm" className="justify-start h-9 text-red-500 hover:text-red-600 hover:bg-red-500/5" onClick={() => onAction("cancel", subscription)}>
                  <XCircle className="w-3.5 h-3.5 mr-2" /> Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature List (Optional) */}
        {plan && plan.features && (
          <div className="border-t border-border mt-2 pt-6 pb-2">
            <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              Plan Features Included
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Close Details</Button>
          <Button onClick={() => onAction("assign_plan", subscription)}>Manage Plan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { RefreshCw, Pause, Play, XCircle } from "lucide-react";
