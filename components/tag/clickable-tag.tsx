"use client"

import { Badge } from "@/components/ui/badge"
import { useTagStore } from "@/store/use-tag-store"
import { Hash } from "lucide-react"
import { cn } from "@/lib/utils"

interface ClickableTagProps {
  tag: {
    id: string
    name: string
    color: string
  }
  className?: string
  active?: boolean
  onClick?: () => void
}

export function ClickableTag({ tag, className, active, onClick }: ClickableTagProps) {
  const openTag = useTagStore((state) => state.openTag)

  return (
    <Badge
      variant="secondary"
      className={cn(
        "cursor-pointer transition-colors",
        `bg-${tag.color}-500/10 hover:bg-${tag.color}-500/20 text-${tag.color}-500`,
        active && `bg-${tag.color}-500/20 ring-2 ring-${tag.color}-500/20`,
        className
      )}
      onClick={(e) => {
        e.stopPropagation()
        if (onClick) {
          onClick()
        } else {
          openTag(tag)
        }
      }}
    >
      <Hash className="h-3 w-3 mr-1" />
      {tag.name}
    </Badge>
  )
}
