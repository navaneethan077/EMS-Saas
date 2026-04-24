"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Building2, CreditCard, Sliders, ChevronLeft, ShieldCheck, Zap, Pencil } from "lucide-react";
import { toast } from "sonner";
import { type Company } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface EditCompanyDialogProps {
  company: Company | null;
  onClose: () => void;
  onSave: (company: Company) => void;
}

const STEPS = [
  { id: "identity", label: "Identity", icon: Building2 },
  { id: "admin", label: "Admin Setup", icon: ShieldCheck },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "limits", label: "Limits & Features", icon: Sliders },
];

export function EditCompanyDialog({ company, onClose, onSave }: EditCompanyDialogProps) {
  const [activeTab, setActiveTab] = useState("identity");
  const [formData, setFormData] = useState<Partial<Company>>({});

  useEffect(() => {
    if (company) {
      setFormData({
        ...company,
        billingCycle: company.billingCycle || "monthly",
        isTrial: company.isTrial || false,
        maxStorage: company.maxStorage || 50,
        apiLimits: company.apiLimits || 1000,
        analyticsEnabled: company.analyticsEnabled || false,
      });
      setActiveTab("identity");
    }
  }, [company]);

  if (!company) return null;

  const handleChange = (field: keyof Company, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      toast.error("Please fill in required fields (Company Name, Email)");
      return;
    }

    onSave(formData as Company);
    toast.success(`${formData.name} updated successfully!`);
    onClose();
  };

  return (
    <Dialog open={!!company} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-[700px] md:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 sm:rounded-2xl bg-background border-none shadow-2xl shadow-primary/10">
        <div className="bg-gradient-to-b from-muted/50 to-background px-6 pt-6 pb-4 border-b border-border/50">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-inner shadow-primary-foreground/20">
                <Pencil className="w-5 h-5 text-primary-foreground" />
              </div>
              Edit {company.name}
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              Update organization details, access, subscriptions, and limits.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full h-auto p-1.5 bg-muted/60 rounded-xl gap-1.5">
              {STEPS.map((step) => {
                const isActive = activeTab === step.id;
                return (
                  <TabsTrigger
                    key={step.id}
                    value={step.id}
                    className={cn(
                      "py-2.5 px-2 rounded-lg transition-all duration-300 flex flex-col sm:flex-row items-center gap-2",
                      "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:border-primary/10"
                    )}
                  >
                    <div className={cn(
                      "w-7 h-7 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-colors",
                      isActive ? "bg-primary/10 text-primary" : "bg-transparent text-muted-foreground"
                    )}>
                      <step.icon className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    </div>
                    <span className="text-[10px] sm:text-sm font-semibold">{step.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        <Tabs value={activeTab} className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            <TabsContent value="identity" className="space-y-6 m-0 h-full flex flex-col data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Company Name <span className="text-destructive">*</span></Label>
                  <Input value={formData.name || ""} onChange={e => handleChange("name", e.target.value)} className="h-11 bg-muted/30 focus-visible:bg-transparent" />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Display Name</Label>
                  <Input value={formData.displayName || ""} onChange={e => handleChange("displayName", e.target.value)} className="h-11 bg-muted/30 focus-visible:bg-transparent" />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Business Email <span className="text-destructive">*</span></Label>
                  <Input type="email" value={formData.email || ""} onChange={e => handleChange("email", e.target.value)} className="h-11 bg-muted/30 focus-visible:bg-transparent" />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Phone Number</Label>
                  <Input value={formData.phone || ""} onChange={e => handleChange("phone", e.target.value)} className="h-11 bg-muted/30 focus-visible:bg-transparent" />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Country / Region</Label>
                  <Input value={formData.country || ""} onChange={e => handleChange("country", e.target.value)} className="h-11 bg-muted/30 focus-visible:bg-transparent" />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Status</Label>
                  <Select value={formData.status || "Active"} onValueChange={v => handleChange("status", v as any)}>
                    <SelectTrigger className="h-11 bg-muted/30"><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active" className="text-emerald-600 font-medium">Active</SelectItem>
                      <SelectItem value="Pending" className="text-amber-600 font-medium">Pending</SelectItem>
                      <SelectItem value="Suspended" className="text-red-600 font-medium">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="admin" className="space-y-6 m-0 h-full flex flex-col data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
                <div className="space-y-2.5 col-span-1 sm:col-span-2">
                  <Label className="text-sm font-semibold">Admin Full Name</Label>
                  <Input value={formData.adminName || ""} onChange={e => handleChange("adminName", e.target.value)} className="h-11 bg-muted/30" />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Admin Login Email</Label>
                  <Input type="email" value={formData.adminEmail || ""} onChange={e => handleChange("adminEmail", e.target.value)} className="h-11 bg-muted/30" />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Reset Password</Label>
                  <Input type="password" value={formData.adminPassword || ""} onChange={e => handleChange("adminPassword", e.target.value)} placeholder="Type new password" className="h-11 bg-muted/30" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-6 m-0 h-full flex flex-col data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Plan Tier</Label>
                  <Select value={formData.plan || "Basic"} onValueChange={v => handleChange("plan", v as any)}>
                    <SelectTrigger className="h-11 bg-muted/30"><SelectValue placeholder="Select plan" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Free" className="font-medium">Free Tier</SelectItem>
                      <SelectItem value="Basic" className="font-medium text-blue-600 dark:text-blue-400">Basic Tier</SelectItem>
                      <SelectItem value="Pro" className="font-medium text-purple-600 dark:text-purple-400">Pro Tier</SelectItem>
                      <SelectItem value="Enterprise" className="font-medium text-emerald-600 dark:text-emerald-400">Enterprise Tier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Billing Cycle</Label>
                  <Select value={formData.billingCycle || "monthly"} onValueChange={v => handleChange("billingCycle", v)}>
                    <SelectTrigger className="h-11 bg-muted/30"><SelectValue placeholder="Select cycle" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly <span className="text-emerald-500 ml-1 font-medium">(Save 20%)</span></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Start Date</Label>
                  <Input type="date" value={formData.startDate || formData.joinedAt?.split('T')[0] || ""} onChange={e => handleChange("startDate", e.target.value)} className="h-11 bg-muted/30" />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Expiry Date (Optional)</Label>
                  <Input type="date" value={formData.expiryDate || ""} onChange={e => handleChange("expiryDate", e.target.value)} className="h-11 bg-muted/30" />
                </div>
                <div className="space-y-2.5 col-span-1 sm:col-span-2">
                  <Label className="text-sm font-semibold">Monthly Revenue</Label>
                  <Input type="number" value={formData.revenue || 0} onChange={e => handleChange("revenue", Number(e.target.value))} className="h-11 bg-muted/30" />
                </div>
                <div className="sm:col-span-2 border border-border/60 rounded-xl p-5 mt-2 bg-gradient-to-r from-card to-muted/20 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <Label className="text-base font-bold flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        Trial Mode
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">Is this tenant currently on a trial period?</p>
                    </div>
                    <Switch checked={formData.isTrial || false} onCheckedChange={c => handleChange("isTrial", c)} className="data-[state=checked]:bg-amber-500" />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="limits" className="space-y-6 m-0 h-full flex flex-col data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Max Users Allowed</Label>
                  <Input type="number" min={1} value={formData.users || 1} onChange={e => handleChange("users", Number(e.target.value))} className="h-11 bg-muted/30" />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Storage Quota (GB)</Label>
                  <Input type="number" min={1} value={formData.maxStorage || 50} onChange={e => handleChange("maxStorage", Number(e.target.value))} className="h-11 bg-muted/30" />
                </div>
                <div className="space-y-2.5 sm:col-span-2">
                  <Label className="text-sm font-semibold">API Rate Limits (req / min)</Label>
                  <Input type="number" min={100} value={formData.apiLimits || 1000} onChange={e => handleChange("apiLimits", Number(e.target.value))} className="h-11 bg-muted/30" />
                </div>
              </div>

              <div className="border border-border/60 rounded-xl p-5 bg-card mt-2 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label className="text-base font-bold">Advanced Analytics</Label>
                    <p className="text-sm text-muted-foreground">Allow access to predictive revenue modeling and custom reports.</p>
                  </div>
                  <Switch checked={formData.analyticsEnabled || false} onCheckedChange={c => handleChange("analyticsEnabled", c)} />
                </div>
              </div>
            </TabsContent>
          </div>

          <div className="p-6 bg-muted/30 border-t border-border/50 flex items-center justify-between mt-auto">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="px-6 h-11 font-semibold hover:bg-background"
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Cancel
            </Button>
            
            <Button onClick={handleSubmit} className="px-8 h-11 font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
              Save Changes
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
