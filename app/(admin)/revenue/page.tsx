"use client";

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { BarChart3, TrendingUp, DollarSign, Users } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import { revenueData, planDistribution, plans } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const COLORS = [
  "oklch(0.52 0.22 264)",
  "oklch(0.62 0.18 200)",
  "oklch(0.68 0.15 160)",
  "oklch(0.72 0.18 80)",
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-sm">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} className="text-muted-foreground">
            {p.name}: <span className="text-foreground font-medium">{formatCurrency(p.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenuePage() {
  const currentMRR = revenueData[revenueData.length - 1].mrr;
  const previousMRR = revenueData[revenueData.length - 2].mrr;
  const mrrGrowth = (((currentMRR - previousMRR) / previousMRR) * 100).toFixed(1);
  const currentARR = revenueData[revenueData.length - 1].arr;
  const totalCustomers = revenueData.reduce((sum, d) => sum + d.newCustomers, 0);
  const totalChurn = revenueData.reduce((sum, d) => sum + d.churn, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Revenue" description="Financial performance and growth metrics." icon={BarChart3} />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: "Current MRR",
            value: formatCurrency(currentMRR),
            sub: `+${mrrGrowth}% vs last month`,
            icon: DollarSign,
            color: "text-violet-500",
            bg: "bg-violet-500/10",
            positive: true,
          },
          {
            label: "Annual Run Rate",
            value: formatCurrency(currentARR),
            sub: "Projected ARR",
            icon: TrendingUp,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            positive: true,
          },
          {
            label: "New Customers",
            value: String(totalCustomers),
            sub: "Last 12 months",
            icon: Users,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            positive: true,
          },
          {
            label: "Churn Rate",
            value: `${((totalChurn / totalCustomers) * 100).toFixed(1)}%`,
            sub: `${totalChurn} lost customers`,
            icon: BarChart3,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            positive: false,
          },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card border border-border rounded-xl p-5">
            <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center mb-3`}>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{kpi.label}</p>
            <p className={`text-xs mt-1 font-medium ${kpi.positive ? "text-emerald-500" : "text-amber-500"}`}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* MRR & ARR Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* MRR Area */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-1">Monthly Recurring Revenue (MRR)</h2>
          <p className="text-xs text-muted-foreground mb-5">Growth over last 12 months</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="mrrG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.52 0.22 264)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.52 0.22 264)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="text-border opacity-40" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} className="text-muted-foreground" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="mrr" stroke="oklch(0.52 0.22 264)" strokeWidth={2} fill="url(#mrrG)" name="MRR" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ARR Bar */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-1">Annual Recurring Revenue (ARR)</h2>
          <p className="text-xs text-muted-foreground mb-5">Projected ARR per month</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="text-border opacity-40" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} className="text-muted-foreground" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="arr" fill="oklch(0.62 0.18 200)" radius={[4, 4, 0, 0]} name="ARR" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Plan Distribution Pie */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-1">Plan Distribution</h2>
          <p className="text-xs text-muted-foreground mb-4">Companies by plan</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={planDistribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {planDistribution.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number, name: string) => [`${v} companies`, name]}
                contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Acquisition vs Churn */}
        <div className="xl:col-span-2 bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-1">Acquisition vs Churn</h2>
          <p className="text-xs text-muted-foreground mb-5">Monthly comparison</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="text-border opacity-40" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="newCustomers" fill="oklch(0.68 0.15 160)" radius={[3, 3, 0, 0]} name="New Customers" />
              <Bar dataKey="churn" fill="oklch(0.64 0.22 30)" radius={[3, 3, 0, 0]} name="Churned" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Plan Revenue Breakdown */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Revenue by Plan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan, i) => {
            const revenue = plan.companies * plan.price;
            const pct = Math.round((plan.companies / 100) * 100);
            return (
              <div key={plan.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{plan.name}</span>
                  <span className="text-sm text-muted-foreground">{plan.companies} co.</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: COLORS[i] }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{pct}% share</span>
                  <span className="font-semibold text-foreground">{formatCurrency(revenue)}/mo</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
