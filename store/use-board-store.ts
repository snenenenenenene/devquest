"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useTaskStore, type TaskItem } from "./use-task-store"

interface Board {
  columns: {
    id: string
    title: string
    taskIds: string[]
    order: number
  }[]
}

interface BoardState {
  boards: Record<string, Board>
  addTask: (projectId: string, columnId: string, task: Omit<TaskItem, "id" | "createdAt" | "updatedAt" | "status">) => void
  moveTask: (projectId: string, fromColumnId: string, toColumnId: string, taskId: string) => void
  getBoardByProjectId: (projectId: string) => Board
  addColumn: (projectId: string, title: string) => void
  updateColumn: (projectId: string, columnId: string, title: string) => void
  deleteColumn: (projectId: string, columnId: string) => void
  reorderColumns: (projectId: string, startIndex: number, endIndex: number) => void
}

const defaultBoard: Board = {
  columns: [
    { id: "todo", title: "To Do", taskIds: [], order: 0 },
    { id: "in-progress", title: "In Progress", taskIds: [], order: 1 },
    { id: "done", title: "Done", taskIds: [], order: 2 },
  ]
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      boards: {},
      getBoardByProjectId: (projectId: string) => {
        return get().boards[projectId] || defaultBoard
      },
      addTask: (projectId, columnId, task) => {
        const taskStore = useTaskStore.getState()
        const newTask = taskStore.addTask(projectId, {
          ...task,
          status: columnId,
        })

        set((state) => {
          const board = state.boards[projectId] || defaultBoard
          const updatedColumns = board.columns.map((col) =>
            col.id === columnId
              ? { ...col, taskIds: [...col.taskIds, newTask.id] }
              : col
          )

          return {
            boards: {
              ...state.boards,
              [projectId]: {
                columns: updatedColumns,
              },
            },
          }
        })

        return newTask
      },
      moveTask: (projectId, fromColumnId, toColumnId, taskId) => {
        // First update the task status in the task store
        const taskStore = useTaskStore.getState()
        taskStore.updateTask(projectId, taskId, { status: toColumnId })

        // Then update the board state
        set((state) => {
          const board = state.boards[projectId] || defaultBoard

          // Remove task from source column and add to destination column
          const updatedColumns = board.columns.map((col) => {
            if (col.id === fromColumnId) {
              return {
                ...col,
                taskIds: col.taskIds.filter((id) => id !== taskId),
              }
            }
            if (col.id === toColumnId) {
              // Only add if not already in the column
              if (!col.taskIds.includes(taskId)) {
                return {
                  ...col,
                  taskIds: [...col.taskIds, taskId],
                }
              }
            }
            return col
          })

          return {
            boards: {
              ...state.boards,
              [projectId]: {
                columns: updatedColumns,
              },
            },
          }
        })
      },
      addColumn: (projectId, title) => {
        set((state) => {
          const board = state.boards[projectId] || defaultBoard
          const maxOrder = Math.max(...board.columns.map(col => col.order))
          const newColumn = {
            id: crypto.randomUUID(),
            title,
            taskIds: [],
            order: maxOrder + 1
          }

          return {
            boards: {
              ...state.boards,
              [projectId]: {
                columns: [...board.columns, newColumn].sort((a, b) => a.order - b.order),
              },
            },
          }
        })
      },
      updateColumn: (projectId, columnId, title) => {
        set((state) => {
          const board = state.boards[projectId] || defaultBoard
          const updatedColumns = board.columns.map((col) =>
            col.id === columnId ? { ...col, title } : col
          )

          return {
            boards: {
              ...state.boards,
              [projectId]: {
                columns: updatedColumns,
              },
            },
          }
        })
      },
      deleteColumn: (projectId, columnId) => {
        set((state) => {
          const board = state.boards[projectId] || defaultBoard
          const updatedColumns = board.columns.filter(
            (col) => col.id !== columnId
          )

          return {
            boards: {
              ...state.boards,
              [projectId]: {
                columns: updatedColumns,
              },
            },
          }
        })
      },
      reorderColumns: (projectId, startIndex, endIndex) => {
        set((state) => {
          const board = state.boards[projectId] || defaultBoard
          const columns = [...board.columns]
          const [removed] = columns.splice(startIndex, 1)
          columns.splice(endIndex, 0, removed)
          
          // Update order numbers
          const updatedColumns = columns.map((col, index) => ({
            ...col,
            order: index
          }))

          return {
            boards: {
              ...state.boards,
              [projectId]: {
                columns: updatedColumns,
              },
            },
          }
        })
      },
    }),
    {
      name: "devquest-boards",
    }
  )
)
