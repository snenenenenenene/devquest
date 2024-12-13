"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react"
import { Extension, Mark } from '@tiptap/core'
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import { Plugin, PluginKey } from 'prosemirror-state'
import Suggestion from '@tiptap/suggestion'
import { ReactRenderer } from '@tiptap/react'
import tippy, { Instance, GetReferenceClientRect } from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { FloatingMenu } from "./floating-menu"
import { cn } from "@/lib/utils"
import { 
  Heading1, Heading2, Heading3, List, ListOrdered, Code2, Quote, 
  Minus, Bold, Italic, Underline, Strikethrough, CheckSquare, 
  Image as ImageIcon, FileText, Video, Bookmark, Table as TableIcon,
  MessageSquare, ToggleLeft, Hash
} from 'lucide-react'

interface TiptapProps {
  content: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
  editable?: boolean
}

interface CommandMenuItem {
  title: string;
  description: string;
  command: (editor: any) => void;
  icon?: any;
  shortcut?: string;
}

const MENU_ITEMS: CommandMenuItem[] = [
  // Text Formatting
  {
    title: 'Text',
    description: 'Just start writing with plain text',
    command: editor => editor.chain().focus().setParagraph().run(),
    icon: FileText,
    shortcut: 'text'
  },
  {
    title: 'Heading 1',
    description: 'Large section heading',
    command: editor => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    icon: Heading1,
    shortcut: '# '
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    command: editor => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    icon: Heading2,
    shortcut: '## '
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    command: editor => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    icon: Heading3,
    shortcut: '### '
  },
  {
    title: 'Bold',
    description: 'Make text bold',
    command: editor => editor.chain().focus().toggleBold().run(),
    icon: Bold,
    shortcut: '**'
  },
  {
    title: 'Italic',
    description: 'Make text italic',
    command: editor => editor.chain().focus().toggleItalic().run(),
    icon: Italic,
    shortcut: '*'
  },
  {
    title: 'Underline',
    description: 'Underline text',
    command: editor => editor.chain().focus().toggleUnderline().run(),
    icon: Underline,
    shortcut: '_'
  },
  {
    title: 'Strikethrough',
    description: 'Strike through text',
    command: editor => editor.chain().focus().toggleStrike().run(),
    icon: Strikethrough,
    shortcut: '~~'
  },
  // Lists
  {
    title: 'Bullet List',
    description: 'Create a simple bullet list',
    command: editor => editor.chain().focus().toggleBulletList().run(),
    icon: List,
    shortcut: '- '
  },
  {
    title: 'Numbered List',
    description: 'Create a numbered list',
    command: editor => editor.chain().focus().toggleOrderedList().run(),
    icon: ListOrdered,
    shortcut: '1. '
  },
  {
    title: 'Task List',
    description: 'Create a task list with checkboxes',
    command: editor => editor.chain().focus().toggleTaskList().run(),
    icon: CheckSquare,
    shortcut: '[] '
  },
  // Blocks
  {
    title: 'Code Block',
    description: 'Add a code block',
    command: editor => editor.chain().focus().toggleCodeBlock().run(),
    icon: Code2,
    shortcut: '```'
  },
  {
    title: 'Quote',
    description: 'Add a quote block',
    command: editor => editor.chain().focus().toggleBlockquote().run(),
    icon: Quote,
    shortcut: '> '
  },
  {
    title: 'Divider',
    description: 'Add a horizontal divider',
    command: editor => editor.chain().focus().setHorizontalRule().run(),
    icon: Minus,
    shortcut: '---'
  }
]

interface SuggestionProps {
  items: typeof MENU_ITEMS
  command: (item: CommandMenuItem) => void
  editor: Editor
  range: any
}

function CommandMenu({
  items,
  command,
  editor,
  range,
}: SuggestionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const commandListRef = useRef<HTMLDivElement>(null)

  const selectItem = useCallback((index: number) => {
    const item = items[index]
    if (item) {
      command(item)
    }
  }, [command, items])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => (i + 1) % items.length)
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => (i - 1 + items.length) % items.length)
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        selectItem(selectedIndex)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [items, selectedIndex, selectItem])

  useEffect(() => {
    const selectedElement = commandListRef.current?.children[selectedIndex] as HTMLElement
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  return (
    <div 
      ref={commandListRef}
      className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-gray-200 bg-white p-2 shadow-md"
    >
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => selectItem(index)}
          className={cn(
            'flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-100',
            selectedIndex === index ? 'bg-gray-100' : 'bg-white'
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white">
            {item.icon && <item.icon className="h-5 w-5" />}
          </div>
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-xs text-gray-500">{item.description}</p>
          </div>
        </button>
      ))}
    </div>
  )
}

const SlashCommandsExtension = Extension.create({
  name: 'slashCommands',

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '/',
        command: ({ editor, range, item }) => {
          if (item && item.command) {
            // First delete the slash character and any text after it
            editor
              .chain()
              .focus()
              .deleteRange({ from: range.from - 1, to: range.to })
              .run()
            
            // Then execute the command
            item.command(editor)
          }
        },
        items: ({ query }) => {
          return MENU_ITEMS.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
          ).slice(0, 10)
        },
        render: () => {
          let component: ReactRenderer | null = null
          let popup: Instance | null = null

          return {
            onStart: (props) => {
              component = new ReactRenderer(CommandMenu, {
                props,
                editor: props.editor,
              })

              popup = tippy(props.editor.options.element, {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              })
            },
            onUpdate: (props) => {
              component?.updateProps(props)
              
              popup?.setProps({
                getReferenceClientRect: props.clientRect,
              })
            },
            onKeyDown: (props) => {
              if (props.event.key === 'Escape') {
                popup?.hide()
                return true
              }
              
              return component?.ref?.onKeyDown(props.event)
            },
            onExit: () => {
              popup?.destroy()
              component?.destroy()
            },
          }
        },
      }),
    ]
  },
})

interface CommandMenuProps {
  editor: any;
  show: boolean;
  onClose: () => void;
  items: CommandMenuItem[];
  position: { x: number; y: number };
}

function CommandMenuNew({ items, command, editor, range }: { 
  items: typeof MENU_ITEMS,
  command: (item: typeof MENU_ITEMS[0]) => void,
  editor: Editor,
  range: { from: number, to: number }
}) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const commandListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => (i + 1) % items.length)
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => (i - 1 + items.length) % items.length)
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        const item = items[selectedIndex]
        if (item) {
          command(item)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [items, selectedIndex, command])

  useEffect(() => {
    const selectedElement = commandListRef.current?.children[selectedIndex] as HTMLElement
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  return (
    <div 
      ref={commandListRef}
      className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-gray-200 bg-white p-2 shadow-md"
    >
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => command(item)}
          className={cn(
            'flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-100',
            selectedIndex === index ? 'bg-gray-100' : 'bg-white'
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white">
            {item.icon && <item.icon className="h-5 w-5" />}
          </div>
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-xs text-gray-500">{item.description}</p>
          </div>
        </button>
      ))}
    </div>
  )
}

const CustomPlaceholder = Placeholder.configure({
  placeholder: ({ node }) => {
    if (node.type.name === "heading") {
      return "Section title..."
    }
    if (node.type.name === "paragraph" && !node.textContent) {
      return "Write your description here. Use # for headings, - for lists, and #tag for tags..."
    }
    return ""
  },
  showOnlyWhenEditable: true,
})

const Tag = Mark.create({
  name: 'tag',
  
  addAttributes() {
    return {
      id: {
        default: null
      },
      tag: {
        default: null
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="tag"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', { 
      'data-type': 'tag',
      'class': 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer select-none',
      'data-tag': HTMLAttributes.tag,
      ...HTMLAttributes
    }]
  }
})

const TagHandler = Extension.create({
  name: 'tagHandler',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            click: (view, event) => {
              // Check if we clicked on a tag
              const target = event.target as HTMLElement
              if (target.hasAttribute('data-type') && target.getAttribute('data-type') === 'tag') {
                const tag = target.getAttribute('data-tag')
                if (tag) {
                  // Prevent the editor from getting focus
                  event.preventDefault()
                  event.stopPropagation()
                  
                  // Emit a custom event that we'll handle in the React component
                  const customEvent = new CustomEvent('tagclick', { 
                    detail: { tag },
                    bubbles: true 
                  })
                  target.dispatchEvent(customEvent)
                  return true
                }
              }
              return false
            }
          },
          handleKeyDown: (view, event) => {
            const { selection, doc } = view.state
            const { from } = selection

            // Get the position at the start of the current line
            const $from = doc.resolve(from)
            const start = $from.before()
            const textBeforeCursor = doc.textBetween(start, from, "\n")
            
            // If we're at the start of a line and see a #, handle as heading
            if (event.key === ' ' && textBeforeCursor === '#') {
              view.dispatch(
                view.state.tr
                  .delete(from - 1, from)
                  .setBlockType(from - 1, from - 1, view.state.schema.nodes.heading, { level: 1 })
              )
              return true
            }
            
            if (event.key === ' ' && textBeforeCursor === '##') {
              view.dispatch(
                view.state.tr
                  .delete(from - 2, from)
                  .setBlockType(from - 2, from - 2, view.state.schema.nodes.heading, { level: 2 })
              )
              return true
            }
            
            if (event.key === ' ' && textBeforeCursor === '###') {
              view.dispatch(
                view.state.tr
                  .delete(from - 3, from)
                  .setBlockType(from - 3, from - 3, view.state.schema.nodes.heading, { level: 3 })
              )
              return true
            }

            // Only check for tags if we're not at the start of a line
            if (textBeforeCursor.trim().length > 0) {
              const match = textBeforeCursor.match(/#\w+$/)
              if (match && match[0].length > 1 && (event.key === ' ' || event.key === 'Enter')) {
                const tagText = match[0].slice(1)
                const start = from - match[0].length
                const end = from
                
                view.dispatch(
                  view.state.tr
                    .delete(start, end)
                    .insertText('#' + tagText + ' ', start)
                    .addMark(
                      start,
                      start + tagText.length + 1,
                      view.state.schema.marks.tag.create({ tag: tagText })
                    )
                )

                if (event.key === 'Enter') {
                  view.dispatch(view.state.tr.insertText('\n', from))
                }
                
                return true
              }
            }
            
            return false
          },
        },
      }),
    ]
  },
})

function getWordRange(doc: any, pos: number) {
  const $pos = doc.resolve(pos)
  const start = $pos.start()
  const text = doc.textBetween(start, $pos.end())
  const word = text.slice(0, pos - start).match(/\S+$/)
  if (!word) return null

  const from = start + word.index
  const to = from + word[0].length
  return { from, to }
}

export default function Tiptap({
  content,
  onChange,
  placeholder = "Start writing...",
  className,
  editable = true,
}: TiptapProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: ({ level }: { level: number }) => {
              const classes = {
                1: 'text-4xl font-bold mt-8 mb-4',
                2: 'text-3xl font-bold mt-6 mb-3',
                3: 'text-2xl font-bold mt-4 mb-2'
              }
              return classes[level as keyof typeof classes] || ''
            }
          }
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'list-disc list-inside my-4'
          }
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'list-decimal list-inside my-4'
          }
        },
        paragraph: {
          HTMLAttributes: {
            class: 'my-2'
          }
        },
        code: {
          HTMLAttributes: {
            class: 'rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm'
          }
        },
        codeBlock: {
          languageClassPrefix: 'language-',
          HTMLAttributes: {
            class: 'rounded-md bg-muted p-4 font-mono my-4'
          }
        }
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-4'
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-md max-w-full'
        }
      }),
      Tag,
      TagHandler,
      SlashCommandsExtension,
      TaskList,
      TaskItem.configure({
        nested: true
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full'
        }
      }),
      TableRow,
      TableHeader,
      TableCell
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-stone dark:prose-invert max-w-none',
          'focus:outline-none p-4',
          className
        )
      }
    }
  })

  if (!editor) {
    return null
  }

  return (
    <div className="relative">
      <EditorContent
        editor={editor}
        className="min-h-[500px] h-full w-full rounded-md bg-transparent px-4 py-3 text-base ring-offset-background focus-visible:outline-none"
      />
    </div>
  )
}
