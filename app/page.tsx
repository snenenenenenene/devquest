"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useProjectStore } from "@/store/use-project-store"

export default function Home() {
  const router = useRouter()
  const projects = useProjectStore((state) => state.projects)
  const currentProjectId = useProjectStore((state) => state.currentProjectId)

  useEffect(() => {
    if (currentProjectId) {
      router.push("/board")
    }
  }, [currentProjectId, router])

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">DevQuest</h1>
        
        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Level 1</CardTitle>
              <CardDescription>Project Manager</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-2 bg-secondary rounded-full">
                <div className="h-2 bg-primary rounded-full w-1/3"></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">300/1000 XP</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Daily Streak</CardTitle>
              <CardDescription>Keep up the momentum!</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">🔥 3 Days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tasks Completed</CardTitle>
              <CardDescription>This week</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">12/15</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-4 mb-8">
          <Button size="lg">
            New Project
          </Button>
          <Button size="lg" variant="outline">
            Create Task
          </Button>
        </div>
        
        {/* Recent Projects */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Recent Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Awesome Game Project</CardTitle>
                <CardDescription>Last updated 2 hours ago</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tasks: 8/12</span>
                  <span>Due in 5 days</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Game Design Document</CardTitle>
                <CardDescription>Last updated yesterday</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tasks: 3/7</span>
                  <span>Due in 2 weeks</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
}
