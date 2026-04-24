"use client";

import { useState, useMemo } from "react";
import {
  Building2, Search, Plus, Eye, CheckCircle, Ban, Filter, Grid, List, Pencil, Trash2, MoreHorizontal, MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import PageHeader from "@/components/dashboard/PageHeader";
import { AddCompanyDialog } from "@/components/dashboard/AddCompanyDialog";
import { ViewCompanyDialog } from "@/components/dashboard/ViewCompanyDialog";
import { EditCompanyDialog } from "@/components/dashboard/EditCompanyDialog";
import { companies, type Company } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

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

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const [viewCompany, setViewCompany] = useState<Company | null>(null);
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [confirmAction, setConfirmAction] = useState<{
    type: "delete" | "status";
    companyId: string;
    companyName: string;
    newStatus?: Company["status"];
  } | null>(null);

  const [data, setData] = useState<Company[]>(companies);

  const filtered = useMemo(() => {
    return data.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      const matchPlan = planFilter === "all" || c.plan === planFilter;
      return matchSearch && matchStatus && matchPlan;
    });
  }, [data, search, statusFilter, planFilter]);

  const handleStatusChange = (id: string, newStatus: Company["status"]) => {
    setData((prev) => prev.map((c) => c.id === id ? { ...c, status: newStatus } : c));
    toast.success(`Company status updated to ${newStatus}`);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((c) => c.id !== id));
    toast.error("Company deleted.");
  };

  const handleEditSave = (updated: Company) => {
    setData((prev) => prev.map((c) => c.id === updated.id ? updated : c));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Companies" description="Manage all registered companies on the platform." icon={Building2}>
        <div className="flex items-center gap-2">
          <div className="bg-card border border-border rounded-lg p-1 hidden sm:flex items-center">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2"
              onClick={() => setViewMode("table")}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>
          <Button size="sm" className="gap-2" onClick={() => setAddModalOpen(true)}>
            <Plus className="w-4 h-4" /> Add Company
          </Button>
        </div>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: data.length, color: "text-foreground" },
          { label: "Active", value: data.filter((c) => c.status === "Active").length, color: "text-emerald-500" },
          { label: "Suspended", value: data.filter((c) => c.status === "Suspended").length, color: "text-red-500" },
          { label: "Pending", value: data.filter((c) => c.status === "Pending").length, color: "text-amber-500" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl px-4 py-3">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label} Companies</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-border">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <div className="flex gap-2 items-center overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[120px] sm:w-36 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="h-9 w-[120px] sm:w-36 text-sm">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <div className="sm:hidden flex items-center bg-muted rounded-md p-0.5 ml-auto">
              <Button variant={viewMode === "table" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setViewMode("table")}><List className="w-4 h-4" /></Button>
              <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setViewMode("grid")}><Grid className="w-4 h-4" /></Button>
            </div>
          </div>
          <div className="hidden sm:flex ml-auto text-xs text-muted-foreground items-center">
            {filtered.length} of {data.length} results
          </div>
        </div>

        {/* Data View */}
        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="text-xs font-semibold pl-4">Company</TableHead>
                  <TableHead className="text-xs font-semibold">Plan</TableHead>
                  <TableHead className="text-xs font-semibold hidden sm:table-cell">Users</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-xs font-semibold hidden md:table-cell">Revenue</TableHead>
                  <TableHead className="text-xs font-semibold hidden lg:table-cell">Joined</TableHead>
                  <TableHead className="text-xs font-semibold text-right pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                      No companies found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((company) => (
                    <TableRow key={company.id} className="border-border hover:bg-muted/30 transition-colors group">
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-bold text-primary">{company.logo}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground line-clamp-1">{company.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{company.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] border ${planBadge[company.plan]}`}>{company.plan}</Badge>
                      </TableCell>
                      <TableCell className="text-sm hidden sm:table-cell">{company.users}</TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] border ${statusBadge[company.status]}`}>{company.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium hidden md:table-cell">{formatCurrency(company.revenue)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">{formatDate(company.joinedAt)}</TableCell>
                      <TableCell className="pr-4">
                        <div className="flex items-center justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => setViewCompany(company)}>
                                <Eye className="w-4 h-4 mr-2" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setEditCompany(company)}>
                                <Pencil className="w-4 h-4 mr-2" /> Edit Company
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {company.status !== "Active" && (
                                <DropdownMenuItem onClick={() => setConfirmAction({ type: "status", companyId: company.id, companyName: company.name, newStatus: "Active" })}>
                                  <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Activate
                                </DropdownMenuItem>
                              )}
                              {company.status !== "Suspended" && (
                                <DropdownMenuItem onClick={() => setConfirmAction({ type: "status", companyId: company.id, companyName: company.name, newStatus: "Suspended" })}>
                                  <Ban className="w-4 h-4 mr-2 text-red-500" /> Suspend
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => setConfirmAction({ type: "delete", companyId: company.id, companyName: company.name })} className="text-red-500 focus:text-red-500 focus:bg-red-500/10">
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground text-sm">
                No companies found matching your filters.
              </div>
            ) : filtered.map(company => (
              <div key={company.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all flex flex-col group relative">
                <div className="absolute top-4 right-4 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-background/50 backdrop-blur-sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => setViewCompany(company)}><Eye className="w-4 h-4 mr-2" /> View Details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditCompany(company)}><Pencil className="w-4 h-4 mr-2" /> Edit Company</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {company.status !== "Active" && <DropdownMenuItem onClick={() => setConfirmAction({ type: "status", companyId: company.id, companyName: company.name, newStatus: "Active" })}><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Activate</DropdownMenuItem>}
                      {company.status !== "Suspended" && <DropdownMenuItem onClick={() => setConfirmAction({ type: "status", companyId: company.id, companyName: company.name, newStatus: "Suspended" })}><Ban className="w-4 h-4 mr-2 text-red-500" /> Suspend</DropdownMenuItem>}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setConfirmAction({ type: "delete", companyId: company.id, companyName: company.name })} className="text-red-500 focus:text-red-500 focus:bg-red-500/10"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-primary">{company.logo}</span>
                  </div>
                  <div className="pr-8">
                    <h3 className="font-semibold text-foreground leading-tight line-clamp-1">{company.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{company.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={`text-[10px] border ${planBadge[company.plan]}`}>{company.plan}</Badge>
                  <Badge className={`text-[10px] border ${statusBadge[company.status]}`}>{company.status}</Badge>
                </div>
                <div className="mt-auto grid grid-cols-2 gap-2 text-sm pt-4 border-t border-border/50">
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(company.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Users</p>
                    <p className="font-medium">{company.users}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ViewCompanyDialog company={viewCompany} onClose={() => setViewCompany(null)} />
      <EditCompanyDialog company={editCompany} onClose={() => setEditCompany(null)} onSave={handleEditSave} />

      <AddCompanyDialog
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onAdd={(newCompany) => setData(prev => [newCompany, ...prev])}
      />

      <Dialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {confirmAction?.type === "delete" ? "Delete Company" : "Confirm Status Change"}
            </DialogTitle>
            <DialogDescription className="pt-2">
              {confirmAction?.type === "delete"
                ? `Are you sure you want to permanently delete "${confirmAction.companyName}"? This action cannot be undone and will remove all associated data.`
                : `Are you sure you want to change the status of "${confirmAction?.companyName}" to ${confirmAction?.newStatus}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 sm:justify-end gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setConfirmAction(null)}>Cancel</Button>
            <Button
              variant={confirmAction?.type === "delete" ? "destructive" : "default"}
              onClick={() => {
                if (confirmAction?.type === "delete") {
                  handleDelete(confirmAction.companyId);
                } else if (confirmAction?.type === "status" && confirmAction.newStatus) {
                  handleStatusChange(confirmAction.companyId, confirmAction.newStatus);
                }
                setConfirmAction(null);
              }}
            >
              {confirmAction?.type === "delete" ? "Delete Company" : "Confirm Change"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
