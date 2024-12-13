"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GripVertical, Pencil, Save, X } from "lucide-react"

interface Column {
  id: string
  title: string
  taskIds: string[]
}

interface SortableColumnProps {
  column: Column
  onUpdate: (id: string, title: string) => void
  onDelete: (id: string) => void
}

export function SortableColumn({ column, onUpdate, onDelete }: SortableColumnProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(column.title)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: column.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleSave = () => {
    if (title.trim()) {
      onUpdate(column.id, title.trim())
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setTitle(column.title)
    setIsEditing(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 bg-background p-2 rounded-md border"
    >
      <GripVertical
        className="h-4 w-4 text-muted-foreground cursor-move"
        {...attributes}
        {...listeners}
      />
      {isEditing ? (
        <>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-8 flex-1"
          />
          <Button variant="ghost" size="icon" onClick={handleSave}>
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <span className="flex-1">{column.title}</span>
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(column.id)}>
            <X className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  )
}
