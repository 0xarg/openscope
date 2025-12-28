"use client";

import {
  LayoutDashboard,
  FolderGit2,
  Bookmark,
  Compass,
  User,
  Settings,
} from "lucide-react";
import type React from "react";
import { cn } from "@/lib/utils";
import { AppSidebar } from "./AppSidebar";
import { useState } from "react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Repositories", icon: FolderGit2, href: "/repositories" },
  { label: "Tracked Issues", icon: Bookmark, href: "/issues/tracked" },
  { label: "Explore", icon: Compass, href: "/dashboard" },
];

const bottomNavItems = [
  { label: "Profile", icon: User, href: "/profile" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
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
