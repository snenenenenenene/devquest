"use client"

import { useEffect, useState, useMemo } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Hash, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTagStore } from "@/store/use-tag-store"

interface TaggedItem {
  id: string
  type: "task" | "gdd" | "comment" | "element"
  title: string
  description: string
  project: string
  date: Date
  url: string
}

export function TagOverlay() {
  const activeTag = useTagStore((state) => state.activeTag)
  const isOpen = useTagStore((state) => state.isOpen)
  const closeTag = useTagStore((state) => state.closeTag)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [items, setItems] = useState<{
    tasks: TaggedItem[]
    gdds: TaggedItem[]
    comments: TaggedItem[]
  }>({
    tasks: [
      {
        id: "1",
        type: "task",
        title: "Implement combat system",
        description: "Create the core combat mechanics for the game",
        project: "Project X",
        date: new Date(),
        url: "/board/task/1",
      },
      {
        id: "2",
        type: "task",
        title: "Design character abilities",
        description: "Design and balance character abilities",
        project: "Project X",
        date: new Date(),
        url: "/board/task/2",
      },
    ],
    gdds: [
      {
        id: "1",
        type: "gdd",
        title: "Combat System Design",
        description: "Detailed design document for the combat system",
        project: "Project X",
        date: new Date(),
        url: "/gdd/1",
      },
    ],
    comments: [
      {
        id: "1",
        type: "comment",
        title: "Combat feedback",
        description: "We should make the combat more dynamic",
        project: "Project X",
        date: new Date(),
        url: "/board/task/1#comment-1",
      },
    ],
  })

  // In a real app, we would fetch the tagged items here
  useEffect(() => {
    if (activeTag) {
      // Fetch items tagged with this tag
      // This would be an API call in a real app
    }
  }, [activeTag])

  if (!mounted) return null
  if (!activeTag) return null

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeTag()}>
      <SheetContent
        side="right"
        className="w-[400px] sm:w-[540px] p-0 bg-background"
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-lg px-3 py-1",
                    `bg-${activeTag.color}-500/10 text-${activeTag.color}-500`
                  )}
                >
                  <Hash className="h-4 w-4 mr-1" />
                  {activeTag.name}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={closeTag}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Tabs defaultValue="all" className="flex-1">
            <div className="border-b">
              <div className="px-6">
                <TabsList>
                  <TabsTrigger value="all">
                    All{" "}
                    <span className="ml-1 text-muted-foreground">
                      ({items.tasks.length + items.gdds.length + items.comments.length})
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="tasks">
                    Tasks{" "}
                    <span className="ml-1 text-muted-foreground">
                      ({items.tasks.length})
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="gdds">
                    GDDs{" "}
                    <span className="ml-1 text-muted-foreground">
                      ({items.gdds.length})
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="comments">
                    Comments{" "}
                    <span className="ml-1 text-muted-foreground">
                      ({items.comments.length})
                    </span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-6">
                <TabsContent value="all" className="m-0">
                  <div className="space-y-4">
                    {[...items.tasks, ...items.gdds, ...items.comments].map(
                      (item) => (
                        <TaggedItemCard key={item.id} item={item} />
                      )
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="tasks" className="m-0">
                  <div className="space-y-4">
                    {items.tasks.map((item) => (
                      <TaggedItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="gdds" className="m-0">
                  <div className="space-y-4">
                    {items.gdds.map((item) => (
                      <TaggedItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="comments" className="m-0">
                  <div className="space-y-4">
                    {items.comments.map((item) => (
                      <TaggedItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function TaggedItemCard({ item }: { item: TaggedItem }) {
  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">
              <a
                href={item.url}
                className="hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  // Handle navigation in a real app
                }}
              >
                {item.title}
              </a>
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {item.description}
            </CardDescription>
          </div>
          <Badge variant="outline" className="capitalize">
            {item.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{item.project}</span>
          <span>{new Date(item.date).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}
