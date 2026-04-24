"use client";

import { useState } from "react";
import {
  Settings, User, Bell, Shield, Palette, Globe,
  Save, Eye, EyeOff, CheckCircle2, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/dashboard/PageHeader";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "platform", label: "Platform", icon: Globe },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPass, setShowPass] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState([
    { id: "n1", label: "New company registration", desc: "Get notified when a new company signs up.", enabled: true },
    { id: "n2", label: "Subscription changes", desc: "Alerts for plan upgrades and cancellations.", enabled: true },
    { id: "n3", label: "Failed payments", desc: "Receive alerts for payment failures.", enabled: true },
    { id: "n4", label: "Weekly revenue report", desc: "Get a weekly summary every Monday.", enabled: false },
    { id: "n5", label: "Security alerts", desc: "Login attempts and suspicious activity.", enabled: true },
  ]);

  const [activeTheme, setActiveTheme] = useState("Light");
  const [accentColor, setAccentColor] = useState("oklch(0.52 0.22 264)");

  const handleSave = (section: string) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success(`${section} settings saved successfully!`);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your account and platform configuration." icon={Settings} />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left border-b border-border last:border-0",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-card border border-border rounded-xl p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-base font-semibold">Profile Information</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-foreground">SA</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Super Admin</p>
                  <p className="text-xs text-muted-foreground">admin@ems.io</p>
                  <Button variant="outline" size="sm" className="mt-2 h-7 text-xs">Change Avatar</Button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">First Name</label>
                  <Input defaultValue="Super" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Last Name</label>
                  <Input defaultValue="Admin" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
                  <Input defaultValue="admin@ems.io" type="email" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Role</label>
                  <div className="flex items-center gap-2 h-9">
                    <Badge className="bg-primary/10 text-primary border border-primary/20">Super Admin</Badge>
                  </div>
                </div>
              </div>
              <Button size="sm" onClick={() => handleSave("Profile")} disabled={isSaving} className="gap-2">
                <Save className="w-3.5 h-3.5" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Notification Preferences</h2>
                <Button size="sm" onClick={() => handleSave("Notification")} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
              {notifPrefs.map((n) => (
                <div key={n.id} className="flex items-start justify-between gap-4 pb-4 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifPrefs(prev => prev.map(p => p.id === n.id ? { ...p, enabled: !p.enabled } : p))}
                    aria-label={`Toggle ${n.label}`}
                    className={cn(
                      "relative w-10 h-5 rounded-full transition-colors flex-shrink-0 mt-0.5",
                      n.enabled ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <span className={cn(
                      "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
                      n.enabled ? "translate-x-5" : "translate-x-0.5"
                    )} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-base font-semibold">Security Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Current Password</label>
                  <div className="relative">
                    <Input type={showPass ? "text" : "password"} placeholder="••••••••" />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPass(!showPass)}>
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">New Password</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Confirm New Password</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </div>
              <div className="border border-border rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                <Button variant="outline" size="sm">Enable 2FA</Button>
              </div>
              <Button size="sm" onClick={() => {
                toast.success("Password updated successfully");
              }} className="gap-2">
                <Save className="w-3.5 h-3.5" />
                Update Password
              </Button>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Appearance</h2>
                <Button size="sm" onClick={() => handleSave("Appearance")} disabled={isSaving}>Save Settings</Button>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-3">Theme</p>
                <div className="grid grid-cols-2 gap-3">
                  {["Light", "Dark"].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setActiveTheme(t);
                        if (t === "Dark") document.documentElement.classList.add("dark");
                        else document.documentElement.classList.remove("dark");
                      }}
                      className={cn(
                        "border rounded-xl p-3 text-sm font-medium text-center transition-colors",
                        activeTheme === t
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/50 text-muted-foreground"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-3">Accent Color</p>
                <div className="flex gap-3">
                  {[
                    "oklch(0.52 0.22 264)",
                    "oklch(0.52 0.22 150)",
                    "oklch(0.62 0.22 30)",
                    "oklch(0.62 0.18 200)",
                    "oklch(0.60 0.22 310)",
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => setAccentColor(color)}
                      aria-label={`Select accent color ${color}`}
                      className={cn("w-8 h-8 rounded-full ring-offset-2 hover:ring-2 ring-offset-background transition-all", accentColor === color && "ring-2 ring-primary")}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "platform" && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold">Platform Configuration</h2>
              {[
                { label: "Platform Name", placeholder: "EMS SaaS", type: "text" },
                { label: "Support Email", placeholder: "support@ems.io", type: "email" },
                { label: "Trial Period (days)", placeholder: "14", type: "number" },
                { label: "Max Companies Per Plan", placeholder: "1000", type: "number" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{field.label}</label>
                  <Input placeholder={field.placeholder} type={field.type} defaultValue={field.placeholder} />
                </div>
              ))}
              <Button size="sm" onClick={() => handleSave("Platform")} disabled={isSaving} className="gap-2">
                <Save className="w-3.5 h-3.5" />
                {isSaving ? "Saving..." : "Save Platform Settings"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
