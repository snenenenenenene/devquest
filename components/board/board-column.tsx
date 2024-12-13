"use client"

import { useDroppable } from "@dnd-kit/core"
import { TaskCard } from "./task-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface BoardColumnProps {
  id: string
  title: string
  tasks: Array<{
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
  }>
  onTaskClick: (task: BoardColumnProps["tasks"][0]) => void
}

export function BoardColumn({ id, title, tasks, onTaskClick }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        "flex h-full min-h-[500px] flex-col border-2",
        isOver && "border-primary"
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm text-muted-foreground">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
          />
        ))}
      </CardContent>
    </Card>
  )
}
