"use client";

import { useState } from "react";
import { Layers, Plus, Check, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import PageHeader from "@/components/dashboard/PageHeader";
import { plans, type Plan, type PlanName } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const planAccents: Record<string, { border: string; badge: string; glow: string }> = {
  Free: {
    border: "border-slate-200 dark:border-slate-700",
    badge: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    glow: "",
  },
  Basic: {
    border: "border-blue-200 dark:border-blue-800",
    badge: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
    glow: "",
  },
  Pro: {
    border: "border-violet-300 dark:border-violet-700 ring-2 ring-violet-500/20",
    badge: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
    glow: "shadow-lg shadow-violet-500/10",
  },
  Enterprise: {
    border: "border-orange-200 dark:border-orange-800",
    badge: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300",
    glow: "",
  },
};

const emptyPlan: Omit<Plan, "id" | "companies"> = {
  name: "Basic",
  price: 0,
  yearlyPrice: 0,
  description: "",
  features: [""],
  limits: { users: 10, storage: "10 GB", support: "Email" },
  popular: false,
};

export default function PlansPage() {
  const [data, setData] = useState<Plan[]>(plans);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Plan | null>(null);
  const [form, setForm] = useState<typeof emptyPlan>(emptyPlan);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyPlan);
    setModalOpen(true);
  };

  const openEdit = (plan: Plan) => {
    setEditTarget(plan);
    setForm({
      name: plan.name,
      price: plan.price,
      yearlyPrice: plan.yearlyPrice,
      description: plan.description,
      features: [...plan.features],
      limits: { ...plan.limits },
      popular: plan.popular,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editTarget) {
      setData((prev) => prev.map((p) => p.id === editTarget.id ? { ...p, ...form } : p));
    } else {
      setData((prev) => [
        ...prev,
        { ...form, id: `plan-${Date.now()}`, companies: 0 },
      ]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((p) => p.id !== id));
  };

  const updateFeature = (i: number, val: string) => {
    const next = [...form.features];
    next[i] = val;
    setForm((f) => ({ ...f, features: next }));
  };

  const addFeature = () => setForm((f) => ({ ...f, features: [...f.features, ""] }));
  const removeFeature = (i: number) => setForm((f) => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-6">
      <PageHeader title="Plans" description="Manage your pricing plans and feature sets." icon={Layers}>
        <Button size="sm" className="gap-2" onClick={openCreate}>
          <Plus className="w-4 h-4" /> Create Plan
        </Button>
      </PageHeader>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {data.map((plan) => {
          const accent = planAccents[plan.name] ?? planAccents.Basic;
          return (
            <div
              key={plan.id}
              className={`relative bg-card border rounded-2xl p-5 flex flex-col transition-all duration-200 hover:-translate-y-0.5 ${accent.border} ${accent.glow}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-violet-600 text-white border-0 text-[10px] px-3 shadow-lg">Most Popular</Badge>
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${accent.badge}`}>{plan.name}</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEdit(plan)}>
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => handleDelete(plan.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">{plan.price === 0 ? "Free" : formatCurrency(plan.price)}</span>
                  {plan.price > 0 && <span className="text-sm text-muted-foreground">/mo</span>}
                </div>
                {plan.yearlyPrice > 0 && (
                  <p className="text-xs text-muted-foreground mt-0.5">{formatCurrency(plan.yearlyPrice)}/yr · Save {Math.round((1 - plan.yearlyPrice / (plan.price * 12)) * 100)}%</p>
                )}
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{plan.description}</p>
              </div>

              <div className="flex-1 space-y-2 mb-5">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Companies</span>
                  <span className="font-semibold">{plan.companies}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Max Users</span>
                  <span className="font-semibold">{plan.limits.users === -1 ? "Unlimited" : plan.limits.users}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Storage</span>
                  <span className="font-semibold">{plan.limits.storage}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Edit Plan" : "Create New Plan"}</DialogTitle>
            <DialogDescription>{editTarget ? `Editing ${editTarget.name} plan` : "Define a new pricing plan"}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Plan Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value as PlanName }))}
                  placeholder="e.g. Pro"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Monthly Price ($)</label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Description</label>
              <Input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Plan description..."
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Max Users</label>
                <Input
                  type="number"
                  value={form.limits.users}
                  onChange={(e) => setForm((f) => ({ ...f, limits: { ...f.limits, users: Number(e.target.value) } }))}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Storage</label>
                <Input
                  value={form.limits.storage}
                  onChange={(e) => setForm((f) => ({ ...f, limits: { ...f.limits, storage: e.target.value } }))}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Support</label>
                <Input
                  value={form.limits.support}
                  onChange={(e) => setForm((f) => ({ ...f, limits: { ...f.limits, support: e.target.value } }))}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-muted-foreground">Features</label>
                <Button variant="outline" size="sm" className="h-6 text-xs" onClick={addFeature}>+ Add</Button>
              </div>
              <div className="space-y-2">
                {form.features.map((feat, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={feat}
                      onChange={(e) => updateFeature(i, e.target.value)}
                      placeholder={`Feature ${i + 1}`}
                      className="h-8 text-sm"
                    />
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 text-destructive" onClick={() => removeFeature(i)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>{editTarget ? "Save Changes" : "Create Plan"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
