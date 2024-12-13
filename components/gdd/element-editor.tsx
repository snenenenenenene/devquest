"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  MoreHorizontal,
  Hash,
  Link2,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  History,
  Users,
  ExternalLink,
  Download,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Editor } from "@tiptap/react"
import Tiptap from "@/components/tiptap"
import { useGDDStore } from "@/store/use-gdd-store"
import { useTaskStore } from "@/store/use-task-store"
import { Task } from "@/types/task"

interface ElementEditorProps {
  projectId: number
  categoryId: string
  elementId: string
  onClose: () => void
}

export function ElementEditor({
  projectId,
  categoryId,
  elementId,
  onClose,
}: ElementEditorProps) {
  const { toast } = useToast()
  const [showLinkTaskDialog, setShowLinkTaskDialog] = useState(false)

  const element = useGDDStore((state) =>
    state.gdds[projectId]?.categories
      .find((cat) => cat.id === categoryId)
      ?.elements.find((el) => el.id === elementId)
  )

  const updateElement = useGDDStore((state) => state.updateElement)
  const addComment = useGDDStore((state) => state.addComment)
  const removeComment = useGDDStore((state) => state.removeComment)
  const linkTask = useGDDStore((state) => state.linkTask)
  const unlinkTask = useGDDStore((state) => state.unlinkTask)
  const addAttachment = useGDDStore((state) => state.addAttachment)
  const removeAttachment = useGDDStore((state) => state.removeAttachment)

  const getTasksByProjectId = useTaskStore((state) => state.getTasksByProjectId)
  const tasks = useMemo(
    () => (projectId ? getTasksByProjectId(projectId.toString()) : []),
    [projectId, getTasksByProjectId]
  )
  const linkToGddElement = useTaskStore((state) => state.linkToGddElement)
  const unlinkFromGddElement = useTaskStore((state) => state.unlinkFromGddElement)

  if (!element) return null

  const handleTitleChange = (newTitle: string) => {
    updateElement(projectId, categoryId, elementId, { title: newTitle }, "user")
  }

  const handleContentChange = (newContent: string) => {
    updateElement(projectId, categoryId, elementId, { content: newContent }, "user")
  }

  const handleAddComment = (content: string) => {
    addComment(projectId, categoryId, elementId, content, "user")
    toast({
      title: "Comment added",
      description: "Your comment has been added to the element",
    })
  }

  const handleRemoveComment = (commentId: string) => {
    removeComment(projectId, categoryId, elementId, commentId)
    toast({
      title: "Comment removed",
      description: "The comment has been removed",
    })
  }

  const handleLinkTask = (taskId: string) => {
    linkTask(projectId, categoryId, elementId, taskId)
    linkToGddElement(taskId, elementId)
    toast({
      title: "Task linked",
      description: "The task has been linked to this element",
    })
  }

  const handleUnlinkTask = (taskId: string) => {
    unlinkTask(projectId, categoryId, elementId, taskId)
    unlinkFromGddElement(taskId)
    toast({
      title: "Task unlinked",
      description: "The task has been unlinked from this element",
    })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none border-b bg-secondary/30">
        <div className="container py-6">
          <div className="space-y-4">
            <div>
              <Input
                value={element.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="text-3xl font-semibold border-none bg-transparent px-0 focus-visible:ring-0"
                placeholder="Untitled section..."
              />
            </div>
            <div className="flex items-center gap-2">
              {element.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="content" className="flex-1">
        <div className="container py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <TabsList className="w-full justify-start gap-4 h-12">
            <TabsTrigger value="content" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Content
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Tasks
            </TabsTrigger>
            <TabsTrigger value="comments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Comments
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              History
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="content" className="flex-1 mt-0">
          <div className="container py-4 h-full">
            <Tiptap
              content={element.content}
              onChange={handleContentChange}
              placeholder="Write your description here..."
              className="h-full"
            />
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="mt-0">
          <div className="container py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Linked Tasks</h3>
                <Button
                  size="sm"
                  onClick={() => setShowLinkTaskDialog(true)}
                >
                  <Link2 className="h-4 w-4 mr-2" />
                  Link Task
                </Button>
              </div>
              <div className="space-y-2">
                {element.linkedTasks.map((taskId) => {
                  const task = tasks.find((t) => t.id === taskId)
                  if (!task) return null
                  return (
                    <Card key={taskId}>
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">
                              {task.title}
                            </CardTitle>
                            <CardDescription>
                              {task.description}
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUnlinkTask(taskId)}
                          >
                            Unlink
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="comments" className="mt-0">
          <div className="container py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Comments</h3>
              </div>
              <div className="space-y-4">
                {element.comments?.map((comment) => (
                  <Card key={comment.id}>
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">
                            {comment.authorId}
                          </CardTitle>
                          <CardDescription>
                            {format(
                              new Date(comment.createdAt),
                              "MMM d, yyyy 'at' h:mm a"
                            )}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveComment(comment.id)}
                        >
                          Delete
                        </Button>
                      </div>
                      <div className="mt-2">{comment.content}</div>
                    </CardHeader>
                  </Card>
                ))}
                <Card>
                  <CardHeader className="p-4">
                    <Tiptap
                      content=""
                      placeholder="Write a comment..."
                      onChange={(content) => {
                        if (content.trim()) {
                          handleAddComment(content)
                        }
                      }}
                    />
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <div className="container py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Version History</h3>
                <Badge variant="secondary">Version {element.version}</Badge>
              </div>
              <div className="space-y-4">
                {element.versionHistory?.map((version) => (
                  <Card key={version.version}>
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">
                            Version {version.version}
                          </CardTitle>
                          <CardDescription>
                            {format(
                              new Date(version.updatedAt),
                              "MMM d, yyyy 'at' h:mm a"
                            )}
                            {" by "}
                            {version.updatedBy}
                          </CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                          Restore
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog
        open={showLinkTaskDialog}
        onOpenChange={setShowLinkTaskDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Task</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[300px]">
            <div className="space-y-2 p-4">
              {tasks
                .filter((task) => !element.linkedTasks.includes(task.id))
                .map((task) => (
                  <Card
                    key={task.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => {
                      handleLinkTask(task.id)
                      setShowLinkTaskDialog(false)
                    }}
                  >
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">{task.title}</CardTitle>
                      <CardDescription>{task.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
