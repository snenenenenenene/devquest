"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export interface GDDTemplate {
  id: string
  name: string
  description: string
  categories: {
    name: string
    description: string
    defaultElements?: {
      title: string
      content: string
      tags: string[]
    }[]
  }[]
}

const templates: GDDTemplate[] = [
  {
    id: "game-design",
    name: "Game Design Document",
    description: "A comprehensive template for game design documentation",
    categories: [
      {
        name: "Overview",
        description: "High-level game concept and vision",
        defaultElements: [
          {
            title: "Game Concept",
            content: "# Game Concept\n\nDescribe the core concept of your game.",
            tags: ["concept"],
          },
          {
            title: "Target Audience",
            content: "# Target Audience\n\nDefine your target audience and market.",
            tags: ["market"],
          },
        ],
      },
      {
        name: "Gameplay",
        description: "Core mechanics and systems",
        defaultElements: [
          {
            title: "Core Mechanics",
            content: "# Core Mechanics\n\nDescribe the main gameplay mechanics.",
            tags: ["mechanics"],
          },
          {
            title: "Game Flow",
            content: "# Game Flow\n\nExplain the main game loop and progression.",
            tags: ["gameplay"],
          },
        ],
      },
      {
        name: "Technical",
        description: "Technical requirements and specifications",
        defaultElements: [
          {
            title: "System Requirements",
            content: "# System Requirements\n\nList the technical requirements.",
            tags: ["technical"],
          },
        ],
      },
    ],
  },
  {
    id: "narrative-design",
    name: "Narrative Design Document",
    description: "A template focused on story and narrative elements",
    categories: [
      {
        name: "Story",
        description: "Main storyline and narrative elements",
        defaultElements: [
          {
            title: "Story Overview",
            content: "# Story Overview\n\nDescribe the main story arc.",
            tags: ["story"],
          },
          {
            title: "Characters",
            content: "# Characters\n\nList and describe main characters.",
            tags: ["characters"],
          },
        ],
      },
      {
        name: "World Building",
        description: "Setting and world details",
        defaultElements: [
          {
            title: "World Overview",
            content: "# World Overview\n\nDescribe the game world.",
            tags: ["world"],
          },
        ],
      },
    ],
  },
  {
    id: "blank",
    name: "Blank Document",
    description: "Start with a clean slate",
    categories: [],
  },
]

interface TemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectTemplate: (template: GDDTemplate) => void
}

export function TemplateDialog({
  open,
  onOpenChange,
  onSelectTemplate,
}: TemplateDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("game-design")
  const { toast } = useToast()

  const handleConfirm = () => {
    const template = templates.find((t) => t.id === selectedTemplate)
    if (template) {
      onSelectTemplate(template)
      onOpenChange(false)
      toast({
        title: "Template selected",
        description: `Using template: ${template.name}`,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>
            Select a template to start your Game Design Document
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="template">Template</Label>
            <Select
              value={selectedTemplate}
              onValueChange={setSelectedTemplate}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {templates.find((t) => t.id === selectedTemplate)?.description}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Create Document</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
