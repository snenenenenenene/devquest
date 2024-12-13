import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Project {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
  status: "active" | "archived"
  members: {
    id: number
    name: string
    role: "owner" | "admin" | "member"
    avatar?: string
  }[]
}

interface ProjectState {
  projects: Project[]
  currentProjectId: number | null
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => void
  updateProject: (id: number, project: Partial<Project>) => void
  deleteProject: (id: number) => void
  setCurrentProject: (id: number | null) => void
  addMember: (projectId: number, member: Project["members"][0]) => void
  removeMember: (projectId: number, memberId: number) => void
  updateMember: (projectId: number, memberId: number, role: Project["members"][0]["role"]) => void
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [],
      currentProjectId: null,
      addProject: (project) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              ...project,
              id: Math.max(0, ...state.projects.map((p) => p.id)) + 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),
      updateProject: (id, project) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...project,
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
        })),
      setCurrentProject: (id) => set({ currentProjectId: id }),
      addMember: (projectId, member) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  members: [...p.members, member],
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        })),
      removeMember: (projectId, memberId) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  members: p.members.filter((m) => m.id !== memberId),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        })),
      updateMember: (projectId, memberId, role) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  members: p.members.map((m) =>
                    m.id === memberId ? { ...m, role } : m
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        })),
    }),
    {
      name: "devquest-projects",
    }
  )
)
