"use client"

import { Editor } from "@tiptap/react"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckSquare,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FloatingMenuProps {
  editor: Editor
  isOpen: boolean
  top: number
  left: number
  onLinkClick: () => void
  onImageClick: () => void
}

export function FloatingMenu({
  editor,
  isOpen,
  top,
  left,
  onLinkClick,
  onImageClick,
}: FloatingMenuProps) {
  if (!isOpen || !editor) {
    return null
  }

  const menuItems = [
    {
      icon: Bold,
      label: "Bold",
      command: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
    },
    {
      icon: Italic,
      label: "Italic",
      command: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
    },
    {
      icon: LinkIcon,
      label: "Link",
      command: onLinkClick,
      isActive: editor.isActive("link"),
    },
    {
      icon: ImageIcon,
      label: "Image",
      command: onImageClick,
      isActive: false,
    },
  ]

  const blockItems = [
    {
      icon: Heading1,
      label: "Heading 1",
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: Heading2,
      label: "Heading 2",
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: Heading3,
      label: "Heading 3",
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive("heading", { level: 3 }),
    },
    {
      icon: List,
      label: "Bullet List",
      command: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      command: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
    },
    {
      icon: CheckSquare,
      label: "Task List",
      command: () => editor.chain().focus().toggleTaskList().run(),
      isActive: editor.isActive("taskList"),
    },
    {
      icon: Quote,
      label: "Quote",
      command: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive("blockquote"),
    },
    {
      icon: Code,
      label: "Code Block",
      command: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive("codeBlock"),
    },
  ]

  return (
    <div
      className="fixed z-50 flex items-center gap-1 rounded-lg border bg-background p-1 shadow-md"
      style={{
        top: `${top}px`,
        left: `${left}px`,
      }}
    >
      {menuItems.map((item, index) => (
        <Button
          key={index}
          variant="ghost"
          size="sm"
          onClick={item.command}
          className={item.isActive ? "bg-muted" : ""}
        >
          <item.icon className="h-4 w-4" />
        </Button>
      ))}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <Heading1 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {blockItems.map((item, index) => (
            <DropdownMenuItem
              key={index}
              onClick={item.command}
              className={item.isActive ? "bg-muted" : ""}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
