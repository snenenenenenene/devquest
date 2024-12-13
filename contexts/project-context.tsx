"use client"

import { createContext, useContext, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useProjectStore } from "@/store/use-project-store"

interface ProjectContextType {
  projectId: number | null
  setProject: (id: number | null) => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const params = useParams()
  const currentProjectId = useProjectStore((state) => state.currentProjectId)
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject)
  const projects = useProjectStore((state) => state.projects)

  useEffect(() => {
    // If we have a project ID in the URL, set it as current
    if (params?.projectId) {
      const projectId = parseInt(params.projectId as string)
      if (projects.some(p => p.id === projectId)) {
        setCurrentProject(projectId)
      } else {
        setCurrentProject(null)
      }
    } else if (currentProjectId === null && projects.length > 0) {
      // If no project is selected and we have projects, select the first one
      setCurrentProject(projects[0].id)
    }
  }, [params?.projectId, projects, setCurrentProject, currentProjectId])

  useEffect(() => {
    // If we're on a project-specific route but have no project selected, go to home
    if (!currentProjectId && router.pathname?.includes("/board")) {
      router.push("/")
    }
  }, [currentProjectId, router])

  return (
    <ProjectContext.Provider
      value={{
        projectId: currentProjectId,
        setProject: setCurrentProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider")
  }
  return context
}
