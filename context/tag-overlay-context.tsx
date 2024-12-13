"use client"

import { createContext, useContext, useState } from "react"
import { TagOverlay } from "@/components/tag/tag-overlay"

interface TagOverlayContextType {
  openTag: (tag: { id: string; name: string; color: string }) => void
  closeTag: () => void
}

const TagOverlayContext = createContext<TagOverlayContextType | undefined>(
  undefined
)

export function TagOverlayProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeTag, setActiveTag] = useState<{
    id: string
    name: string
    color: string
  } | null>(null)

  const openTag = (tag: { id: string; name: string; color: string }) => {
    setActiveTag(tag)
  }

  const closeTag = () => {
    setActiveTag(null)
  }

  return (
    <TagOverlayContext.Provider value={{ openTag, closeTag }}>
      {children}
      <TagOverlay tag={activeTag} onClose={closeTag} />
    </TagOverlayContext.Provider>
  )
}

export function useTagOverlay() {
  const context = useContext(TagOverlayContext)
  if (context === undefined) {
    throw new Error("useTagOverlay must be used within a TagOverlayProvider")
  }
  return context
}
