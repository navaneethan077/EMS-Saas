"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Building2, User, CreditCard, Sliders, ChevronRight, ChevronLeft, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { type Company } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface AddCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (company: Company) => void;
}

const STEPS = [
  { id: "identity", label: "Identity", icon: Building2 },
  { id: "admin", label: "Admin Setup", icon: ShieldCheck },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "limits", label: "Limits & Features", icon: Sliders },
];

export function AddCompanyDialog({ open, onOpenChange, onAdd }: AddCompanyDialogProps) {
  const [activeTab, setActiveTab] = useState("identity");

  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    email: "",
    phone: "",
    country: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    plan: "Basic",
    billingCycle: "monthly",
    isTrial: false,
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: "",
    maxUsers: 10,
    maxStorage: 50,
    apiLimits: 1000,
    analyticsEnabled: false,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = (current: string) => {
    const currentIndex = STEPS.findIndex(s => s.id === current);
    if (currentIndex < STEPS.length - 1) {
      setActiveTab(STEPS[currentIndex + 1].id);
    }
  };

  const handleBack = (current: string) => {
    const currentIndex = STEPS.findIndex(s => s.id === current);
    if (currentIndex > 0) {
      setActiveTab(STEPS[currentIndex - 1].id);
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.adminEmail) {
      toast.error("Please fill in all required fields (Company Name, Emails)");
      return;
    }

    const newCompany: Company = {
      id: `c${Date.now()}`,
      name: formData.name,
      logo: formData.name.substring(0, 2).toUpperCase(),
      plan: formData.plan as "Free" | "Basic" | "Pro" | "Enterprise",
      users: formData.maxUsers,
      status: "Active",
      revenue: formData.plan === "Enterprise" ? 4000 : formData.plan === "Pro" ? 1300 : formData.plan === "Basic" ? 300 : 0,
      joinedAt: new Date().toISOString(),
      email: formData.email,
      country: formData.country || "US"
    };

    onAdd(newCompany);
    toast.success(`${formData.name} onboarded successfully!`);
    onOpenChange(false);
    // Reset form after a slight delay for transition
    setTimeout(() => setActiveTab("identity"), 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[700px] md:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 sm:rounded-2xl bg-background border-none shadow-2xl shadow-primary/10">
        <div className="bg-gradient-to-b from-muted/50 to-background px-6 pt-6 pb-4 border-b border-border/50">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-inner shadow-primary-foreground/20">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              Onboard New Tenant
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              Follow the steps to configure identity, access, and limits for the new organization.
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
                  <Input value={formData.name} onChange={e => handleChange("name", e.target.value)} placeholder="e.g. Acme Corp" className="h-11 bg-muted/30 focus-visible:bg-transparent" />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Display Name</Label>
                  <Input value={formData.displayName} onChange={e => handleChange("displayName", e.target.value)} placeholder="e.g. Acme" className="h-11 bg-muted/30 focus-visible:bg-transparent" />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Business Email <span className="text-destructive">*</span></Label>
                  <Input type="email" value={formData.email} onChange={e => handleChange("email", e.target.value)} placeholder="contact@acme.com" className="h-11 bg-muted/30 focus-visible:bg-transparent" />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Phone Number</Label>
                  <Input value={formData.phone} onChange={e => handleChange("phone", e.target.value)} placeholder="+1 (555) 000-0000" className="h-11 bg-muted/30 focus-visible:bg-transparent" />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Country / Region</Label>
                  <Input value={formData.country} onChange={e => handleChange("country", e.target.value)} placeholder="United States" className="h-11 bg-muted/30 focus-visible:bg-transparent" />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Company Logo</Label>
                  <Input type="file" className="h-11 pt-2.5 cursor-pointer bg-muted/30 focus-visible:bg-transparent" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="admin" className="space-y-6 m-0 h-full flex flex-col data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-2">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-5 rounded-xl border border-primary/20 mb-2 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/10">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">Company Owner Setup</p>
                  <p className="text-sm text-muted-foreground mt-1">This user will be granted full administrative privileges over the new tenant environment.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
                <div className="space-y-2.5 col-span-1 sm:col-span-2">
                  <Label className="text-sm font-semibold">Admin Full Name</Label>
                  <Input value={formData.adminName} onChange={e => handleChange("adminName", e.target.value)} placeholder="Jane Doe" className="h-11 bg-muted/30" />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Admin Login Email <span className="text-destructive">*</span></Label>
                  <Input type="email" value={formData.adminEmail} onChange={e => handleChange("adminEmail", e.target.value)} placeholder="jane@acme.com" className="h-11 bg-muted/30" />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Initial Password</Label>
                  <Input type="password" value={formData.adminPassword} onChange={e => handleChange("adminPassword", e.target.value)} placeholder="Auto-generate or type" className="h-11 bg-muted/30" />
                </div>
                <div className="space-y-2.5 col-span-1 sm:col-span-2">
                  <Label className="text-sm font-semibold">Assigned Role</Label>
                  <Input value="Company Owner / Super Admin" disabled className="h-11 bg-muted/50 text-muted-foreground font-medium" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-6 m-0 h-full flex flex-col data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Plan Tier</Label>
                  <Select value={formData.plan} onValueChange={v => handleChange("plan", v)}>
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
                  <Select value={formData.billingCycle} onValueChange={v => handleChange("billingCycle", v)}>
                    <SelectTrigger className="h-11 bg-muted/30"><SelectValue placeholder="Select cycle" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly <span className="text-emerald-500 ml-1 font-medium">(Save 20%)</span></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Start Date</Label>
                  <Input type="date" value={formData.startDate} onChange={e => handleChange("startDate", e.target.value)} className="h-11 bg-muted/30" />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Expiry Date (Optional)</Label>
                  <Input type="date" value={formData.expiryDate} onChange={e => handleChange("expiryDate", e.target.value)} className="h-11 bg-muted/30" />
                </div>
                
                <div className="sm:col-span-2 border border-border/60 rounded-xl p-5 mt-2 bg-gradient-to-r from-card to-muted/20 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <Label className="text-base font-bold flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        Enable Free Trial
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">Start this tenant on a 14-day trial period without requiring payment upfront.</p>
                    </div>
                    <Switch checked={formData.isTrial} onCheckedChange={c => handleChange("isTrial", c)} className="data-[state=checked]:bg-amber-500" />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="limits" className="space-y-6 m-0 h-full flex flex-col data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-2">
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 mb-2 flex items-center gap-4">
                <Sliders className="w-8 h-8 text-primary flex-shrink-0 p-1.5 bg-primary/10 rounded-lg" />
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  Defaults are based on the <span className="font-bold text-primary">{formData.plan}</span> plan. Adjust parameters to create a custom quota for this tenant.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Max Users Allowed</Label>
                  <Input type="number" min={1} value={formData.maxUsers} onChange={e => handleChange("maxUsers", Number(e.target.value))} className="h-11 bg-muted/30" />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Storage Quota (GB)</Label>
                  <Input type="number" min={1} value={formData.maxStorage} onChange={e => handleChange("maxStorage", Number(e.target.value))} className="h-11 bg-muted/30" />
                </div>
                <div className="space-y-2.5 sm:col-span-2">
                  <Label className="text-sm font-semibold">API Rate Limits (req / min)</Label>
                  <Input type="number" min={100} value={formData.apiLimits} onChange={e => handleChange("apiLimits", Number(e.target.value))} className="h-11 bg-muted/30" />
                </div>
              </div>

              <div className="border border-border/60 rounded-xl p-5 bg-card mt-2 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label className="text-base font-bold">Advanced Analytics</Label>
                    <p className="text-sm text-muted-foreground">Allow access to predictive revenue modeling and custom reports.</p>
                  </div>
                  <Switch checked={formData.analyticsEnabled} onCheckedChange={c => handleChange("analyticsEnabled", c)} />
                </div>
              </div>
            </TabsContent>
          </div>

          <div className="p-6 bg-muted/30 border-t border-border/50 flex items-center justify-between mt-auto">
            <Button 
              variant="outline" 
              onClick={() => handleBack(activeTab)} 
              disabled={activeTab === "identity"}
              className="px-6 h-11 font-semibold hover:bg-background"
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            
            {activeTab === "limits" ? (
              <Button onClick={handleSubmit} className="px-8 h-11 font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                Complete Onboarding
              </Button>
            ) : (
              <Button onClick={() => handleNext(activeTab)} className="px-8 h-11 font-bold shadow-md">
                Continue <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

