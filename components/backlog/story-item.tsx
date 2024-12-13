"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ClickableTag } from "@/components/tag/clickable-tag"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Link2, FileText, Layout, MoreVertical, ExternalLink, Trash2, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useBacklogStore } from "@/store/use-backlog-store"
import { useProjectStore } from "@/store/use-project-store"
import type { Story } from "@/store/use-backlog-store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface StoryItemProps {
  story: Story
  epicId: number
  onUpdate: (updates: Partial<Omit<Story, "id" | "taskIds" | "gddElementIds">>) => void
  onDelete: () => void
  onMove: (toEpicId: number) => void
}

export function StoryItem({ story, epicId, onUpdate, onDelete, onMove }: StoryItemProps) {
  const [showConnections, setShowConnections] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedStory, setEditedStory] = useState(story)

  const projectId = useProjectStore((state) => state.currentProjectId)
  const allEpics = useBacklogStore((state) => projectId ? state.epics[projectId] || [] : [])

  return (
    <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors group">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <Input
              value={editedStory.title}
              onChange={(e) => setEditedStory({ ...editedStory, title: e.target.value })}
              onBlur={() => {
                onUpdate(editedStory)
                setIsEditing(false)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onUpdate(editedStory)
                  setIsEditing(false)
                }
              }}
              autoFocus
            />
          ) : (
            <h3 className="font-medium" onDoubleClick={() => setIsEditing(true)}>{story.title}</h3>
          )}
          <Popover open={showConnections} onOpenChange={setShowConnections}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Link2 className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <Layout className="h-4 w-4" />
                    Board Tasks
                  </h4>
                  {story.taskIds?.length ? (
                    <div className="space-y-2">
                      {story.taskIds.map((taskId) => (
                        <div
                          key={taskId}
                          className="flex items-center justify-between p-2 text-sm bg-secondary/20 rounded group/task"
                        >
                          <Link
                            href={`/board?task=${taskId}`}
                            className="flex-1 hover:underline"
                          >
                            {taskId}
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover/task:opacity-100 transition-opacity"
                            onClick={() => onUpdate({ taskIds: story.taskIds.filter(id => id !== taskId) })}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No tasks linked yet</p>
                  )}
                  <Button variant="ghost" size="sm" className="mt-2 w-full">
                    <Link href={`/board?story=${story.id}`} className="flex items-center gap-2">
                      Create Task
                    </Link>
                  </Button>
                </div>
                <div>
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4" />
                    GDD Elements
                  </h4>
                  {story.gddElementIds?.length ? (
                    <div className="space-y-2">
                      {story.gddElementIds.map((elementId) => (
                        <div
                          key={elementId}
                          className="flex items-center justify-between p-2 text-sm bg-secondary/20 rounded group/element"
                        >
                          <Link
                            href={`/gdd?element=${elementId}`}
                            className="flex-1 hover:underline"
                          >
                            {elementId}
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover/element:opacity-100 transition-opacity"
                            onClick={() => onUpdate({ gddElementIds: story.gddElementIds.filter(id => id !== elementId) })}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No GDD elements linked yet</p>
                  )}
                  <Button variant="ghost" size="sm" className="mt-2 w-full">
                    <Link href={`/gdd?story=${story.id}`} className="flex items-center gap-2">
                      Link GDD Element
                    </Link>
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <Label>Points:</Label>
            <Input
              type="number"
              value={story.points}
              onChange={(e) => onUpdate({ points: parseInt(e.target.value) || 0 })}
              className="w-16"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label>Priority:</Label>
            <select
              value={story.priority}
              onChange={(e) => onUpdate({ priority: e.target.value as "high" | "medium" | "low" })}
              className="rounded-md border border-input bg-background px-3 py-1"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Label>Tags:</Label>
            <Input
              value={story.tags.join(", ")}
              onChange={(e) => {
                const tags = e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
                onUpdate({ tags })
              }}
              placeholder="Add tags..."
              className="w-48"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              Edit Title
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex items-center justify-between w-full">
                Move to Epic
                <ChevronRight className="h-4 w-4" />
              </div>
              <DropdownMenuContent side="right">
                {allEpics
                  .filter(epic => epic.id !== epicId)
                  .map(epic => (
                    <DropdownMenuItem key={epic.id} onClick={() => onMove(epic.id)}>
                      {epic.title}
                    </DropdownMenuItem>
                  ))
                }
              </DropdownMenuContent>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              Delete Story
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
