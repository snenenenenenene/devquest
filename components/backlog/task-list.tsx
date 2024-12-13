"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTaskStore } from "@/store/use-task-store"
import { MoreVertical, Link2, GripVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TaskDetailsDialog } from "./task-details-dialog"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

interface TaskListProps {
  projectId: string
}

export function TaskList({ projectId }: TaskListProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const tasks = useTaskStore((state) => state.getTasksByProjectId(projectId))
  const updateTask = useTaskStore((state) => state.updateTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const reorderTasks = useTaskStore((state) => state.reorderTasks)

  // Filter out tasks that are already linked to stories
  const unlinkedTasks = tasks.filter((task) => !task.storyId)

  if (unlinkedTasks.length === 0) {
    return null
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    if (sourceIndex === destinationIndex) return

    reorderTasks(projectId, sourceIndex, destinationIndex)
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Unlinked Tasks</h2>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {unlinkedTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center justify-between p-3 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors group ${
                        snapshot.isDragging ? "opacity-50" : ""
                      }`}
                      onClick={() => setSelectedTaskId(task.id)}
                    >
                      <div {...provided.dragHandleProps} className="mr-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-4 flex-1">
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>
                              {task.priority}
                            </Badge>
                            <Badge variant="outline">{task.status}</Badge>
                            {task.tags.map((tag) => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Link2 className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align="end" className="w-60">
                            <div className="space-y-2">
                              <h4 className="font-medium">Link Task</h4>
                              <p className="text-sm text-muted-foreground">
                                You can link this task to a story or GDD element from their respective pages.
                              </p>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                updateTask(projectId, task.id, {
                                  status: task.status === "todo" ? "in-progress" : "todo",
                                })
                              }}
                            >
                              Mark as {task.status === "todo" ? "In Progress" : "Todo"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteTask(projectId, task.id)
                              }}
                              className="text-destructive"
                            >
                              Delete Task
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <TaskDetailsDialog
        taskId={selectedTaskId}
        projectId={projectId}
        open={!!selectedTaskId}
        onOpenChange={(open) => !open && setSelectedTaskId(null)}
      />
    </Card>
  )
}
