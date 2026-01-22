"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  ShoppingCart,
  Users,
  Ticket,
  Warehouse,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/auth-context";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: ShoppingBag },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Coupons", href: "/admin/coupons", icon: Ticket },
  { name: "Inventory", href: "/admin/inventory", icon: Warehouse },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const NavLinks = ({ className, onClick }: { className?: string; onClick?: () => void }) => (
    <nav className={cn("flex flex-col gap-2 px-2", className)}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 group",
              isActive
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 transition-colors",
              isActive ? "text-primary-foreground" : "group-hover:text-gold"
            )} />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        );
      })}

      {/* Super Admin Section */}
      {user?.role === "SUPER_ADMIN" && (
        <div className="mt-4 pt-4 border-t border-gold/10">
          {!isCollapsed && <p className="px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-gold opacity-50">Privileged</p>}
          <Link
            href="/admin/users"
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 group",
              pathname === "/admin/users"
                ? "bg-gold text-white shadow-md"
                : "text-muted-foreground hover:bg-gold/5 hover:text-gold"
            )}
          >
            <ShieldCheck className={cn(
              "h-5 w-5 transition-colors",
              pathname === "/admin/users" ? "text-white" : "group-hover:text-gold"
            )} />
            {!isCollapsed && <span>Admin Control</span>}
          </Link>
        </div>
      )}
    </nav>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-white/80 backdrop-blur-md border-gold/20 shadow-sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-cream p-0 border-r-gold/10">
            <div className="flex flex-col h-full py-6">
              <div className="px-6 mb-8">
                <h1 className="text-2xl font-bold tracking-tighter text-foreground">
                  RYANELLA<span className="text-gold">.</span>
                </h1>
                <p className="text-xs text-muted-foreground">Admin Dashboard</p>
              </div>
              <NavLinks className="flex-1" />
              <div className="px-4 mt-auto">
                <Button
                  onClick={logout}
                  variant="ghost"
                  className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-gold/10 transition-all duration-300 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex flex-col h-full py-6">
          <div className={cn(
            "px-6 mb-10 transition-all duration-300",
            isCollapsed && "px-4 items-center"
          )}>
            {!isCollapsed ? (
              <>
                <h1 className="text-2xl font-bold tracking-tighter text-foreground leading-none">
                  RYANELLA<span className="text-gold">.</span>
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Management</p>
              </>
            ) : (
              <div className="h-10 w-10 bg-primary text-primary-foreground flex items-center justify-center rounded-xl font-bold text-xl">
                R
              </div>
            )}
          </div>

          <NavLinks className="flex-1" />

          <div className="px-4 mt-auto flex flex-col gap-2">
            <Button
              onClick={logout}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200",
                isCollapsed && "px-0 justify-center"
              )}
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span>Logout</span>}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="self-end text-muted-foreground hover:text-gold"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
