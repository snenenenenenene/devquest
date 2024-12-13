"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useThemeStore } from "@/store/use-theme-store"
import { useProjectStore } from "@/store/use-project-store"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ThemeContextType {
  theme: string | null
  setTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function hexToHSL(hex: string) {
  // Remove the hash if it exists
  hex = hex.replace(/^#/, '')

  // Parse the hex values
  const r = parseInt(hex.slice(0, 2), 16) / 255
  const g = parseInt(hex.slice(2, 4), 16) / 255
  const b = parseInt(hex.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    
    h /= 6
  }

  // Convert to degrees and percentages
  h = Math.round(h * 360)
  s = Math.round(s * 100)
  const lPercent = Math.round(l * 100)

  return `${h} ${s}% ${lPercent}%`
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [showPreferenceDialog, setShowPreferenceDialog] = useState(false)
  const currentProjectId = useProjectStore((state) => state.currentProjectId)
  const {
    predefinedThemes,
    userThemes,
    projectThemes,
    currentTheme,
    userPreference,
    setCurrentTheme,
    setUserPreference,
  } = useThemeStore()

  // Find the current project's theme if it exists
  const projectTheme = projectThemes.find(
    (theme) => theme.projectId === currentProjectId
  )

  // Find a user theme if it exists
  const userTheme = userThemes[0] // For now, just use the first user theme

  useEffect(() => {
    // If there's both a project theme and a user theme, and no preference is set
    if (projectTheme && userTheme && !userPreference && currentProjectId) {
      setShowPreferenceDialog(true)
    }
  }, [projectTheme, userTheme, userPreference, currentProjectId])

  useEffect(() => {
    const allThemes = [...predefinedThemes, ...userThemes, ...projectThemes]
    const theme = allThemes.find((t) => t.id === currentTheme)

    if (theme) {
      const root = document.documentElement
      Object.entries(theme.colors).forEach(([key, value]) => {
        const hsl = hexToHSL(value)
        root.style.setProperty(`--${key}`, hsl)
      })
    }
  }, [predefinedThemes, userThemes, projectThemes, currentTheme])

  const handlePreferenceSelection = (preference: "user" | "project") => {
    setUserPreference(preference)
    setCurrentTheme(preference === "user" ? userTheme.id : projectTheme.id)
    setShowPreferenceDialog(false)
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        setTheme: setCurrentTheme,
      }}
    >
      {showPreferenceDialog && projectTheme && userTheme && (
        <Dialog open={true} onOpenChange={setShowPreferenceDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Choose Your Theme Preference</DialogTitle>
              <DialogDescription>
                Both your personal theme and the project theme are available.
                Which would you like to use?
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handlePreferenceSelection("user")}
              >
                Use My Theme
                <span className="ml-2 text-xs text-muted-foreground">
                  ({userTheme.name})
                </span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handlePreferenceSelection("project")}
              >
                Use Project Theme
                <span className="ml-2 text-xs text-muted-foreground">
                  ({projectTheme.name})
                </span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
