"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { type Company } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Building2, CreditCard, Sliders, ChevronLeft, ShieldCheck, Zap, Eye, Calendar, Users, DollarSign, Mail, MapPin, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewCompanyDialogProps {
  company: Company | null;
  onClose: () => void;
}

const statusBadge: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Suspended: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

const planBadge: Record<string, string> = {
  Free: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  Basic: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  Pro: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  Enterprise: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
};

const STEPS = [
  { id: "identity", label: "Identity", icon: Building2 },
  { id: "admin", label: "Admin Setup", icon: ShieldCheck },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "limits", label: "Limits & Features", icon: Sliders },
];

function DataField({ label, value, icon: Icon, valueClassName }: { label: string; value: React.ReactNode; icon?: any; valueClassName?: string }) {
  return (
    <div className="space-y-1.5 p-3 rounded-lg bg-muted/20 border border-border/40">
      <div className="flex items-center gap-2 text-muted-foreground">
        {Icon && <Icon className="w-4 h-4" />}
        <Label className="text-xs font-semibold uppercase tracking-wider">{label}</Label>
      </div>
      <p className={cn("text-sm font-medium", valueClassName || "text-foreground")}>
        {value || <span className="text-muted-foreground italic">Not specified</span>}
      </p>
    </div>
  );
}

export function ViewCompanyDialog({ company, onClose }: ViewCompanyDialogProps) {
  const [activeTab, setActiveTab] = useState("identity");

  useEffect(() => {
    if (company) setActiveTab("identity");
  }, [company]);

  if (!company) return null;

  return (
    <Dialog open={!!company} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-[700px] md:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 sm:rounded-2xl bg-background border-none shadow-2xl shadow-primary/10">
        <div className="bg-gradient-to-b from-muted/50 to-background px-6 pt-6 pb-4 border-b border-border/50">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-inner shadow-primary-foreground/20">
                <Eye className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col items-start gap-1 mt-1">
                <span>{company.name} Details</span>
                <div className="flex items-center gap-2 text-sm font-normal">
                  <Badge className={`text-[10px] border ${statusBadge[company.status]}`}>{company.status}</Badge>
                  <Badge className={`text-[10px] border ${planBadge[company.plan]}`}>{company.plan}</Badge>
                </div>
              </div>
            </DialogTitle>
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
            <TabsContent value="identity" className="grid grid-cols-1 sm:grid-cols-2 gap-4 m-0 h-full data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-2">
              <DataField label="Company Name" value={company.name} icon={Building2} />
              <DataField label="Display Name" value={company.displayName || company.name} icon={Building2} />
              <DataField label="Business Email" value={company.email} icon={Mail} />
              <DataField label="Phone Number" value={company.phone} icon={Phone} />
              <DataField label="Country / Region" value={company.country} icon={MapPin} />
              <DataField label="Joined Platform" value={formatDate(company.joinedAt)} icon={Calendar} />
            </TabsContent>

            <TabsContent value="admin" className="space-y-6 m-0 h-full flex flex-col data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-2">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-5 rounded-xl border border-primary/20 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/10">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">Company Owner Setup</p>
                  <p className="text-sm text-muted-foreground mt-1">This user has full administrative privileges over the tenant environment.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DataField label="Admin Full Name" value={company.adminName || "Jane Doe"} icon={User} />
                <DataField label="Admin Login Email" value={company.adminEmail || company.email} icon={Mail} />
                <div className="sm:col-span-2">
                  <DataField label="Assigned Role" value="Company Owner / Super Admin" icon={ShieldCheck} valueClassName="text-primary font-bold" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="subscription" className="grid grid-cols-1 sm:grid-cols-2 gap-4 m-0 h-full data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-2">
              <DataField label="Plan Tier" value={company.plan} icon={CreditCard} valueClassName="font-bold text-primary" />
              <DataField label="Billing Cycle" value={<span className="capitalize">{company.billingCycle || "Monthly"}</span>} icon={Calendar} />
              <DataField label="Start Date" value={formatDate(company.startDate || company.joinedAt)} icon={Calendar} />
              <DataField label="Expiry Date" value={company.expiryDate ? formatDate(company.expiryDate) : "Never"} icon={Calendar} />
              <div className="sm:col-span-2">
                 <DataField label="Monthly Revenue" value={formatCurrency(company.revenue)} icon={DollarSign} valueClassName="text-emerald-600 dark:text-emerald-400 font-bold" />
              </div>
              {company.isTrial && (
                <div className="sm:col-span-2 bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg flex items-center gap-3">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">This tenant is currently operating in Free Trial mode.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="limits" className="space-y-6 m-0 h-full flex flex-col data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-2">
               <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-center gap-4">
                <Sliders className="w-8 h-8 text-primary flex-shrink-0 p-1.5 bg-primary/10 rounded-lg" />
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  Active quotas and feature flags based on the <span className="font-bold text-primary">{company.plan}</span> plan.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DataField label="Max Users Allowed" value={company.users} icon={Users} />
                <DataField label="Storage Quota" value={`${company.maxStorage || 50} GB`} icon={Building2} />
                <div className="sm:col-span-2">
                   <DataField label="API Rate Limits" value={`${company.apiLimits || 1000} req / min`} icon={Zap} />
                </div>
              </div>
              <div className="border border-border/60 rounded-xl p-5 bg-card mt-2 shadow-sm flex justify-between items-center">
                 <div>
                    <p className="font-bold">Advanced Analytics</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Access to predictive revenue modeling.</p>
                 </div>
                 <Badge variant={company.analyticsEnabled ? "default" : "secondary"}>
                   {company.analyticsEnabled ? "Enabled" : "Disabled"}
                 </Badge>
              </div>
            </TabsContent>
          </div>

          <div className="p-6 bg-muted/30 border-t border-border/50 flex items-center justify-between mt-auto">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="px-6 h-11 font-semibold hover:bg-background"
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Close Details
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
