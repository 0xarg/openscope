# Components Folder Structure

This folder contains all reusable UI components for the Next.js project, converted from Lovable to work with Next.js App Router.

## 📁 Folder Structure

```
components/
├── devlens/               # DevLens-specific components
│   ├── app-sidebar.tsx    # Main sidebar with navigation
│   └── app-header.tsx     # Header with navigation and user menu
├── ui/                    # shadcn/ui components
│   ├── accordion.tsx
│   ├── alert-dialog.tsx
│   ├── alert.tsx
│   ├── aspect-ratio.tsx
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── breadcrumb.tsx
│   ├── button.tsx
│   ├── calendar.tsx
│   ├── card.tsx
│   ├── carousel.tsx
│   ├── chart.tsx
│   ├── checkbox.tsx
│   ├── collapsible.tsx
│   ├── command.tsx
│   ├── context-menu.tsx
│   ├── dialog.tsx
│   ├── drawer.tsx
│   ├── dropdown-menu.tsx
│   ├── form.tsx
│   ├── hover-card.tsx
│   ├── input-otp.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── menubar.tsx
│   ├── navigation-menu.tsx
│   ├── pagination.tsx
│   ├── popover.tsx
│   ├── progress.tsx
│   ├── radio-group.tsx
│   ├── resizable.tsx
│   ├── scroll-area.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── sheet.tsx
│   ├── sidebar.tsx
│   ├── skeleton.tsx
│   ├── slider.tsx
│   ├── sonner.tsx
│   ├── switch.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   ├── textarea.tsx
│   ├── toast.tsx
│   ├── toaster.tsx
│   ├── toggle-group.tsx
│   ├── toggle.tsx
│   └── tooltip.tsx
├── nav-link.tsx           # Next.js Link with active state
├── page-loader.tsx        # Loading spinner components
├── page-transition.tsx    # Page transition animations
└── theme-provider.tsx     # next-themes provider wrapper
```

## 🔧 Key Conversions from Lovable

### 1. **Routing**
- ❌ React Router (`react-router-dom`)
- ✅ Next.js routing (`next/link`, `usePathname`, `useRouter`)

### 2. **Client Components**
All components using hooks or browser APIs have `"use client"` directive:
- `app-sidebar.tsx`
- `app-header.tsx`
- `page-loader.tsx`
- `page-transition.tsx`
- `nav-link.tsx`
- `theme-provider.tsx`

### 3. **Theme Management**
- Uses `next-themes` package (already in dependencies)
- Import: `import { useTheme } from "next-themes"`
- Available via `hooks/useTheme.ts` re-export for compatibility

### 4. **Animations**
- Uses `framer-motion` for smooth transitions
- Already included in `package.json`

## 📦 Usage Examples

### Using the Sidebar Layout

```tsx
import { AppLayout } from "@/components/devlens/app-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>
}
```

### Using the Header

```tsx
import { AppHeader } from "@/components/devlens/app-header"

export default function Page() {
  return (
    <>
      <AppHeader />
      <main>{/* Your content */}</main>
    </>
  )
}
```

### Using Page Transitions

```tsx
import { PageTransition } from "@/components/page-transition"

export default function Page() {
  return (
    <PageTransition>
      <div>{/* Your page content */}</div>
    </PageTransition>
  )
}
```

### Using Nav Link

```tsx
import { NavLink } from "@/components/nav-link"

export function Navigation() {
  return (
    <nav>
      <NavLink 
        href="/dashboard" 
        activeClassName="text-primary"
      >
        Dashboard
      </NavLink>
    </nav>
  )
}
```

### Using Page Loaders

```tsx
import { PageLoader, FullPageLoader } from "@/components/page-loader"

// In-page loader
export function MyComponent() {
  if (loading) return <PageLoader />
  return <div>{/* content */}</div>
}

// Full-screen loader
export function App() {
  if (initializing) return <FullPageLoader />
  return <div>{/* app */}</div>
}
```

## 🎨 UI Components

All shadcn/ui components in the `ui/` folder follow the standard shadcn patterns:

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
```

## 🚀 Installation in Your Project

Simply copy the entire `components/` folder to your Next.js project root and ensure you have these dependencies:

```json
{
  "dependencies": {
    "framer-motion": "^11.x.x",
    "next-themes": "^0.x.x",
    "lucide-react": "^0.x.x"
  }
}
```

All components are now Next.js compatible and won't crash!
