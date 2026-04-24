"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Subscription, plans } from "@/lib/mock-data";

interface SubscriptionDialogsProps {
  activeAction: { action: string; sub: Subscription } | null;
  onClose: () => void;
  onConfirm: (action: string, subId: string, payload?: any) => void;
}

export function SubscriptionDialogs({ activeAction, onClose, onConfirm }: SubscriptionDialogsProps) {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [dateInput, setDateInput] = useState("");

  useEffect(() => {
    if (activeAction) {
      if (activeAction.action === "assign_plan") setSelectedPlan(activeAction.sub.planId);
      if (activeAction.action === "adjust_expiry") setDateInput(activeAction.sub.endDate);
      if (activeAction.action === "extend_trial") {
        setDateInput(activeAction.sub.trialEndDate || activeAction.sub.endDate);
      }
    } else {
      setSelectedPlan("");
      setDateInput("");
    }
  }, [activeAction]);

  if (!activeAction) return null;

  const { action, sub } = activeAction;

  const handleConfirm = () => {
    let payload: any = null;
    if (action === "assign_plan") payload = { planId: selectedPlan };
    if (action === "adjust_expiry" || action === "extend_trial") payload = { date: dateInput };
    
    onConfirm(action, sub.id, payload);
    onClose();
  };

  return (
    <Dialog open={!!activeAction} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {action === "assign_plan" && "Assign / Upgrade Plan"}
            {action === "extend_trial" && "Start / Extend Trial"}
            {action === "adjust_expiry" && "Adjust Expiry Date"}
            {action === "toggle_renew" && "Toggle Auto-Renew"}
            {action === "pause" && "Pause Subscription"}
            {action === "resume" && "Resume Subscription"}
            {action === "cancel" && "Cancel Subscription"}
          </DialogTitle>
          <DialogDescription>
            Managing subscription for <strong>{sub.company}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {action === "assign_plan" && (
            <div className="space-y-2">
              <Label>Select New Plan</Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger><SelectValue placeholder="Select plan" /></SelectTrigger>
                <SelectContent>
                  {plans.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {(action === "adjust_expiry" || action === "extend_trial") && (
            <div className="space-y-2">
              <Label>{action === "extend_trial" ? "New Trial End Date" : "New Expiry Date"}</Label>
              <Input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} />
            </div>
          )}

          {action === "toggle_renew" && (
            <p className="text-sm">
              Currently auto-renew is <strong>{sub.autoRenew ? "ON" : "OFF"}</strong>. 
              Are you sure you want to turn it {sub.autoRenew ? "OFF" : "ON"}?
            </p>
          )}

          {action === "pause" && (
            <p className="text-sm text-muted-foreground">
              This will suspend the subscription and block user access until resumed. Billing will also be paused.
            </p>
          )}

          {action === "resume" && (
            <p className="text-sm text-muted-foreground">
              This will reactivate the subscription and restore user access.
            </p>
          )}

          {action === "cancel" && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-500/10 p-3 rounded-md">
              Warning: This action will permanently cancel the subscription for this company. They will lose access at the end of their billing cycle or immediately based on your platform settings.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          <Button 
            variant={action === "cancel" ? "destructive" : "default"} 
            size="sm" 
            onClick={handleConfirm}
          >
            Confirm Action
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
