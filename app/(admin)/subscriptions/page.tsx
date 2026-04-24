"use client";

import { useState, useMemo } from "react";
import { CreditCard, Search, Filter, LayoutGrid, List, Plus, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import PageHeader from "@/components/dashboard/PageHeader";
import { subscriptions, type Subscription, plans, PlanName } from "@/lib/mock-data";
import { SubscriptionTable } from "./components/subscription-table";
import { SubscriptionGrid } from "./components/subscription-grid";
import { SubscriptionDialogs } from "./components/subscription-dialogs";
import { SubscriptionDetail } from "./components/subscription-detail";

export default function SubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [data, setData] = useState<Subscription[]>(subscriptions);
  const [activeAction, setActiveAction] = useState<{ action: string; sub: Subscription } | null>(null);
  const [selectedDetailSub, setSelectedDetailSub] = useState<Subscription | null>(null);

  const filtered = useMemo(() => {
    return data.filter((s) => {
      const matchSearch = s.company.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      const matchPlan = planFilter === "all" || s.planId === planFilter;
      return matchSearch && matchStatus && matchPlan;
    });
  }, [data, search, statusFilter, planFilter]);

  const handleActionConfirm = (action: string, subId: string, payload?: any) => {
    setData((prev) =>
      prev.map((s) => {
        if (s.id !== subId) return s;

        const updated = { ...s };

        switch (action) {
          case "assign_plan":
            const newPlan = plans.find((p) => p.id === payload.planId);
            if (newPlan) {
              updated.planId = newPlan.id;
              updated.planName = newPlan.name as PlanName;
              updated.price = newPlan.price;
            }
            break;
          case "extend_trial":
            updated.isTrial = true;
            updated.status = "trial";
            updated.trialEndDate = payload.date;
            updated.endDate = payload.date;
            break;
          case "adjust_expiry":
            updated.endDate = payload.date;
            break;
          case "toggle_renew":
            updated.autoRenew = !updated.autoRenew;
            break;
          case "pause":
            updated.status = "suspended";
            break;
          case "resume":
            updated.status = "active";
            break;
          case "cancel":
            updated.status = "cancelled";
            updated.autoRenew = false;
            break;
        }

        return updated;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Breadcrumbs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Admin</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Subscriptions</span>
          </div>

        </div>


      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        {/* Left: Header */}
        <PageHeader
          title="Subscriptions"
          description="View and manage all company subscriptions."
          icon={CreditCard}
        />

        {/* Right: Controls */}
        <div className="flex items-center gap-2 sm:ml-auto">

          {/* View toggle FIRST */}
          <div className="flex items-center border border-border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>

            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-none border-l border-border"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>

          {/* Create button AFTER */}
          <Button className="w-full sm:w-auto h-10 shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Subscription
          </Button>

        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: data.length, color: "text-foreground" },
          { label: "Active", value: data.filter((s) => s.status === "active").length, color: "text-emerald-500" },
          { label: "Trial", value: data.filter((s) => s.status === "trial").length, color: "text-blue-500" },
          { label: "Cancelled", value: data.filter((s) => s.status === "cancelled" || s.status === "expired").length, color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl px-4 py-3">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col min-h-[500px]">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 p-4 border-b border-border bg-muted/5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search company..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-32 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="past_due">Past Due</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="h-9 w-32 text-xs"><SelectValue placeholder="Plan" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                {plans.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>


          </div>
          <div className="hidden lg:flex ml-auto text-xs text-muted-foreground items-center font-medium">
            {filtered.length} results
          </div>
        </div>

        {/* Dynamic View Component */}
        {viewMode === "table" ? (
          <SubscriptionTable
            data={filtered}
            onAction={(action, sub) => setActiveAction({ action, sub })}
            onViewDetail={(sub) => setSelectedDetailSub(sub)}
          />
        ) : (
          <SubscriptionGrid
            data={filtered}
            onAction={(action, sub) => setActiveAction({ action, sub })}
            onViewDetail={(sub) => setSelectedDetailSub(sub)}
          />
        )}
      </div>

      {/* Detail View Component */}
      <SubscriptionDetail
        subscription={selectedDetailSub}
        isOpen={!!selectedDetailSub}
        onClose={() => setSelectedDetailSub(null)}
        onAction={(action, sub) => {
          setSelectedDetailSub(null);
          setActiveAction({ action, sub });
        }}
      />

      {/* Dialogs Component */}
      <SubscriptionDialogs
        activeAction={activeAction}
        onClose={() => setActiveAction(null)}
        onConfirm={handleActionConfirm}
      />
    </div>
  );
}
