"use client"

import type React from "react"
import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { cn } from "@/lib/utils"
import { PageTransition } from "@/components/page-transition"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="bg-background min-h-screen">
      <AppSidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <main
        className={cn("transition-all duration-300 pt-14 lg:pt-0 min-h-screen", collapsed ? "lg:ml-16" : "lg:ml-56")}
      >
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  )
}
