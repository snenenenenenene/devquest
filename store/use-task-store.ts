import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface TaskItem {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  assignee?: {
    id: number
    name: string
    avatar?: string
  }
  dueDate?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  comments?: Array<{
    id: string
    content: string
    author: {
      name: string
      avatar?: string
    }
    createdAt: Date
  }>
  // References to other items
  storyId?: number
  epicId?: number
  gddElementId?: string
  gddCategoryId?: string
}

interface TaskState {
  tasks: Record<string, TaskItem[]>
  addTask: (projectId: string, task: Omit<TaskItem, "id" | "createdAt" | "updatedAt">) => TaskItem
  updateTask: (projectId: string, taskId: string, task: Partial<TaskItem>) => void
  deleteTask: (projectId: string, taskId: string) => void
  getTasksByProjectId: (projectId: string) => TaskItem[]
  linkToStory: (projectId: string, taskId: string, epicId: number, storyId: number) => void
  unlinkFromStory: (projectId: string, taskId: string) => void
  linkToGddElement: (projectId: string, taskId: string, categoryId: string, elementId: string) => void
  unlinkFromGddElement: (projectId: string, taskId: string) => void
  reorderTasks: (projectId: string, sourceIndex: number, destinationIndex: number) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: {},
      getTasksByProjectId: (projectId: string) => {
        return get().tasks[projectId] || [];
      },
      addTask: (projectId, task) => {
        const newTask: TaskItem = {
          id: crypto.randomUUID(),
          title: task.title,
          description: task.description || "",
          priority: task.priority || "medium",
          status: task.status || "todo",
          tags: task.tags || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          tasks: {
            ...state.tasks,
            [projectId]: [...(state.tasks[projectId] || []), newTask],
          },
        }));

        return newTask;
      },
      updateTask: (projectId, taskId, updatedTask) => {
        set((state) => ({
          tasks: {
            ...state.tasks,
            [projectId]: (state.tasks[projectId] || []).map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    ...updatedTask,
                    updatedAt: new Date().toISOString(),
                  }
                : task
            ),
          },
        }))
      },
      deleteTask: (projectId, taskId) => {
        set((state) => ({
          tasks: {
            ...state.tasks,
            [projectId]: (state.tasks[projectId] || []).filter(
              (task) => task.id !== taskId
            ),
          },
        }))
      },
      linkToStory: (projectId, taskId, epicId, storyId) =>
        set((state) => {
          const projectTasks = state.tasks[projectId] || []
          return {
            tasks: {
              ...state.tasks,
              [projectId]: projectTasks.map((t) =>
                t.id === taskId
                  ? {
                      ...t,
                      epicId,
                      storyId,
                      updatedAt: new Date().toISOString(),
                    }
                  : t
              ),
            },
          }
        }),
      unlinkFromStory: (projectId, taskId) =>
        set((state) => {
          const projectTasks = state.tasks[projectId] || []
          return {
            tasks: {
              ...state.tasks,
              [projectId]: projectTasks.map((t) =>
                t.id === taskId
                  ? {
                      ...t,
                      epicId: undefined,
                      storyId: undefined,
                      updatedAt: new Date().toISOString(),
                    }
                  : t
              ),
            },
          }
        }),
      linkToGddElement: (projectId, taskId, categoryId, elementId) =>
        set((state) => {
          const projectTasks = state.tasks[projectId] || []
          return {
            tasks: {
              ...state.tasks,
              [projectId]: projectTasks.map((t) =>
                t.id === taskId
                  ? {
                      ...t,
                      gddCategoryId: categoryId,
                      gddElementId: elementId,
                      updatedAt: new Date().toISOString(),
                    }
                  : t
              ),
            },
          }
        }),
      unlinkFromGddElement: (projectId, taskId) =>
        set((state) => {
          const projectTasks = state.tasks[projectId] || []
          return {
            tasks: {
              ...state.tasks,
              [projectId]: projectTasks.map((t) =>
                t.id === taskId
                  ? {
                      ...t,
                      gddCategoryId: undefined,
                      gddElementId: undefined,
                      updatedAt: new Date().toISOString(),
                    }
                  : t
              ),
            },
          }
        }),
      reorderTasks: (projectId, sourceIndex, destinationIndex) => {
        set((state) => {
          const projectTasks = [...(state.tasks[projectId] || [])]
          const [removed] = projectTasks.splice(sourceIndex, 1)
          projectTasks.splice(destinationIndex, 0, removed)
          
          return {
            tasks: {
              ...state.tasks,
              [projectId]: projectTasks,
            },
          }
        })
      },
    }),
    {
      name: "task-storage",
    }
  )
)
