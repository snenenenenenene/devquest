import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Task } from "@/types/task"

export interface GDDElement {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
  linkedTasks: string[] // Array of task IDs
  attachments?: {
    id: string
    name: string
    url: string
    type: string
  }[]
  comments?: {
    id: string
    content: string
    authorId: string
    createdAt: string
  }[]
  version: number
  versionHistory: {
    version: number
    content: string
    updatedAt: string
    updatedBy: string
  }[]
}

interface GDDState {
  gdds: Record<number, { // Key is projectId
    categories: {
      id: string
      name: string
      elements: GDDElement[]
    }[]
  }>
  addCategory: (projectId: number, name: string) => void
  updateCategory: (projectId: number, categoryId: string, name: string) => void
  deleteCategory: (projectId: number, categoryId: string) => void
  addElement: (projectId: number, categoryId: string, element: Omit<GDDElement, "id" | "createdAt" | "updatedAt" | "version" | "versionHistory" | "linkedTasks">) => void
  updateElement: (projectId: number, categoryId: string, elementId: string, element: Partial<GDDElement>, userId: string) => void
  deleteElement: (projectId: number, categoryId: string, elementId: string) => void
  addAttachment: (projectId: number, categoryId: string, elementId: string, attachment: Omit<GDDElement["attachments"][0], "id">) => void
  removeAttachment: (projectId: number, categoryId: string, elementId: string, attachmentId: string) => void
  addComment: (projectId: number, categoryId: string, elementId: string, content: string, authorId: string) => void
  removeComment: (projectId: number, categoryId: string, elementId: string, commentId: string) => void
  linkTask: (projectId: number, categoryId: string, elementId: string, taskId: string) => void
  unlinkTask: (projectId: number, categoryId: string, elementId: string, taskId: string) => void
  getLinkedTasks: (projectId: number, categoryId: string, elementId: string) => string[]
  getElementByTaskId: (projectId: number, taskId: string) => { categoryId: string; element: GDDElement } | null
}

export const useGDDStore = create<GDDState>()(
  persist(
    (set, get) => ({
      gdds: {},
      addCategory: (projectId, name) =>
        set((state) => {
          const gdd = state.gdds[projectId] || { categories: [] }
          const newCategory = {
            id: Math.random().toString(36).substring(2, 9),
            name,
            elements: [],
          }

          return {
            gdds: {
              ...state.gdds,
              [projectId]: {
                ...gdd,
                categories: [...gdd.categories, newCategory],
              },
            },
          }
        }),
      updateCategory: (projectId, categoryId, name) =>
        set((state) => {
          const gdd = state.gdds[projectId]
          if (!gdd) return state

          return {
            gdds: {
              ...state.gdds,
              [projectId]: {
                ...gdd,
                categories: gdd.categories.map((cat) =>
                  cat.id === categoryId ? { ...cat, name } : cat
                ),
              },
            },
          }
        }),
      deleteCategory: (projectId, categoryId) =>
        set((state) => {
          const gdd = state.gdds[projectId]
          if (!gdd) return state

          return {
            gdds: {
              ...state.gdds,
              [projectId]: {
                ...gdd,
                categories: gdd.categories.filter((cat) => cat.id !== categoryId),
              },
            },
          }
        }),
      addElement: (projectId, categoryId, element) =>
        set((state) => {
          const gdd = state.gdds[projectId]
          if (!gdd) return state

          const newElement: GDDElement = {
            ...element,
            id: Math.random().toString(36).substring(2, 9),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: 1,
            versionHistory: [],
            linkedTasks: [],
          }

          return {
            gdds: {
              ...state.gdds,
              [projectId]: {
                ...gdd,
                categories: gdd.categories.map((cat) =>
                  cat.id === categoryId
                    ? { ...cat, elements: [...cat.elements, newElement] }
                    : cat
                ),
              },
            },
          }
        }),
      updateElement: (projectId, categoryId, elementId, element, userId) =>
        set((state) => {
          const gdd = state.gdds[projectId]
          if (!gdd) return state

          return {
            gdds: {
              ...state.gdds,
              [projectId]: {
                ...gdd,
                categories: gdd.categories.map((cat) => ({
                  ...cat,
                  elements: cat.elements.map((el) => {
                    if (el.id !== elementId) return el
                    
                    const updatedElement = {
                      ...el,
                      ...element,
                      updatedAt: new Date().toISOString(),
                      version: el.version + 1,
                    }

                    // Add to version history if content changed
                    if (element.content && element.content !== el.content) {
                      updatedElement.versionHistory = [
                        ...el.versionHistory,
                        {
                          version: el.version,
                          content: el.content,
                          updatedAt: el.updatedAt,
                          updatedBy: userId,
                        },
                      ]
                    }

                    return updatedElement
                  }),
                })),
              },
            },
          }
        }),
      deleteElement: (projectId, categoryId, elementId) =>
        set((state) => {
          const gdd = state.gdds[projectId]
          if (!gdd) return state

          return {
            gdds: {
              ...state.gdds,
              [projectId]: {
                ...gdd,
                categories: gdd.categories.map((cat) => ({
                  ...cat,
                  elements: cat.elements.filter((el) => el.id !== elementId),
                })),
              },
            },
          }
        }),
      addAttachment: (projectId, categoryId, elementId, attachment) =>
        set((state) => {
          const gdd = state.gdds[projectId]
          if (!gdd) return state

          const newAttachment = {
            ...attachment,
            id: Math.random().toString(36).substring(2, 9),
          }

          return {
            gdds: {
              ...state.gdds,
              [projectId]: {
                ...gdd,
                categories: gdd.categories.map((cat) => ({
                  ...cat,
                  elements: cat.elements.map((el) =>
                    el.id === elementId
                      ? {
                          ...el,
                          attachments: [...(el.attachments || []), newAttachment],
                          updatedAt: new Date().toISOString(),
                        }
                      : el
                  ),
                })),
              },
            },
          }
        }),
      removeAttachment: (projectId, categoryId, elementId, attachmentId) =>
        set((state) => {
          const gdd = state.gdds[projectId]
          if (!gdd) return state

          return {
            gdds: {
              ...state.gdds,
              [projectId]: {
                ...gdd,
                categories: gdd.categories.map((cat) => ({
                  ...cat,
                  elements: cat.elements.map((el) =>
                    el.id === elementId
                      ? {
                          ...el,
                          attachments: (el.attachments || []).filter(
                            (a) => a.id !== attachmentId
                          ),
                          updatedAt: new Date().toISOString(),
                        }
                      : el
                  ),
                })),
              },
            },
          }
        }),
      addComment: (projectId, categoryId, elementId, content, authorId) =>
        set((state) => {
          const gdd = state.gdds[projectId]
          if (!gdd) return state

          const newComment = {
            id: Math.random().toString(36).substring(2, 9),
            content,
            authorId,
            createdAt: new Date().toISOString(),
          }

          return {
            gdds: {
              ...state.gdds,
              [projectId]: {
                ...gdd,
                categories: gdd.categories.map((cat) => ({
                  ...cat,
                  elements: cat.elements.map((el) =>
                    el.id === elementId
                      ? {
                          ...el,
                          comments: [...(el.comments || []), newComment],
                          updatedAt: new Date().toISOString(),
                        }
                      : el
                  ),
                })),
              },
            },
          }
        }),
      removeComment: (projectId, categoryId, elementId, commentId) =>
        set((state) => {
          const gdd = state.gdds[projectId]
          if (!gdd) return state

          return {
            gdds: {
              ...state.gdds,
              [projectId]: {
                ...gdd,
                categories: gdd.categories.map((cat) => ({
                  ...cat,
                  elements: cat.elements.map((el) =>
                    el.id === elementId
                      ? {
                          ...el,
                          comments: (el.comments || []).filter(
                            (c) => c.id !== commentId
                          ),
                          updatedAt: new Date().toISOString(),
                        }
                      : el
                  ),
                })),
              },
            },
          }
        }),
      linkTask: (projectId, categoryId, elementId, taskId) =>
        set((state) => {
          const gdd = state.gdds[projectId]
          if (!gdd) return state

          return {
            gdds: {
              ...state.gdds,
              [projectId]: {
                ...gdd,
                categories: gdd.categories.map((cat) => ({
                  ...cat,
                  elements: cat.elements.map((el) =>
                    el.id === elementId && !el.linkedTasks.includes(taskId)
                      ? {
                          ...el,
                          linkedTasks: [...el.linkedTasks, taskId],
                          updatedAt: new Date().toISOString(),
                        }
                      : el
                  ),
                })),
              },
            },
          }
        }),
      unlinkTask: (projectId, categoryId, elementId, taskId) =>
        set((state) => {
          const gdd = state.gdds[projectId]
          if (!gdd) return state

          return {
            gdds: {
              ...state.gdds,
              [projectId]: {
                ...gdd,
                categories: gdd.categories.map((cat) => ({
                  ...cat,
                  elements: cat.elements.map((el) =>
                    el.id === elementId
                      ? {
                          ...el,
                          linkedTasks: el.linkedTasks.filter((id) => id !== taskId),
                          updatedAt: new Date().toISOString(),
                        }
                      : el
                  ),
                })),
              },
            },
          }
        }),
      getLinkedTasks: (projectId, categoryId, elementId) => {
        const gdd = get().gdds[projectId]
        if (!gdd) return []

        const element = gdd.categories
          .find((cat) => cat.id === categoryId)
          ?.elements.find((el) => el.id === elementId)

        return element?.linkedTasks || []
      },
      getElementByTaskId: (projectId, taskId) => {
        const gdd = get().gdds[projectId]
        if (!gdd) return null

        for (const category of gdd.categories) {
          const element = category.elements.find((el) =>
            el.linkedTasks.includes(taskId)
          )
          if (element) {
            return { categoryId: category.id, element }
          }
        }

        return null
      },
    }),
    {
      name: "devquest-gdds",
    }
  )
)
