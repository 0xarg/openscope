"use client";

import type React from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  FolderGit2,
  BookmarkCheck,
  UserCircle,
  Settings2,
  Twitter,
  Github,
  Mail,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Lightbulb,
  MessageSquarePlus,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

const generalNav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Repositories", href: "/repositories", icon: FolderGit2 },
  { name: "Tracked", href: "/tracked", icon: BookmarkCheck },
];

const accountNav = [
  { name: "Profile", href: "/profile", icon: UserCircle },
  { name: "Settings", href: "/settings", icon: Settings2 },
];

const feedbackNav = [
  { name: "Suggest Feature", href: "#", icon: Lightbulb },
  { name: "Give Feedback", href: "#", icon: MessageSquarePlus },
];

const socialNav = [
  { name: "Twitter", href: "https://x.com/0x_anurag", icon: Twitter },
  { name: "GitHub", href: "https://github.com/0xarg/openscope", icon: Github },
  {
    name: "Email",
    href: "#",
    icon: Mail,
  },
];

interface AppSidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export function AppSidebar({ collapsed = false, onCollapse }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { toast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    signOut();
  };

  const NavLinkComponent = ({
    item,
    active,
    showText = true,
  }: {
    item: (typeof generalNav)[0];
    active: boolean;
    showText?: boolean;
  }) => (
    <Link
      href={item.href}
      onClick={() => setMobileOpen(false)}
      target="blank"
      className={cn(
        "flex items-center gap-3 rounded-lg text-sm transition-all duration-200",
        showText ? "px-3 py-2.5" : "p-2.5 justify-center",
        active
          ? "bg-accent text-accent-foreground font-medium"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {showText && <span className="truncate">{item.name}</span>}
    </Link>
  );

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-background/95 backdrop-blur-lg border-b border-border flex items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-1">
          <span className="brand-text">Open</span>
          <span className="brand-text brand-text-accent">Scope</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={cn(
            "relative p-2.5 rounded-xl border transition-all duration-300",
            mobileOpen
              ? "bg-accent text-accent-foreground border-accent shadow-lg shadow-accent/20"
              : "bg-card border-border hover:border-accent/50 hover:shadow-md"
          )}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {mobileOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="relative w-5 h-5 flex flex-col items-center justify-center gap-1"
              >
                <span className="h-0.5 w-5 bg-current rounded-full" />
                <span className="h-0.5 w-3 bg-current rounded-full" />
                <span className="h-0.5 w-5 bg-current rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </header>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            className="lg:hidden fixed top-14 left-0 z-50 h-[calc(100vh-3.5rem)] w-72 bg-sidebar border-r border-sidebar-border flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
              <div>
                <p className="px-3 mb-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  General
                </p>
                <div className="space-y-1">
                  {generalNav.map((item) => (
                    <NavLinkComponent
                      key={item.name}
                      item={item}
                      active={pathname === item.href}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="px-3 mb-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Account
                </p>
                <div className="space-y-1">
                  {accountNav.map((item) => (
                    <NavLinkComponent
                      key={item.name}
                      item={item}
                      active={pathname === item.href}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="px-3 mb-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Feedback
                </p>
                <div className="space-y-1">
                  {feedbackNav.map((item) => (
                    <NavLinkComponent
                      key={item.name}
                      item={item}
                      active={false}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="px-3 mb-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Social
                </p>
                <div className="space-y-1">
                  {socialNav.map((item) => (
                    <NavLinkComponent
                      key={item.name}
                      item={item}
                      active={false}
                    />
                  ))}
                </div>
              </div>
            </nav>
            <div className="p-3 border-t border-sidebar-border space-y-1 shrink-0">
              <button
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="h-4 w-4 shrink-0" />
                ) : (
                  <Moon className="h-4 w-4 shrink-0" />
                )}
                <span>Toggle theme</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Sign Out</span>
              </button>
              <p className="px-3 pt-2 text-[10px] text-muted-foreground">
                OpenScope v0.1.0
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border flex-col transition-all duration-300 overflow-hidden",
          collapsed ? "w-16" : "w-56"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "h-14 flex items-center border-b border-sidebar-border shrink-0 overflow-hidden",
            collapsed ? "justify-center px-2" : "justify-between px-4"
          )}
        >
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
              >
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1 whitespace-nowrap"
                >
                  <span className="brand-text">Open</span>
                  <span className="brand-text brand-text-accent">Scope</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => onCollapse?.(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors shrink-0"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 text-sidebar-foreground" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-sidebar-foreground" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav
          className={cn(
            "flex-1 overflow-y-auto py-4 space-y-6 overflow-x-hidden",
            collapsed ? "px-2" : "px-3"
          )}
        >
          <div>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                General
              </p>
            )}
            <div className="space-y-1">
              {generalNav.map((item) => (
                <NavLinkComponent
                  key={item.name}
                  item={item}
                  active={pathname === item.href}
                  showText={!collapsed}
                />
              ))}
            </div>
          </div>
          <div>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                Account
              </p>
            )}
            <div className="space-y-1">
              {accountNav.map((item) => (
                <NavLinkComponent
                  key={item.name}
                  item={item}
                  active={pathname === item.href}
                  showText={!collapsed}
                />
              ))}
            </div>
          </div>
          <div>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                Feedback
              </p>
            )}
            <div className="space-y-1">
              {feedbackNav.map((item) => (
                <NavLinkComponent
                  key={item.name}
                  item={item}
                  active={false}
                  showText={!collapsed}
                />
              ))}
            </div>
          </div>
          <div>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                Social
              </p>
            )}
            <div className="space-y-1">
              {socialNav.map((item) => (
                <NavLinkComponent
                  key={item.name}
                  item={item}
                  active={false}
                  showText={!collapsed}
                />
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div
          className={cn(
            "p-3 border-t border-sidebar-border space-y-1 shrink-0 overflow-hidden",
            collapsed && "px-2"
          )}
        >
          <button
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className={cn(
              "flex items-center gap-3 w-full rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
              collapsed ? "p-2.5 justify-center" : "px-3 py-2.5"
            )}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4 shrink-0" />
            ) : (
              <Moon className="h-4 w-4 shrink-0" />
            )}
            {!collapsed && (
              <span className="whitespace-nowrap">Toggle theme</span>
            )}
          </button>
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
              collapsed ? "p-2.5 justify-center" : "px-3 py-2.5"
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">Sign Out</span>}
          </button>
          {!collapsed && (
            <p className="px-3 pt-2 text-[10px] text-muted-foreground whitespace-nowrap">
              OpenScope v0.1.0
            </p>
          )}
        </div>
      </aside>
    </>
  );
}

// Layout wrapper component
interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <main
        className={cn(
          "min-h-screen transition-all duration-300 pt-14 lg:pt-0",
          collapsed ? "lg:ml-16" : "lg:ml-56"
        )}
      >
        {children}
      </main>
    </div>
  );
}
