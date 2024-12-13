"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Users,
  Settings,
  History,
  Save,
  FileText,
  MessageSquare,
  Image as ImageIcon,
} from "lucide-react"

export default function GDDEditor() {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <ResizablePanelGroup direction="horizontal">
        {/* Document Navigation */}
        <ResizablePanel defaultSize={20}>
          <div className="h-full border-r">
            <div className="p-4 space-y-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Game Overview</SelectItem>
                  <SelectItem value="mechanics">Core Mechanics</SelectItem>
                  <SelectItem value="characters">Characters</SelectItem>
                  <SelectItem value="levels">Level Design</SelectItem>
                </SelectContent>
              </Select>

              <Progress value={33} className="w-full" />
              <p className="text-sm text-muted-foreground">33% Complete</p>

              <ScrollArea className="h-[calc(100vh-15rem)]">
                <div className="space-y-4">
                  {/* Section List */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Required</Badge>
                      <span className="text-sm font-medium">Game Overview</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">In Progress</Badge>
                      <span className="text-sm font-medium">Core Mechanics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Not Started</Badge>
                      <span className="text-sm font-medium">Characters</span>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Main Editor */}
        <ResizablePanel defaultSize={60}>
          <div className="h-full">
            <div className="border-b p-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Game Overview</h2>
                <p className="text-sm text-muted-foreground">Last edited 2 minutes ago</p>
              </div>
              <div className="flex items-center gap-2">
                <HoverCard>
                  <HoverCardTrigger>
                    <Button variant="outline" size="icon">
                      <Users className="h-4 w-4" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Collaborators</h4>
                      <div className="flex items-center gap-2">
                        <Badge>Owner</Badge>
                        <span className="text-sm">You</span>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                <Button variant="outline" size="icon">
                  <History className="h-4 w-4" />
                </Button>

                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>

                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>

            <Tabs defaultValue="write" className="h-[calc(100vh-8rem)]">
              <div className="border-b px-4">
                <TabsList>
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="write" className="p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input placeholder="Enter section title" />
                  </div>

                  <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea
                      placeholder="Write your content here..."
                      className="min-h-[400px]"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="p-4">
                <div className="prose dark:prose-invert max-w-none">
                  <h1>Game Overview</h1>
                  <p>Preview content will appear here...</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Comments and Assets */}
        <ResizablePanel defaultSize={20}>
          <Tabs defaultValue="comments" className="h-full">
            <TabsList className="w-full justify-start px-4 pt-4">
              <TabsTrigger value="comments">
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments
              </TabsTrigger>
              <TabsTrigger value="assets">
                <ImageIcon className="h-4 w-4 mr-2" />
                Assets
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comments" className="p-4">
              <ScrollArea className="h-[calc(100vh-10rem)]">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Badge variant="outline">JD</Badge>
                    <div>
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-sm text-muted-foreground">
                        We should add more details about the target audience.
                      </p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="assets" className="p-4">
              <ScrollArea className="h-[calc(100vh-10rem)]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-2">
                    <div className="aspect-square bg-secondary rounded-md mb-2" />
                    <p className="text-sm font-medium truncate">concept-art-1.jpg</p>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
