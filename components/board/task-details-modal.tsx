"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertCircle,
  Calendar as CalendarIcon,
  Clock,
  Link,
  MessageSquare,
  Tag,
  User,
  X,
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface TaskDetailsModalProps {
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
    createdAt?: Date
    updatedAt?: Date
    dueDate?: Date
  }
  teamMembers: Array<{
    id: string
    name: string
    avatar: string
  }>
  availableLabels: string[]
  onClose: () => void
  onUpdate: (updates: Partial<TaskDetailsModalProps["task"]>) => void
}

export function TaskDetailsModal({
  task,
  teamMembers,
  availableLabels,
  onClose,
  onUpdate,
}: TaskDetailsModalProps) {
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false)
  const [description, setDescription] = useState(task.description)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    task.dueDate
  )

  const handleDescriptionSave = () => {
    onUpdate({ description })
    setIsDescriptionEditing(false)
  }

  const handleAssigneeChange = (memberId: string) => {
    if (memberId === "unassigned") {
      onUpdate({ assignee: undefined })
    } else {
      const member = teamMembers.find((m) => m.id === memberId)
      onUpdate({ assignee: member })
    }
  }

  const handleTagToggle = (tag: string) => {
    const newTags = task.tags.includes(tag)
      ? task.tags.filter((t) => t !== tag)
      : [...task.tags, tag]
    onUpdate({ tags: newTags })
  }

  const handleDueDateChange = (date: Date | undefined) => {
    setSelectedDate(date)
    onUpdate({ dueDate: date })
  }

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Task-{task.id}</div>
            <DialogTitle className="text-xl font-semibold">
              {task.title}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="font-medium">Description</div>
                    {isDescriptionEditing ? (
                      <div className="space-y-2">
                        <Textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="min-h-[200px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleDescriptionSave}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setDescription(task.description)
                              setIsDescriptionEditing(false)
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="rounded-md border p-3 hover:bg-muted/50"
                        role="button"
                        onClick={() => setIsDescriptionEditing(true)}
                      >
                        {task.description || "Add a description..."}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="font-medium">Comments</div>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Add a comment..."
                        className="min-h-[100px]"
                      />
                      <Button>Comment</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <ScrollArea className="h-[400px]">
                  {/* Example activity items */}
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={teamMembers[0].avatar}
                          alt={teamMembers[0].name}
                        />
                        <AvatarFallback>
                          {teamMembers[0].name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">
                            {teamMembers[0].name}
                          </span>{" "}
                          changed the status to "In Progress"
                        </p>
                        <p className="text-xs text-muted-foreground">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User className="h-4 w-4" />
                Assignee
              </div>
              <Select
                value={task.assignee?.id || "unassigned"}
                onValueChange={handleAssigneeChange}
              >
                <SelectTrigger>
                  <SelectValue>
                    {task.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={task.assignee.avatar}
                            alt={task.assignee.name}
                          />
                          <AvatarFallback>
                            {task.assignee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{task.assignee.name}</span>
                      </div>
                    ) : (
                      "Unassigned"
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={member.avatar}
                            alt={member.name}
                          />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{member.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Tag className="h-4 w-4" />
                Labels
              </div>
              <ScrollArea className="h-[100px]">
                <div className="space-y-2">
                  {availableLabels.map((label) => (
                    <div
                      key={label}
                      className="flex items-center gap-2"
                      role="button"
                      onClick={() => handleTagToggle(label)}
                    >
                      <div
                        className={cn(
                          "h-4 w-4 rounded border",
                          task.tags.includes(label) &&
                            "bg-primary"
                        )}
                      />
                      <span className="text-sm">{label}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                Due Date
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDueDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4" />
                Created
              </div>
              <div className="text-sm">
                {task.createdAt
                  ? format(task.createdAt, "PPP 'at' p")
                  : "Unknown"}
              </div>
            </div>

            {task.updatedAt && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Updated
                </div>
                <div className="text-sm">
                  {format(task.updatedAt, "PPP 'at' p")}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
