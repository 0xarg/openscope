"use client";

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
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "GitHub", href: "#", icon: Github },
  { name: "Email", href: "#", icon: Mail },
];

interface AppSidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export function AppSidebar({ collapsed = false, onCollapse }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
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
    // router.push("/")
  };

  const NavLink = ({
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
      <header className="bg-background/95 border-border fixed top-0 right-0 left-0 z-50 flex h-14 items-center justify-between border-b px-4 backdrop-blur-lg lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-1">
          <span className="brand-text">Dev</span>
          <span className="brand-text brand-text-accent">Lens</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={cn(
            "relative rounded-xl border p-2.5 transition-all duration-300",
            mobileOpen
              ? "bg-accent text-accent-foreground border-accent shadow-accent/20 shadow-lg"
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
                className="relative flex h-5 w-5 flex-col items-center justify-center gap-1"
              >
                <span className="h-0.5 w-5 rounded-full bg-current" />
                <span className="h-0.5 w-3 rounded-full bg-current" />
                <span className="h-0.5 w-5 rounded-full bg-current" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </header>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="bg-background/80 fixed inset-0 z-40 backdrop-blur-sm lg:hidden"
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
            className="bg-sidebar border-sidebar-border fixed top-14 left-0 z-50 flex h-[calc(100vh-3.5rem)] w-72 flex-col border-r lg:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Navigation */}
            <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
              <div>
                <p className="text-muted-foreground mb-2 px-3 text-[10px] font-medium uppercase tracking-wider">
                  General
                </p>
                <div className="space-y-1">
                  {generalNav.map((item) => (
                    <NavLink
                      key={item.name}
                      item={item}
                      active={pathname === item.href}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-muted-foreground mb-2 px-3 text-[10px] font-medium uppercase tracking-wider">
                  Account
                </p>
                <div className="space-y-1">
                  {accountNav.map((item) => (
                    <NavLink
                      key={item.name}
                      item={item}
                      active={pathname === item.href}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-muted-foreground mb-2 px-3 text-[10px] font-medium uppercase tracking-wider">
                  Feedback
                </p>
                <div className="space-y-1">
                  {feedbackNav.map((item) => (
                    <NavLink key={item.name} item={item} active={false} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-muted-foreground mb-2 px-3 text-[10px] font-medium uppercase tracking-wider">
                  Social
                </p>
                <div className="space-y-1">
                  {socialNav.map((item) => (
                    <NavLink key={item.name} item={item} active={false} />
                  ))}
                </div>
              </div>
            </nav>
            <div className="border-sidebar-border p-3 space-y-1 shrink-0 border-t">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-sidebar-foreground hover:bg-sidebar-accent flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 shrink-0" />
                ) : (
                  <Moon className="h-4 w-4 shrink-0" />
                )}
                <span>Toggle theme</span>
              </button>
              <button
                onClick={handleLogout}
                className="text-sidebar-foreground hover:bg-sidebar-accent flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Sign Out</span>
              </button>
              <p className="text-muted-foreground px-3 pt-2 text-[10px]">
                devlens v0.1.0
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "bg-sidebar border-sidebar-border fixed top-0 left-0 z-40 hidden h-screen flex-col border-r transition-all duration-300 lg:flex overflow-hidden",
          collapsed ? "w-16" : "w-56"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "border-sidebar-border flex h-14 items-center border-b shrink-0 overflow-hidden",
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
                  <span className="brand-text">Dev</span>
                  <span className="brand-text brand-text-accent">Lens</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => onCollapse?.(!collapsed)}
            className="hover:bg-sidebar-accent shrink-0 rounded-lg p-1.5 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="text-sidebar-foreground h-4 w-4" />
            ) : (
              <ChevronLeft className="text-sidebar-foreground h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav
          className={cn(
            "flex-1 space-y-6 overflow-y-auto py-4 overflow-x-hidden",
            collapsed ? "px-2" : "px-3"
          )}
        >
          <div>
            {!collapsed && (
              <p className="text-muted-foreground mb-2 px-3 text-[10px] font-medium uppercase tracking-wider whitespace-nowrap">
                General
              </p>
            )}
            <div className="space-y-1">
              {generalNav.map((item) => (
                <NavLink
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
              <p className="text-muted-foreground mb-2 px-3 text-[10px] font-medium uppercase tracking-wider whitespace-nowrap">
                Account
              </p>
            )}
            <div className="space-y-1">
              {accountNav.map((item) => (
                <NavLink
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
              <p className="text-muted-foreground mb-2 px-3 text-[10px] font-medium uppercase tracking-wider whitespace-nowrap">
                Feedback
              </p>
            )}
            <div className="space-y-1">
              {feedbackNav.map((item) => (
                <NavLink
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
              <p className="text-muted-foreground mb-2 px-3 text-[10px] font-medium uppercase tracking-wider whitespace-nowrap">
                Social
              </p>
            )}
            <div className="space-y-1">
              {socialNav.map((item) => (
                <NavLink
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
            "border-sidebar-border p-3 space-y-1 shrink-0 border-t overflow-hidden",
            collapsed && "px-2"
          )}
        >
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
              "text-sidebar-foreground hover:bg-sidebar-accent flex w-full items-center gap-3 rounded-lg transition-colors",
              collapsed ? "justify-center p-2.5" : "px-3 py-2.5"
            )}
          >
            {theme === "dark" ? (
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
              "text-sidebar-foreground hover:bg-sidebar-accent flex w-full items-center gap-3 rounded-lg transition-colors",
              collapsed ? "justify-center p-2.5" : "px-3 py-2.5"
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">Sign Out</span>}
          </button>
          {!collapsed && (
            <p className="text-muted-foreground px-3 pt-2 text-[10px] whitespace-nowrap">
              devlens v0.1.0
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
