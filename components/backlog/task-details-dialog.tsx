"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTaskStore, TaskItem } from "@/store/use-task-store"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface TaskDetailsDialogProps {
  taskId: string | null
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDetailsDialog({
  taskId,
  projectId,
  open,
  onOpenChange,
}: TaskDetailsDialogProps) {
  const tasks = useTaskStore((state) => state.getTasksByProjectId(projectId))
  const updateTask = useTaskStore((state) => state.updateTask)
  const task = tasks.find((t) => t.id === taskId)
  const [editedTask, setEditedTask] = useState<Partial<TaskItem>>({})
  const [newTag, setNewTag] = useState("")

  useEffect(() => {
    if (task) {
      setEditedTask(task)
    }
  }, [task])

  if (!task) return null

  const handleSave = () => {
    updateTask(projectId, task.id, editedTask)
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      const updatedTags = [...(editedTask.tags || []), newTag.trim()]
      setEditedTask({ ...editedTask, tags: updatedTags })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = (editedTask.tags || []).filter((tag) => tag !== tagToRemove)
    setEditedTask({ ...editedTask, tags: updatedTags })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editedTask.title || ""}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              onBlur={handleSave}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editedTask.description || ""}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              onBlur={handleSave}
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={editedTask.status || "todo"}
                onValueChange={(value: "todo" | "in-progress" | "done") => {
                  setEditedTask({ ...editedTask, status: value })
                  updateTask(projectId, task.id, { status: value })
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={editedTask.priority || "medium"}
                onValueChange={(value: "low" | "medium" | "high") => {
                  setEditedTask({ ...editedTask, priority: value })
                  updateTask(projectId, task.id, { priority: value })
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(editedTask.tags || []).map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Add tag (press Enter)"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleAddTag}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
