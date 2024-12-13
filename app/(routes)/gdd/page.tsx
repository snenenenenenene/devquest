"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle } from "lucide-react"
import { GDDEditor } from "@/components/gdd/gdd-editor"
import { defaultGDDTemplates, GDDTemplate } from "@/types/gdd"

interface GDD {
  id: string
  name: string
  description: string
  template: GDDTemplate
  lastEdited: Date
  collaborators: number
  progress: {
    completed: number
    total: number
  }
}

export default function GDDPage() {
  const [gdds, setGdds] = useState<GDD[]>([
    {
      id: "1",
      name: "Project X - Main GDD",
      description: "Main design document for Project X",
      template: defaultGDDTemplates[0],
      lastEdited: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      collaborators: 5,
      progress: {
        completed: 12,
        total: 15,
      },
    },
    {
      id: "2",
      name: "Mobile Game Prototype",
      description: "Design document for mobile game prototype",
      template: defaultGDDTemplates[0],
      lastEdited: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      collaborators: 3,
      progress: {
        completed: 8,
        total: 8,
      },
    },
  ])
  const [selectedGDD, setSelectedGDD] = useState<GDD | null>(null)
  const [isNewGDDOpen, setIsNewGDDOpen] = useState(false)
  const [newGDD, setNewGDD] = useState({
    name: "",
    description: "",
    templateId: defaultGDDTemplates[0].id,
  })

  const handleCreateGDD = () => {
    if (!newGDD.name) return

    const template = defaultGDDTemplates.find(
      (t) => t.id === newGDD.templateId
    )
    if (!template) return

    const gdd: GDD = {
      id: Math.random().toString(36).substr(2, 9),
      name: newGDD.name,
      description: newGDD.description,
      template,
      lastEdited: new Date(),
      collaborators: 1,
      progress: {
        completed: 0,
        total: template.categories.reduce(
          (acc, cat) => acc + cat.elements.length,
          0
        ),
      },
    }

    setGdds([...gdds, gdd])
    setNewGDD({
      name: "",
      description: "",
      templateId: defaultGDDTemplates[0].id,
    })
    setIsNewGDDOpen(false)
  }

  if (selectedGDD) {
    return (
      <div className="h-full">
        <div className="border-b">
          <div className="flex h-16 items-center gap-4 px-6">
            <Button
              variant="ghost"
              onClick={() => setSelectedGDD(null)}
            >
              Back to Documents
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">{selectedGDD.name}</h1>
              <p className="text-sm text-muted-foreground">
                Last edited {selectedGDD.lastEdited.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        <GDDEditor template={selectedGDD.template} />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Game Design Documents</h1>
          <p className="text-muted-foreground">
            Create and manage your game design documents
          </p>
        </div>
        <Dialog open={isNewGDDOpen} onOpenChange={setIsNewGDDOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-x-2">
              <PlusCircle className="h-4 w-4" />
              New GDD
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New GDD</DialogTitle>
              <DialogDescription>
                Start a new game design document from a template
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={newGDD.name}
                  onChange={(e) =>
                    setNewGDD((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter GDD name"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={newGDD.description}
                  onChange={(e) =>
                    setNewGDD((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter GDD description"
                />
              </div>
              <Button onClick={handleCreateGDD}>Create GDD</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {defaultGDDTemplates.map((template) => (
          <Card
            key={template.id}
            className="hover:shadow-lg transition cursor-pointer"
            onClick={() => {
              setNewGDD((prev) => ({
                ...prev,
                templateId: template.id,
              }))
              setIsNewGDDOpen(true)
            }}
          >
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {template.categories.length} categories
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Documents</h2>
        <div className="space-y-4">
          {gdds.map((gdd) => (
            <Card
              key={gdd.id}
              className="hover:shadow-lg transition cursor-pointer"
              onClick={() => setSelectedGDD(gdd)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{gdd.name}</CardTitle>
                    <CardDescription>
                      Last edited{" "}
                      {gdd.lastEdited.toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    Open
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {gdd.progress.completed}/{gdd.progress.total}{" "}
                    sections complete
                  </span>
                  <span>Collaborators: {gdd.collaborators}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
