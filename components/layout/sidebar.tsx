"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useProjectStore } from "@/store/use-project-store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  ListTodo,
  Book,
  Settings,
  Users,
  FileText,
  ChevronRight,
} from "lucide-react"

interface SidebarProps {
  collapsed: boolean
}

export function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname()
  const currentProjectId = useProjectStore((state) => state.currentProjectId)

  const navItems = [
    {
      href: "/board",
      label: "Board",
      icon: LayoutDashboard,
      requiresProject: true,
    },
    {
      href: "/backlog",
      label: "Backlog",
      icon: ListTodo,
      requiresProject: true,
    },
    {
      href: "/gdd",
      label: "GDD",
      icon: Book,
      requiresProject: true,
    },
    {
      href: "/docs",
      label: "Documentation",
      icon: FileText,
      requiresProject: true,
    },
    {
      href: "/team",
      label: "Team",
      icon: Users,
      requiresProject: true,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      requiresProject: false,
    },
  ]

  const filteredNavItems = navItems.filter(
    (item) => !item.requiresProject || currentProjectId
  )

  return (
    <div
      className={cn(
        "border-r bg-background transition-all duration-300 flex flex-col",
        collapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      <div className="flex-1 space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {filteredNavItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  collapsed && "justify-center px-2"
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className={cn("h-5 w-5", !collapsed && "mr-2")} />
                  {!collapsed && item.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 border-t">
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center"
          )}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="Profile" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">John Doe</p>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-16 rounded-full bg-secondary">
                  <div
                    className="h-full w-[75%] rounded-full bg-primary transition-all"
                    style={{ maxWidth: "100%" }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">Lvl 5</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
