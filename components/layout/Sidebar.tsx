"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  ShoppingCart,
  Layers,
  BarChart3,
  Settings,
  Zap,
  X,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Companies", href: "/companies", icon: Building2 },
  { label: "Subscriptions", href: "/subscriptions", icon: CreditCard },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Plans", href: "/plans", icon: Layers },
  { label: "Revenue", href: "/revenue", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 flex flex-col bg-sidebar border-r border-sidebar-border",
          "transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-sidebar-border flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <img src="/LOGO.png" alt="EMS Logo" className="h-8 w-auto object-contain" />
            <div>
              <span className="text-sidebar-foreground font-bold text-base leading-none">EMS</span>
              <p className="text-[10px] text-sidebar-foreground/50 leading-none mt-0.5">Super Admin</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors p-1 rounded-md hover:bg-sidebar-accent"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30">
            Main Menu
          </p>
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                      active
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-primary-foreground" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground")} />
                      {item.label}
                    </span>
                    {active && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border flex-shrink-0 space-y-2">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
              <span className="text-xs font-bold text-primary">SA</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-sidebar-foreground truncate">Super Admin</p>
              <p className="text-[10px] text-sidebar-foreground/40 truncate">admin@ems.com</p>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sidebar-foreground/60 hover:text-red-500 hover:bg-red-500/5 transition-all duration-200 text-left"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs font-medium">Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
