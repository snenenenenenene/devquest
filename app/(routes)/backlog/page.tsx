"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Filter, ArrowUpDown, MoreVertical, ListTodo } from "lucide-react"
import { StoryItem } from "@/components/backlog/story-item"
import { TaskList } from "@/components/backlog/task-list"
import { useBacklogStore } from "@/store/use-backlog-store"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useProjectStore } from "@/store/use-project-store"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { CreateTaskDialog } from "@/components/backlog/create-task-dialog"

export default function BacklogPage() {
  const [newEpic, setNewEpic] = useState({ title: "", description: "" })
  const [newStoryEpicId, setNewStoryEpicId] = useState<number | null>(null)
  const [newStory, setNewStory] = useState({
    title: "",
    points: 0,
    priority: "medium" as const,
    tags: [] as string[],
  })
  const [filter, setFilter] = useState({
    priority: [] as ("high" | "medium" | "low")[],
    tags: [] as string[],
    search: "",
  })
  const [sort, setSort] = useState<{
    field: "title" | "points" | "priority"
    direction: "asc" | "desc"
  }>({
    field: "priority",
    direction: "desc",
  })

  const projectId = useProjectStore((state) => state.currentProjectId)
  const allEpics = useBacklogStore((state) => state.epics)
  const epics = projectId ? (allEpics[projectId] || []) : []
  const addEpic = useBacklogStore((state) => state.addEpic)
  const deleteEpic = useBacklogStore((state) => state.deleteEpic)
  const updateEpic = useBacklogStore((state) => state.updateEpic)
  const addStory = useBacklogStore((state) => state.addStory)
  const updateStory = useBacklogStore((state) => state.updateStory)
  const deleteStory = useBacklogStore((state) => state.deleteStory)
  const moveStory = useBacklogStore((state) => state.moveStory)

  const router = useRouter()

  const [showCreateTask, setShowCreateTask] = useState(false)
  const [showEpicCreateTask, setShowEpicCreateTask] = useState<{ epicId: number } | null>(null)

  const filteredAndSortedEpics = useMemo(() => {
    return epics.map(epic => ({
      ...epic,
      stories: epic.stories
        .filter(story => {
          if (filter.priority.length && !filter.priority.includes(story.priority)) {
            return false
          }
          if (filter.tags.length && !filter.tags.some(tag => story.tags.includes(tag))) {
            return false
          }
          if (filter.search && !story.title.toLowerCase().includes(filter.search.toLowerCase())) {
            return false
          }
          return true
        })
        .sort((a, b) => {
          const getValue = (story: Story) => {
            switch (sort.field) {
              case "title":
                return story.title
              case "points":
                return story.points
              case "priority":
                const priorityOrder = { high: 3, medium: 2, low: 1 }
                return priorityOrder[story.priority]
              default:
                return 0
            }
          }

          const aValue = getValue(a)
          const bValue = getValue(b)

          if (typeof aValue === "string") {
            return sort.direction === "asc"
              ? aValue.localeCompare(bValue as string)
              : (bValue as string).localeCompare(aValue)
          }

          return sort.direction === "asc"
            ? (aValue as number) - (bValue as number)
            : (bValue as number) - (aValue as number)
        }),
    }))
  }, [epics, filter, sort])

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    epics.forEach(epic => {
      epic.stories.forEach(story => {
        story.tags.forEach(tag => tags.add(tag))
      })
    })
    return Array.from(tags)
  }, [epics])

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Product Backlog</h1>
          <p className="text-muted-foreground">Organize and prioritize your game features</p>
        </div>
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-x-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Stories</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <div className="flex gap-2">
                    {["high", "medium", "low"].map((priority) => (
                      <Button
                        key={priority}
                        variant={filter.priority.includes(priority as any) ? "default" : "outline"}
                        onClick={() => {
                          setFilter(prev => ({
                            ...prev,
                            priority: prev.priority.includes(priority as any)
                              ? prev.priority.filter(p => p !== priority)
                              : [...prev.priority, priority as "high" | "medium" | "low"]
                          }))
                        }}
                      >
                        {priority}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <Button
                        key={tag}
                        variant={filter.tags.includes(tag) ? "default" : "outline"}
                        onClick={() => {
                          setFilter(prev => ({
                            ...prev,
                            tags: prev.tags.includes(tag)
                              ? prev.tags.filter(t => t !== tag)
                              : [...prev.tags, tag]
                          }))
                        }}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Search</Label>
                  <Input
                    value={filter.search}
                    onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                    placeholder="Search by title..."
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-x-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sort Stories</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <div className="flex gap-2">
                    {[
                      { value: "priority", label: "Priority" },
                      { value: "points", label: "Points" },
                      { value: "title", label: "Title" },
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant={sort.field === option.value ? "default" : "outline"}
                        onClick={() => {
                          setSort(prev => ({
                            field: option.value as typeof prev.field,
                            direction: prev.field === option.value
                              ? prev.direction === "asc" ? "desc" : "asc"
                              : "desc"
                          }))
                        }}
                      >
                        {option.label}
                        {sort.field === option.value && (
                          <span className="ml-2">
                            {sort.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-x-2">
                <PlusCircle className="h-4 w-4" />
                Add Epic
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Epic</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newEpic.title}
                    onChange={(e) => setNewEpic({ ...newEpic, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEpic.description}
                    onChange={(e) => setNewEpic({ ...newEpic, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => {
                  if (projectId && newEpic.title) {
                    addEpic(projectId, newEpic)
                    setNewEpic({ title: "", description: "" })
                  }
                }}>
                  Add Epic
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button onClick={() => setShowCreateTask(true)}>
            <ListTodo className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowFilters(true)}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Sort by {sort.field}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {[
                  { value: "priority", label: "Priority" },
                  { value: "points", label: "Points" },
                  { value: "title", label: "Title" },
                ].map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => {
                      setSort(prev => ({
                        field: option.value as typeof prev.field,
                        direction: prev.field === option.value
                          ? prev.direction === "asc" ? "desc" : "asc"
                          : "desc"
                      }))
                    }}
                  >
                    {option.label}
                    {sort.field === option.value && (
                      <span className="ml-2">
                        {sort.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {projectId && <TaskList projectId={projectId.toString()} />}

        {filteredAndSortedEpics.map((epic) => (
          <Card key={epic.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">{epic.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEpicCreateTask({ epicId: epic.id })}
                >
                  <ListTodo className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Story
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Story</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="story-title">Title</Label>
                        <Input
                          id="story-title"
                          value={newStory.title}
                          onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="story-points">Story Points</Label>
                        <Input
                          id="story-points"
                          type="number"
                          value={newStory.points}
                          onChange={(e) => setNewStory({ ...newStory, points: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Priority</Label>
                        <div className="flex gap-2">
                          {["high", "medium", "low"].map((priority) => (
                            <Button
                              key={priority}
                              variant={newStory.priority === priority ? "default" : "outline"}
                              onClick={() => setNewStory({ ...newStory, priority: priority as any })}
                            >
                              {priority}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Tags</Label>
                        <Input
                          placeholder="Add tags (comma separated)"
                          value={newStory.tags.join(", ")}
                          onChange={(e) => {
                            const tags = e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
                            setNewStory({ ...newStory, tags })
                          }}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => {
                        if (projectId && newStoryEpicId !== null && newStory.title) {
                          addStory(projectId, newStoryEpicId, newStory)
                          setNewStory({
                            title: "",
                            points: 0,
                            priority: "medium",
                            tags: [],
                          })
                          setNewStoryEpicId(null)
                        }
                      }}>
                        Add Story
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        if (projectId) {
                          deleteEpic(projectId, epic.id)
                        }
                      }}
                      className="text-destructive"
                    >
                      Delete Epic
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{epic.description}</p>
              <div className="space-y-4">
                {epic.stories.map((story) => (
                  <StoryItem
                    key={story.id}
                    story={story}
                    epicId={epic.id}
                    onUpdate={(updates) => {
                      if (projectId) {
                        updateStory(projectId, epic.id, story.id, updates)
                      }
                    }}
                    onDelete={() => {
                      if (projectId) {
                        deleteStory(projectId, epic.id, story.id)
                      }
                    }}
                    onMove={(toEpicId) => {
                      if (projectId) {
                        moveStory(projectId, epic.id, toEpicId, story.id)
                      }
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateTaskDialog
        open={showCreateTask}
        onOpenChange={setShowCreateTask}
        projectId={projectId?.toString() || ""}
      />

      <CreateTaskDialog
        open={!!showEpicCreateTask}
        onOpenChange={(open) => !open && setShowEpicCreateTask(null)}
        projectId={projectId?.toString() || ""}
        epicId={showEpicCreateTask?.epicId}
      />
    </div>
  )
}
