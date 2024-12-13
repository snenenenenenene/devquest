"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTaskStore } from "@/store/use-task-store"

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  epicId?: number
  storyId?: number
  onTaskCreated?: (taskId: string) => void
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  projectId,
  epicId,
  storyId,
  onTaskCreated,
}: CreateTaskDialogProps) {
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    status: "todo" as const,
    tags: [] as string[],
  })

  const addTask = useTaskStore((state) => state.addTask)
  const linkToStory = useTaskStore((state) => state.linkToStory)

  const handleSubmit = () => {
    const newTask = addTask(projectId, task)
    
    // If epicId and storyId are provided, link the task to the story
    if (epicId && storyId) {
      linkToStory(projectId, newTask.id, epicId, storyId)
    }

    // Reset form
    setTask({
      title: "",
      description: "",
      priority: "medium",
      status: "todo",
      tags: [],
    })

    // Close dialog
    onOpenChange(false)

    // Notify parent
    if (onTaskCreated) {
      onTaskCreated(newTask.id)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              placeholder="Enter task title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              placeholder="Enter task description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={task.priority}
              onValueChange={(value: "low" | "medium" | "high") =>
                setTask({ ...task, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!task.title}>
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
