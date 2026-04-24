"use client";

import { useState, useMemo } from "react";
import {
  ShoppingCart, Search, FileText, RefreshCw, Filter, Download
} from "lucide-react";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import PageHeader from "@/components/dashboard/PageHeader";
import { orders, type Order } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusBadge: Record<string, string> = {
  Paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Failed: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [data, setData] = useState<Order[]>(orders);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!invoiceOrder) return;
    try {
      setIsDownloading(true);
      
      const doc = new jsPDF();
      const margin = 20;
      let y = margin;
      
      // Title
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE", margin, y);
      
      // Invoice Info
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Invoice Number: ${invoiceOrder.invoice}`, margin, y + 10);
      doc.text(`Date: ${formatDate(invoiceOrder.date)}`, margin, y + 15);
      
      // Company Info
      y += 40;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Billed To:", margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(invoiceOrder.company, margin, y + 6);
      
      // Order Details
      y += 30;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Order Details", margin, y);
      
      y += 10;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Order ID: ${invoiceOrder.id}`, margin, y);
      doc.text(`Plan: ${invoiceOrder.plan}`, margin, y + 6);
      doc.text(`Status: ${invoiceOrder.status}`, margin, y + 12);
      
      // Total Amount
      y += 30;
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(`Total Amount: ${formatCurrency(invoiceOrder.amount)}`, margin, y);
      
      // Footer
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text("Thank you for your business!", margin, 280);

      doc.save(`Invoice_${invoiceOrder.invoice}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const filtered = useMemo(() => {
    return data.filter((o) => {
      const matchSearch =
        o.company.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [data, search, statusFilter]);

  const handleRetry = (id: string) => {
    setData((prev) =>
      prev.map((o) => o.id === id ? { ...o, status: "Pending" } : o)
    );
  };

  const totalRevenue = data.filter((o) => o.status === "Paid").reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description="Track all payment orders and invoices." icon={ShoppingCart} />

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Orders", value: data.length, color: "text-foreground" },
          { label: "Paid", value: data.filter((o) => o.status === "Paid").length, color: "text-emerald-500" },
          { label: "Pending", value: data.filter((o) => o.status === "Pending").length, color: "text-amber-500" },
          { label: "Failed", value: data.filter((o) => o.status === "Failed").length, color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl px-4 py-3">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-border">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <div className="flex gap-2 items-center">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-36 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{filtered.length} results</span>
            <span className="text-xs font-semibold text-foreground">
              Total: {formatCurrency(totalRevenue)}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-xs font-semibold pl-4">Order ID</TableHead>
                <TableHead className="text-xs font-semibold">Company</TableHead>
                <TableHead className="text-xs font-semibold">Plan</TableHead>
                <TableHead className="text-xs font-semibold">Amount</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold">Date</TableHead>
                <TableHead className="text-xs font-semibold text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-sm">No orders found.</TableCell>
                </TableRow>
              ) : (
                filtered.map((order) => (
                  <TableRow key={order.id} className="border-border hover:bg-muted/30 transition-colors">
                    <TableCell className="pl-4 text-sm font-mono font-medium text-foreground">{order.id}</TableCell>
                    <TableCell className="text-sm">{order.company}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">{order.plan}</Badge>
                    </TableCell>
                    <TableCell className="text-sm font-semibold">{formatCurrency(order.amount)}</TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] border ${statusBadge[order.status]}`}>{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(order.date)}</TableCell>
                    <TableCell className="pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost" size="sm"
                          className="h-7 text-xs gap-1.5"
                          onClick={() => setInvoiceOrder(order)}
                        >
                          <FileText className="w-3.5 h-3.5" /> Invoice
                        </Button>
                        {order.status === "Failed" && (
                          <Button
                            variant="ghost" size="sm"
                            className="h-7 text-xs gap-1.5 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                            onClick={() => handleRetry(order.id)}
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> Retry
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Invoice Modal */}
      <Dialog open={!!invoiceOrder} onOpenChange={() => setInvoiceOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Invoice {invoiceOrder?.invoice}
            </DialogTitle>
            <DialogDescription>Invoice details and status.</DialogDescription>
          </DialogHeader>
          {invoiceOrder && (
            <div id="invoice-content" className="space-y-4 p-2 bg-card">
              {/* Header */}
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Bill To</p>
                  <p className="text-sm font-semibold mt-0.5">{invoiceOrder.company}</p>
                </div>
                <Badge className={`text-[10px] border ${statusBadge[invoiceOrder.status]}`}>{invoiceOrder.status}</Badge>
              </div>
              {/* Details */}
              <div className="space-y-2.5">
                {[
                  { label: "Order ID", value: invoiceOrder.id },
                  { label: "Invoice #", value: invoiceOrder.invoice },
                  { label: "Plan", value: invoiceOrder.plan },
                  { label: "Issue Date", value: formatDate(invoiceOrder.date) },
                  { label: "Due Date", value: formatDate(invoiceOrder.date) },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 flex justify-between items-center">
                <span className="text-sm font-semibold">Total Amount</span>
                <span className="text-lg font-bold text-primary">{formatCurrency(invoiceOrder.amount)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setInvoiceOrder(null)}>Close</Button>
            <Button size="sm" className="gap-2" onClick={handleDownloadPDF} disabled={isDownloading}>
              {isDownloading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              {isDownloading ? "Generating..." : "Download PDF"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
