"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core"
import { BoardColumn } from "@/components/board/board-column"
import { TaskDetailsModal } from "@/components/board/task-details-modal"
import { ColumnManager } from "@/components/board/column-manager"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useBoardStore } from "@/store/use-board-store"
import { useTaskStore } from "@/store/use-task-store"
import { useProjectStore } from "@/store/use-project-store"
import { useRouter } from "next/navigation"

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  tags: string[]
  assignee?: {
    id: string
    name: string
    avatar: string
  }
}

const teamMembers = [
  { id: "1", name: "John Doe", avatar: "/avatars/01.png" },
  { id: "2", name: "Jane Smith", avatar: "/avatars/02.png" },
  { id: "3", name: "Bob Johnson", avatar: "/avatars/03.png" },
]

const labels = [
  "Bug",
  "Feature",
  "Documentation",
  "Backend",
  "Frontend",
  "UI/UX",
  "High Priority",
]

export default function BoardPage() {
  const router = useRouter()
  const projectId = useProjectStore((state) => state.currentProjectId)
  
  // Subscribe to store updates
  const board = useBoardStore(
    useCallback(
      (state) => (projectId ? state.getBoardByProjectId(projectId) : { columns: [] }),
      [projectId]
    )
  )

  const tasks = useTaskStore(
    useCallback(
      (state) => (projectId ? state.getTasksByProjectId(projectId) : []),
      [projectId]
    )
  )

  const moveTask = useBoardStore((state) => state.moveTask)
  const addTask = useBoardStore((state) => state.addTask)
  const updateTask = useTaskStore((state) => state.updateTask)

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    tags: [] as string[],
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  useEffect(() => {
    if (!projectId) {
      return
    }
  }, [projectId])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || !projectId) return

    const taskId = active.id as string
    const overId = over.id as string

    const targetColumn = board.columns.find((col) => col.id === overId) ||
                        board.columns.find((col) => col.taskIds.includes(overId))
    
    if (!targetColumn) return

    const sourceColumn = board.columns.find((col) => 
      col.taskIds.includes(taskId)
    )

    if (!sourceColumn || sourceColumn.id === targetColumn.id) return

    moveTask(projectId, sourceColumn.id, targetColumn.id, taskId)
  }, [projectId, board.columns, moveTask])

  const handleAddTask = useCallback(() => {
    if (!projectId || !newTask.title.trim()) return

    addTask(projectId, "todo", {
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      priority: newTask.priority,
      tags: newTask.tags,
    })

    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      tags: [],
    })
    setIsNewTaskDialogOpen(false)
  }, [projectId, newTask, addTask])

  const handleUpdateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    if (!projectId) return
    updateTask(projectId, taskId, updates)
  }, [projectId, updateTask])

  // Memoize columns data
  const columnsWithTasks = useMemo(() => {
    return board.columns.map(column => ({
      ...column,
      tasks: column.taskIds
        .map(id => tasks.find(t => t.id === id))
        .filter((t): t is Task => t !== undefined)
    }))
  }, [board.columns, tasks])

  if (!projectId) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">No Project Selected</h2>
          <p className="text-muted-foreground">Please select a project from the dropdown above.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Board</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: "low" | "medium" | "high") =>
                      setNewTask({ ...newTask, priority: value })
                    }
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
              <div className="flex justify-end">
                <Button onClick={handleAddTask}>Add Task</Button>
              </div>
            </DialogContent>
          </Dialog>
          <ColumnManager />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
        >
          {columnsWithTasks.map((column) => (
            <BoardColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={column.tasks}
              onTaskClick={setSelectedTask}
            />
          ))}
        </DndContext>
      </div>
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updates) => handleUpdateTask(selectedTask.id, updates)}
          teamMembers={teamMembers}
          availableLabels={labels}
        />
      )}
    </div>
  )
}
