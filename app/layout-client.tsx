"use client"

import { useState } from "react"
import { ThemeProvider } from 'next-themes'
import { TagOverlay } from "@/components/tag/tag-overlay"
import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"

export function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex h-screen overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
      <TagOverlay />
    </ThemeProvider>
  )
}
