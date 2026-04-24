"use client";

import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import {
  DollarSign, Building2, CreditCard, TrendingUp,
  ShoppingCart, ArrowRight, LayoutDashboard, Activity,
} from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import PageHeader from "@/components/dashboard/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dashboardStats, revenueData, orders, companies, planDistribution } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusColors: Record<string, string> = {
  Paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Failed: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const recentOrders = orders.slice(0, 6);
  const topCompanies = companies.filter((c) => c.status === "Active").slice(0, 5);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back, Super Admin. Here's what's happening today."
        icon={LayoutDashboard}
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg border border-border">
          <Activity className="w-3 h-3 text-emerald-500" />
          <span>All systems operational</span>
        </div>
      </PageHeader>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(dashboardStats.totalRevenue)}
          change={dashboardStats.revenueGrowth}
          icon={DollarSign}
          iconColor="text-violet-500"
          iconBg="bg-violet-500/10"
        />
        <StatCard
          title="Active Companies"
          value={String(dashboardStats.activeCompanies)}
          change={dashboardStats.companiesGrowth}
          icon={Building2}
          iconColor="text-blue-500"
          iconBg="bg-blue-500/10"
        />
        <StatCard
          title="Active Subscriptions"
          value={String(dashboardStats.activeSubscriptions)}
          change={dashboardStats.subscriptionsGrowth}
          icon={CreditCard}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-500/10"
        />
        <StatCard
          title="Monthly Growth"
          value={`${dashboardStats.monthlyGrowth}%`}
          change={dashboardStats.growthChange}
          icon={TrendingUp}
          iconColor="text-orange-500"
          iconBg="bg-orange-500/10"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* MRR Area Chart */}
        <div className="xl:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Monthly Recurring Revenue</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Last 12 months performance</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-foreground">{formatCurrency(128000)}</p>
              <p className="text-xs text-emerald-500 font-semibold mt-0.5">↑ +12.4% vs last month</p>
            </div>
          </div>
          {mounted && (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.52 0.22 264)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="oklch(0.52 0.22 264)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "currentColor" }} className="text-muted-foreground" axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "currentColor" }} className="text-muted-foreground" tickFormatter={(v) => `$${v / 1000}k`} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: number) => [formatCurrency(v), "MRR"]}
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    fontSize: 12,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                  cursor={{ stroke: "oklch(0.52 0.22 264)", strokeWidth: 1, strokeDasharray: "4 4" }}
                />
                <Area type="monotone" dataKey="mrr" stroke="oklch(0.52 0.22 264)" strokeWidth={2.5} fill="url(#mrrGradient)" dot={false} activeDot={{ r: 4, fill: "oklch(0.52 0.22 264)" }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* New Customers */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-foreground">New Customers</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Monthly acquisitions</p>
          </div>
          {mounted && (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border opacity-30" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "currentColor" }} className="text-muted-foreground" axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "currentColor" }} className="text-muted-foreground" axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="newCustomers" fill="oklch(0.62 0.18 200)" radius={[4, 4, 0, 0]} name="New Customers" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Plan Distribution Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {planDistribution.map((plan) => (
          <div key={plan.name} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: plan.fill }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{plan.name}</p>
              <p className="text-sm font-bold text-foreground">{plan.value} <span className="text-xs font-normal text-muted-foreground">companies</span></p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Recent Orders</h2>
              <Badge variant="outline" className="text-[10px] h-4 px-1.5">{orders.length}</Badge>
            </div>
            <Link href="/orders">
              <Button variant="ghost" size="sm" className="text-xs gap-1 h-7 text-muted-foreground hover:text-foreground">
                View all <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{order.company}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.id} · {order.plan}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold">{formatCurrency(order.amount)}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.date)}</p>
                </div>
                <Badge className={`text-[10px] border flex-shrink-0 ${statusColors[order.status]}`}>
                  {order.status}
                </Badge>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-border bg-muted/10">
            <p className="text-xs text-muted-foreground">
              Total collected: <span className="font-semibold text-foreground">{formatCurrency(orders.filter(o => o.status === "Paid").reduce((s, o) => s + o.amount, 0))}</span>
            </p>
          </div>
        </div>

        {/* Top Companies */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Top Companies</h2>
            </div>
            <Link href="/companies">
              <Button variant="ghost" size="sm" className="text-xs gap-1 h-7 text-muted-foreground hover:text-foreground">
                View all <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-border">
            {topCompanies.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/20 transition-colors">
                <span className="text-xs font-bold text-muted-foreground w-4 flex-shrink-0 text-center">{i + 1}</span>
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-primary">{c.logo}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.plan} · {c.users} users</p>
                </div>
                <p className="text-sm font-semibold text-foreground flex-shrink-0">
                  {formatCurrency(c.revenue)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
