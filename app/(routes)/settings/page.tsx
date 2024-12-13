"use client"

import { useState } from "react"
import { useThemeStore } from "@/store/use-theme-store"
import { useProjectStore } from "@/store/use-project-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Check, Paintbrush, Plus, Settings2, User } from "lucide-react"
import { HexColorPicker } from "react-colorful"
import type { ThemeColors } from "@/store/use-theme-store"
import { useTheme } from "next-themes"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Sun, Moon, Monitor } from "lucide-react"

export default function SettingsPage() {
  const [selectedColor, setSelectedColor] = useState<keyof ThemeColors | null>(null)
  const [newTheme, setNewTheme] = useState({
    name: "",
    description: "",
    colors: {
      primary: "#000000",
      secondary: "#000000",
      accent: "#000000",
      background: "#FFFFFF",
      foreground: "#000000",
      muted: "#F5F5F5",
      "muted-foreground": "#737373",
      popover: "#FFFFFF",
      "popover-foreground": "#000000",
      border: "#E5E5E5",
      input: "#FFFFFF",
      card: "#FFFFFF",
      "card-foreground": "#000000",
      destructive: "#FF0000",
      "destructive-foreground": "#FFFFFF",
    },
  })

  const {
    predefinedThemes,
    userThemes,
    projectThemes,
    currentTheme,
    addUserTheme,
    addProjectTheme,
    setCurrentTheme,
  } = useThemeStore()

  const currentProjectId = useProjectStore((state) => state.currentProjectId)

  console.log("All predefined themes:", predefinedThemes)
  console.log("System themes:", predefinedThemes.filter((theme) => theme.category === "system"))

  const handleCreateTheme = (type: "user" | "project") => {
    if (type === "user") {
      addUserTheme({
        ...newTheme,
        category: "custom",
      })
    } else if (type === "project" && currentProjectId) {
      addProjectTheme(currentProjectId, {
        ...newTheme,
        category: "custom",
      })
    }
  }

  const renderThemeCard = (theme: Theme) => (
    <Card
      key={theme.id}
      className={`group relative cursor-pointer transition-all hover:shadow-lg ${
        currentTheme === theme.id ? "ring-2 ring-primary" : ""
      }`}
      onClick={() => {
        setCurrentTheme(theme.id)
        // Also update next-themes when theme changes
        setTheme(theme.id)
      }}
    >
      {currentTheme === theme.id && (
        <div className="absolute right-2 top-2 rounded-full bg-primary p-1">
          <Check className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-lg">{theme.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{theme.description}</p>
          {theme.preview && (
            <img
              src={theme.preview}
              alt={`${theme.name} preview`}
              className="rounded-md"
            />
          )}
        </div>
      </CardContent>
    </Card>
  )

  const { theme, setTheme } = useTheme()

  const themes = [
    {
      name: "Light",
      value: "light",
      icon: Sun,
      description: "Light mode for daytime use",
    },
    {
      name: "Dark",
      value: "dark",
      icon: Moon,
      description: "Dark mode for nighttime use",
    },
    {
      name: "System",
      value: "system",
      icon: Monitor,
      description: "Automatically match system theme",
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your preferences and customizations
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                size="sm"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                size="sm"
              >
                <Settings2 className="mr-2 h-4 w-4" />
                Preferences
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start bg-accent/50"
                size="sm"
              >
                <Paintbrush className="mr-2 h-4 w-4" />
                Themes
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Themes</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Custom Theme
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Custom Theme</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={newTheme.name}
                            onChange={(e) =>
                              setNewTheme((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Input
                            value={newTheme.description}
                            onChange={(e) =>
                              setNewTheme((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <ScrollArea className="h-[300px] rounded-md border p-4">
                          {Object.entries(newTheme.colors).map(([key, value]) => (
                            <div
                              key={key}
                              className="mb-4 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-6 w-6 cursor-pointer rounded-full"
                                  style={{ backgroundColor: value }}
                                  onClick={() => setSelectedColor(key as keyof ThemeColors)}
                                />
                                <span className="text-sm">{key}</span>
                              </div>
                              <Input
                                value={value}
                                className="w-32"
                                onChange={(e) =>
                                  setNewTheme((prev) => ({
                                    ...prev,
                                    colors: {
                                      ...prev.colors,
                                      [key]: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </div>
                          ))}
                        </ScrollArea>
                      </div>
                      <div>
                        {selectedColor && (
                          <div className="space-y-4">
                            <Label>Color Picker</Label>
                            <HexColorPicker
                              color={newTheme.colors[selectedColor]}
                              onChange={(color) =>
                                setNewTheme((prev) => ({
                                  ...prev,
                                  colors: {
                                    ...prev.colors,
                                    [selectedColor]: color,
                                  },
                                }))
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <DialogFooter className="mt-6">
                      <Button
                        variant="outline"
                        onClick={() => handleCreateTheme("user")}
                      >
                        Save as User Theme
                      </Button>
                      {currentProjectId && (
                        <Button onClick={() => handleCreateTheme("project")}>
                          Save as Project Theme
                        </Button>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-medium">Theme</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {predefinedThemes
                      .filter((theme) => ["light", "dark", "system"].includes(theme.id))
                      .sort((a, b) => {
                        const order = { system: 0, light: 1, dark: 2 }
                        return (order[a.id as keyof typeof order] || 3) - (order[b.id as keyof typeof order] || 3)
                      })
                      .map(renderThemeCard)}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium">Game Themes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {predefinedThemes
                      .filter((theme) => theme.category === "game")
                      .map(renderThemeCard)}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-4 text-lg font-medium">Custom Themes</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {userThemes.map(renderThemeCard)}
                    {projectThemes
                      .filter((theme) => theme.projectId === currentProjectId)
                      .map(renderThemeCard)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
