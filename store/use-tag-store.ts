import { create } from "zustand"

interface Tag {
  id: string
  name: string
  color: string
}

interface TagState {
  activeTag: Tag | null
  isOpen: boolean
}

interface TagActions {
  openTag: (tag: Tag) => void
  closeTag: () => void
}

export const useTagStore = create<TagState & TagActions>((set) => ({
  activeTag: null,
  isOpen: false,
  openTag: (tag) => set({ activeTag: tag, isOpen: true }),
  closeTag: () => set({ activeTag: null, isOpen: false }),
}))
