"use client"

import { useState } from "react"
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { SortableItem } from "./sortable-item"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBoardStore } from "@/store/use-board-store"
import { useProjectStore } from "@/store/use-project-store"

export function ColumnManager() {
  const projectId = useProjectStore((state) => state.currentProjectId)
  const board = useBoardStore((state) =>
    projectId ? state.getBoardByProjectId(projectId) : { columns: [] }
  )
  const addColumn = useBoardStore((state) => state.addColumn)
  const updateColumn = useBoardStore((state) => state.updateColumn)
  const deleteColumn = useBoardStore((state) => state.deleteColumn)
  const reorderColumns = useBoardStore((state) => state.reorderColumns)

  const [isOpen, setIsOpen] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState("")
  const [editingColumn, setEditingColumn] = useState<{
    id: string
    title: string
  } | null>(null)

  const handleAddColumn = () => {
    if (!projectId || !newColumnTitle.trim()) return
    addColumn(projectId, newColumnTitle.trim())
    setNewColumnTitle("")
  }

  const handleUpdateColumn = () => {
    if (!projectId || !editingColumn) return
    updateColumn(projectId, editingColumn.id, editingColumn.title)
    setEditingColumn(null)
  }

  const handleDeleteColumn = (columnId: string) => {
    if (!projectId) return
    deleteColumn(projectId, columnId)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || !projectId) return

    const oldIndex = board.columns.findIndex((col) => col.id === active.id)
    const newIndex = board.columns.findIndex((col) => col.id === over.id)

    if (oldIndex !== newIndex) {
      reorderColumns(projectId, oldIndex, newIndex)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Columns</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Add New Column</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Column title"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddColumn()
                  }
                }}
              />
              <Button onClick={handleAddColumn}>Add</Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Current Columns</Label>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={board.columns.map((col) => col.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {board.columns.map((column) => (
                    <SortableItem
                      key={column.id}
                      id={column.id}
                      className="flex items-center justify-between gap-2 rounded-md border p-2"
                    >
                      {editingColumn?.id === column.id ? (
                        <div className="flex flex-1 items-center gap-2">
                          <Input
                            value={editingColumn.title}
                            onChange={(e) =>
                              setEditingColumn({
                                ...editingColumn,
                                title: e.target.value,
                              })
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleUpdateColumn()
                              }
                              if (e.key === "Escape") {
                                setEditingColumn(null)
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleUpdateColumn}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingColumn(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="flex-1">{column.title}</span>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                setEditingColumn({
                                  id: column.id,
                                  title: column.title,
                                })
                              }
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteColumn(column.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </>
                      )}
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
