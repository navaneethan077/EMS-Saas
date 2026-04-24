"use client";

import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Play, Pause, XCircle, Calendar, RefreshCw, ArrowUpCircle, Eye } from "lucide-react";
import { Subscription } from "@/lib/mock-data";

const statusBadge: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  expired: "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20",
  trial: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  past_due: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  suspended: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
};

interface SubscriptionTableProps {
  data: Subscription[];
  onAction: (action: string, sub: Subscription) => void;
  onViewDetail: (sub: Subscription) => void;
}

export function SubscriptionTable({ data, onAction, onViewDetail }: SubscriptionTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="text-xs font-semibold pl-4">Company</TableHead>
            <TableHead className="text-xs font-semibold">Plan</TableHead>
            <TableHead className="text-xs font-semibold">Status</TableHead>
            <TableHead className="text-xs font-semibold">Amount</TableHead>
            <TableHead className="text-xs font-semibold">Cycle</TableHead>
            <TableHead className="text-xs font-semibold">Start Date</TableHead>
            <TableHead className="text-xs font-semibold">End / Next Bill</TableHead>
            <TableHead className="text-xs font-semibold text-right pr-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12 text-muted-foreground text-sm">No subscriptions found.</TableCell>
            </TableRow>
          ) : (
            data.map((sub) => (
              <TableRow key={sub.id} className="border-border hover:bg-muted/30 transition-colors">
                <TableCell className="pl-4 text-sm font-medium">{sub.company}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px]">{sub.planName}</Badge>
                  {sub.isTrial && <Badge variant="secondary" className="ml-2 text-[10px] bg-blue-500/10 text-blue-500">Trial</Badge>}
                </TableCell>
                <TableCell>
                  <Badge className={`text-[10px] border capitalize ${statusBadge[sub.status] || statusBadge.active}`}>
                    {sub.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {formatCurrency(sub.price)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground capitalize">
                  {sub.billingCycle}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(sub.startDate)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <div className="flex flex-col">
                    <span>{formatDate(sub.endDate)}</span>
                    {sub.autoRenew && sub.status === "active" && (
                      <span className="text-[10px] text-emerald-500 mt-0.5">Renews {formatDate(sub.nextBillingDate)}</span>
                    )}
                    {!sub.autoRenew && sub.status === "active" && (
                      <span className="text-[10px] text-red-500 mt-0.5">Cancels {formatDate(sub.endDate)}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="pr-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
