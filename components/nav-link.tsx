"use client"

import Link, { type LinkProps } from "next/link"
import { usePathname } from "next/navigation"
import { forwardRef, type AnchorHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface NavLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>, LinkProps {
  activeClassName?: string
  pendingClassName?: string
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, pendingClassName, href, children, ...props }, ref) => {
    const pathname = usePathname()
    const isActive = pathname === href

    return (
      <Link ref={ref} href={href} className={cn(className, isActive && activeClassName)} {...props}>
        {children}
      </Link>
    )
  },
)

NavLink.displayName = "NavLink"

export { NavLink }
