"use client"

import { memo } from "react"
import { useDraggable } from "@dnd-kit/core"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: {
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
  onClick?: () => void
}

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
} as const

function TaskCardComponent({ task, onClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition: 'transform 0ms',
      }
    : undefined

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "cursor-grab active:cursor-grabbing space-y-2 p-3 shadow-sm transition-shadow hover:shadow-md",
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{task.title}</h3>
        <Badge
          variant="secondary"
          className={cn(
            "text-xs font-normal",
            priorityColors[task.priority as keyof typeof priorityColors]
          )}
        >
          {task.priority}
        </Badge>
      </div>
      {task.description && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {task.description}
        </p>
      )}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {task.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {task.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{task.tags.length - 3}
            </Badge>
          )}
        </div>
        {task.assignee && (
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
            <AvatarFallback>
              {task.assignee.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </Card>
  )
}

export const TaskCard = memo(TaskCardComponent)
