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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, Paintbrush, Plus } from "lucide-react"
import { HexColorPicker } from "react-colorful"

export default function ThemesPage() {
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
      onClick={() => setCurrentTheme(theme.id)}
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
          {theme.preview ? (
            <img
              src={theme.preview}
              alt={`${theme.name} preview`}
              className="rounded-md"
            />
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(theme.colors).slice(0, 5).map(([key, value]) => (
                <div
                  key={key}
                  className="h-8 w-8 rounded-full"
                  style={{ backgroundColor: value }}
                  title={key}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Themes</h1>
        <p className="text-muted-foreground">
          Customize your workspace with predefined or custom themes
        </p>
      </div>

      <Tabs defaultValue="predefined">
        <TabsList>
          <TabsTrigger value="predefined">Predefined Themes</TabsTrigger>
          <TabsTrigger value="custom">Custom Themes</TabsTrigger>
        </TabsList>

        <TabsContent value="predefined" className="mt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {predefinedThemes.map(renderThemeCard)}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="mt-6">
          <div className="mb-6 flex justify-end">
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userThemes.map(renderThemeCard)}
            {projectThemes
              .filter((theme) => theme.projectId === currentProjectId)
              .map(renderThemeCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
