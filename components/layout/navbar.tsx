"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, Bell } from "lucide-react"
import { useProjectStore } from "@/store/use-project-store"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { UserButton } from "@/components/user-button"

interface NavbarProps {
  onToggleSidebar: () => void
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const projects = useProjectStore((state) => state.projects)
  const currentProjectId = useProjectStore((state) => state.currentProjectId)
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject)

  return (
    <nav className="bg-background">
      <div className="flex h-16 items-center px-4 gap-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>

        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="DevQuest"
            width={32}
            height={32}
            className="h-8 w-8"
          />
        </Link>

        {projects.length > 0 && (
          <Select
            value={currentProjectId?.toString()}
            onValueChange={(value) => setCurrentProject(parseInt(value))}
          >
            <SelectTrigger className="w-[200px] ml-4">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <UserButton />
        </div>
      </div>
    </nav>
  )
}
