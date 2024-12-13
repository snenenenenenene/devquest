"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4">
                  <p className="text-sm font-medium">Updated GDD for Project X</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4">
                  <p className="text-sm font-medium">Completed Sprint Planning</p>
                  <p className="text-sm text-muted-foreground">5 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4">
                  <p className="text-sm font-medium">Alpha Release</p>
                  <p className="text-sm text-muted-foreground">In 5 days</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4">
                  <p className="text-sm font-medium">GDD Review</p>
                  <p className="text-sm text-muted-foreground">In 1 week</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
