"use client";

import { Menu, Bell, Search, Sun, Moon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [dark, setDark] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New company registered", desc: "Acme Corp joined the platform.", read: false, time: "2m ago" },
    { id: 2, title: "Payment failed", desc: "TechNova subscription payment failed.", read: false, time: "1h ago" },
    { id: 3, title: "System update", desc: "Platform update v2.0 is live.", read: true, time: "2d ago" },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleTheme = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };
  const markRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    toast.info("Notification marked as read");
  };

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center px-4 gap-4 sticky top-0 z-30">
      {/* Mobile Menu Toggle & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <img src="/LOGO.png" alt="EMS Logo" className="h-8 lg:hidden object-contain" />
      </div>

      {/* Search */}
      <div className="flex-1 max-w-sm relative hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search companies, orders..."
          className="pl-9 h-9 bg-muted/50 border-transparent focus:border-primary/50 text-sm"
        />
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary border-2 border-card rounded-full" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-4 py-2">
              <DropdownMenuLabel className="p-0 text-sm font-semibold">Notifications</DropdownMenuLabel>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-primary hover:underline font-medium">Mark all read</button>
              )}
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
              ) : (
                notifications.map(n => (
                  <DropdownMenuItem 
                    key={n.id} 
                    className={cn("flex flex-col items-start p-4 cursor-pointer gap-1 focus:bg-muted/50", !n.read ? "bg-muted/30" : "")} 
                    onSelect={(e) => {
                      e.preventDefault();
                      if (!n.read) markRead(n.id);
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={cn("text-sm font-medium", !n.read ? "text-foreground" : "text-muted-foreground")}>{n.title}</span>
                      <span className="text-xs text-muted-foreground">{n.time}</span>
                    </div>
                    <span className="text-xs text-muted-foreground line-clamp-1">{n.desc}</span>
                    {!n.read && (
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-primary font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Unread
                      </div>
                    )}
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme}>
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer ml-1">
          <span className="text-xs font-bold text-primary-foreground">SA</span>
        </div>
      </div>
    </header>
  );
}
