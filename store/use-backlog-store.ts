import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useTaskStore } from "./use-task-store"

export interface Story {
  id: number
  title: string
  points: number
  priority: "high" | "medium" | "low"
  tags: string[]
  taskIds: string[]
  gddElementIds: string[]
}

export interface Epic {
  id: number
  title: string
  description: string
  progress: number
  stories: Story[]
}

interface BacklogState {
  epics: Record<number, Epic[]>
  addEpic: (projectId: number, epic: Omit<Epic, "id" | "progress" | "stories">) => void
  deleteEpic: (projectId: number, epicId: number) => void
  updateEpic: (projectId: number, epicId: number, epic: Partial<Omit<Epic, "id" | "stories">>) => void
  addStory: (projectId: number, epicId: number, story: Omit<Story, "id" | "taskIds" | "gddElementIds">) => void
  updateStory: (projectId: number, epicId: number, storyId: number, story: Partial<Omit<Story, "id" | "taskIds" | "gddElementIds">>) => void
  deleteStory: (projectId: number, epicId: number, storyId: number) => void
  moveStory: (projectId: number, fromEpicId: number, toEpicId: number, storyId: number) => void
  linkTask: (projectId: number, epicId: number, storyId: number, taskId: string) => void
  unlinkTask: (projectId: number, epicId: number, storyId: number, taskId: string) => void
  linkGddElement: (projectId: number, epicId: number, storyId: number, elementId: string) => void
  unlinkGddElement: (projectId: number, epicId: number, storyId: number, elementId: string) => void
}

export const useBacklogStore = create<BacklogState>()(
  persist(
    (set) => ({
      epics: {},
      addEpic: (projectId, epic) =>
        set((state) => {
          const projectEpics = state.epics[projectId] || []
          return {
            epics: {
              ...state.epics,
              [projectId]: [
                ...projectEpics,
                {
                  ...epic,
                  id: Math.max(0, ...projectEpics.map((e) => e.id)) + 1,
                  progress: 0,
                  stories: [],
                },
              ],
            },
          }
        }),
      deleteEpic: (projectId, epicId) =>
        set((state) => {
          const projectEpics = state.epics[projectId] || []
          return {
            epics: {
              ...state.epics,
              [projectId]: projectEpics.filter((epic) => epic.id !== epicId),
            },
          }
        }),
      updateEpic: (projectId, epicId, updates) =>
        set((state) => {
          const projectEpics = state.epics[projectId] || []
          return {
            epics: {
              ...state.epics,
              [projectId]: projectEpics.map((epic) =>
                epic.id === epicId
                  ? {
                      ...epic,
                      ...updates,
                    }
                  : epic
              ),
            },
          }
        }),
      addStory: (projectId, epicId, story) =>
        set((state) => {
          const projectEpics = state.epics[projectId] || []
          return {
            epics: {
              ...state.epics,
              [projectId]: projectEpics.map((epic) =>
                epic.id === epicId
                  ? {
                      ...epic,
                      stories: [
                        ...epic.stories,
                        {
                          ...story,
                          id: Math.max(0, ...epic.stories.map((s) => s.id)) + 1,
                          taskIds: [],
                          gddElementIds: [],
                        },
                      ],
                    }
                  : epic
              ),
            },
          }
        }),
      updateStory: (projectId, epicId, storyId, updates) =>
        set((state) => {
          const projectEpics = state.epics[projectId] || []
          return {
            epics: {
              ...state.epics,
              [projectId]: projectEpics.map((epic) =>
                epic.id === epicId
                  ? {
                      ...epic,
                      stories: epic.stories.map((story) =>
                        story.id === storyId
                          ? {
                              ...story,
                              ...updates,
                            }
                          : story
                      ),
                    }
                  : epic
              ),
            },
          }
        }),
      deleteStory: (projectId, epicId, storyId) =>
        set((state) => {
          const projectEpics = state.epics[projectId] || []
          const epic = projectEpics.find((e) => e.id === epicId)
          if (epic) {
            const story = epic.stories.find((s) => s.id === storyId)
            if (story) {
              const taskStore = useTaskStore.getState()
              story.taskIds.forEach((taskId) => {
                taskStore.unlinkFromStory(projectId, taskId)
              })
            }
          }

          return {
            epics: {
              ...state.epics,
              [projectId]: projectEpics.map((epic) =>
                epic.id === epicId
                  ? {
                      ...epic,
                      stories: epic.stories.filter((s) => s.id !== storyId),
                    }
                  : epic
              ),
            },
          }
        }),
      moveStory: (projectId, fromEpicId, toEpicId, storyId) =>
        set((state) => {
          const projectEpics = state.epics[projectId] || []
          const fromEpic = projectEpics.find((e) => e.id === fromEpicId)
          const story = fromEpic?.stories.find((s) => s.id === storyId)
          
          if (!fromEpic || !story) return state

          return {
            epics: {
              ...state.epics,
              [projectId]: projectEpics.map((epic) => {
                if (epic.id === fromEpicId) {
                  return {
                    ...epic,
                    stories: epic.stories.filter((s) => s.id !== storyId),
                  }
                }
                if (epic.id === toEpicId) {
                  return {
                    ...epic,
                    stories: [...epic.stories, story],
                  }
                }
                return epic
              }),
            },
          }
        }),
      linkTask: (projectId, epicId, storyId, taskId) =>
        set((state) => {
          const taskStore = useTaskStore.getState()
          taskStore.linkToStory(projectId, taskId, epicId, storyId)

          const projectEpics = state.epics[projectId] || []
          return {
            epics: {
              ...state.epics,
              [projectId]: projectEpics.map((epic) =>
                epic.id === epicId
                  ? {
                      ...epic,
                      stories: epic.stories.map((story) =>
                        story.id === storyId
                          ? {
                              ...story,
                              taskIds: [...story.taskIds, taskId],
                            }
                          : story
                      ),
                    }
                  : epic
              ),
            },
          }
        }),
      unlinkTask: (projectId, epicId, storyId, taskId) =>
        set((state) => {
          const taskStore = useTaskStore.getState()
          taskStore.unlinkFromStory(projectId, taskId)

          const projectEpics = state.epics[projectId] || []
          return {
            epics: {
              ...state.epics,
              [projectId]: projectEpics.map((epic) =>
                epic.id === epicId
                  ? {
                      ...epic,
                      stories: epic.stories.map((story) =>
                        story.id === storyId
                          ? {
                              ...story,
                              taskIds: story.taskIds.filter((id) => id !== taskId),
                            }
                          : story
                      ),
                    }
                  : epic
              ),
            },
          }
        }),
      linkGddElement: (projectId, epicId, storyId, elementId) =>
        set((state) => {
          const projectEpics = state.epics[projectId] || []
          return {
            epics: {
              ...state.epics,
              [projectId]: projectEpics.map((epic) =>
                epic.id === epicId
                  ? {
                      ...epic,
                      stories: epic.stories.map((story) =>
                        story.id === storyId
                          ? {
                              ...story,
                              gddElementIds: [...story.gddElementIds, elementId],
                            }
                          : story
                      ),
                    }
                  : epic
              ),
            },
          }
        }),
      unlinkGddElement: (projectId, epicId, storyId, elementId) =>
        set((state) => {
          const projectEpics = state.epics[projectId] || []
          return {
            epics: {
              ...state.epics,
              [projectId]: projectEpics.map((epic) =>
                epic.id === epicId
                  ? {
                      ...epic,
                      stories: epic.stories.map((story) =>
                        story.id === storyId
                          ? {
                              ...story,
                              gddElementIds: story.gddElementIds.filter(
                                (id) => id !== elementId
                              ),
                            }
                          : story
                      ),
                    }
                  : epic
              ),
            },
          }
        }),
    }),
    {
      name: "devquest-backlog",
    }
  )
)
