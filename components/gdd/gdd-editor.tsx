"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  PlusCircle,
  Hash,
  Link2,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  History,
  Users,
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  ExternalLink,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ClickableTag } from "@/components/tag/clickable-tag"
import { ElementEditor } from "./element-editor"
import { useGDDStore } from "@/store/use-gdd-store"
import { useProjectStore } from "@/store/use-project-store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useToast } from "@/hooks/use-toast"
import { TemplateDialog, GDDTemplate } from "./template-dialog"

interface GDDEditorProps {
  projectId: number
}

export function GDDEditor({ projectId }: GDDEditorProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [filters, setFilters] = useState({
    tags: [] as string[],
    categories: [] as string[],
  })
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const gdd = useGDDStore((state) => state.gdds[projectId])
  const addCategory = useGDDStore((state) => state.addCategory)
  const addElement = useGDDStore((state) => state.addElement)
  const { toast } = useToast()

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const filteredCategories = gdd?.categories.map((category) => ({
    ...category,
    elements: category.elements.filter((element) => {
      const matchesSearch =
        searchQuery === "" ||
        element.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        element.content.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTags =
        filters.tags.length === 0 ||
        filters.tags.some((tag) => element.tags.includes(tag))

      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(category.id)

      return matchesSearch && matchesTags && matchesCategory
    }),
  }))

  const allTags = Array.from(
    new Set(
      gdd?.categories
        .flatMap((cat) => cat.elements)
        .flatMap((el) => el.tags) || []
    )
  )

  return (
    <div className="h-full flex">
      {/* Left Sidebar - Categories and Elements */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search elements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {showFilters && (
            <div className="space-y-4">
              <div>
                <Label>Filter by Tags</Label>
                <ScrollArea className="h-32 border rounded-md p-2">
                  {allTags.map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.tags.includes(tag)}
                        onChange={(e) => {
                          setFilters((prev) => ({
                            ...prev,
                            tags: e.target.checked
                              ? [...prev.tags, tag]
                              : prev.tags.filter((t) => t !== tag),
                          }))
                        }}
                      />
                      <span>{tag}</span>
                    </div>
                  ))}
                </ScrollArea>
              </div>

              <div>
                <Label>Filter by Categories</Label>
                <ScrollArea className="h-32 border rounded-md p-2">
                  {gdd?.categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category.id)}
                        onChange={(e) => {
                          setFilters((prev) => ({
                            ...prev,
                            categories: e.target.checked
                              ? [...prev.categories, category.id]
                              : prev.categories.filter((id) => id !== category.id),
                          }))
                        }}
                      />
                      <span>{category.name}</span>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>
          )}
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {filteredCategories?.map((category) => (
              <Collapsible
                key={category.id}
                open={expandedCategories.includes(category.id)}
                onOpenChange={() => toggleCategory(category.id)}
              >
                <div className="flex items-center justify-between">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      {expandedCategories.includes(category.id) ? (
                        <ChevronDown className="h-4 w-4 mr-2" />
                      ) : (
                        <ChevronRight className="h-4 w-4 mr-2" />
                      )}
                      {category.name}
                      <Badge variant="secondary" className="ml-2">
                        {category.elements.length}
                      </Badge>
                    </Button>
                  </CollapsibleTrigger>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          addElement(projectId, category.id, {
                            title: "New Element",
                            content: "",
                            category: category.name,
                            tags: [],
                          })
                          toast({
                            title: "Element created",
                            description: "New element has been added to the category",
                          })
                        }}
                      >
                        Add Element
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit Category</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete Category
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <CollapsibleContent className="mt-1 space-y-1">
                  {category.elements.map((element) => (
                    <Button
                      key={element.id}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start pl-8",
                        selectedElementId === element.id &&
                          "bg-secondary"
                      )}
                      onClick={() => {
                        setSelectedCategoryId(category.id)
                        setSelectedElementId(element.id)
                      }}
                    >
                      {element.title}
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const name = prompt("Enter category name")
                if (name) {
                  addCategory(projectId, name)
                  toast({
                    title: "Category created",
                    description: `Category "${name}" has been created`,
                  })
                }
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {gdd?.categories.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <p className="mb-4">No content yet. Start by creating your GDD structure.</p>
            <Button onClick={() => setShowTemplateDialog(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Choose Template
            </Button>
          </div>
        ) : selectedCategoryId && selectedElementId ? (
          <ElementEditor
            projectId={projectId}
            categoryId={selectedCategoryId}
            elementId={selectedElementId}
            onClose={() => {
              setSelectedCategoryId(null)
              setSelectedElementId(null)
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select an element to view or edit
          </div>
        )}
      </div>

      <TemplateDialog
        open={showTemplateDialog}
        onOpenChange={setShowTemplateDialog}
        onSelectTemplate={(template) => {
          template.categories.forEach((category) => {
            const categoryId = addCategory(projectId, category.name)
            category.defaultElements?.forEach((element) => {
              addElement(projectId, categoryId, {
                title: element.title,
                content: element.content,
                category: category.name,
                tags: element.tags,
              })
            })
          })
        }}
      />
    </div>
  )
}
