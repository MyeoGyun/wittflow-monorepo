'use client'

import { useState, useEffect } from 'react'
import { todoApi, Todo } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { addDays, isWithinInterval, startOfDay, subDays, format } from 'date-fns'
import { ko } from 'date-fns/locale'

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await todoApi.getAll() // Fetch All for client-side calc
        setTodos(data)
      } catch (error) {
        console.error("Failed to fetch dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Calculate Stats
  const total = todos.length
  const completed = todos.filter(t => t.is_completed).length
  const highPriority = todos.filter(t => !t.is_completed && t.priority === 'HIGH').length

  const today = startOfDay(new Date())
  const threeDaysLater = addDays(today, 3)
  const upcoming = todos.filter(t => {
    if (!t.due_date || t.is_completed) return false
    const dueDate = startOfDay(new Date(t.due_date))
    return isWithinInterval(dueDate, { start: today, end: threeDaysLater })
  }).length

  // Calculate Chart Data (Weekly Activity)
  const weeklyActivity = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(today, 6 - i)
    const dateStr = format(date, 'yyyy-MM-dd')
    const count = todos.filter(t => {
      // Assuming completed_at concept, but using updated_at for now if completed is true
      // Ideally backend should provide this, but simple approximation:
      if (!t.is_completed) return false
      // Check if it was updated (completed) on this day. 
      // NOTE: This is an approximation since updated_at changes on edits too.
      // For now, let's just count tasks created on this day as 'Activity' to show something, 
      // OR if we strictly want 'Completed', we might need a completed_at field.
      // Let's stick to created_at for "New Tasks" trend for accuracy, or just visual mockup logic.
      // Better: "Tasks Due" or similar.
      // Let's use "Created Tasks" for now as it's deterministic from fields we have.
      const createdDate = format(new Date(t.created_at), 'yyyy-MM-dd')
      return createdDate === dateStr
    }).length

    return {
      name: format(date, 'EEE', { locale: ko }),
      total: count
    }
  })

  // Priority Distribution
  const priorityCounts = {
    HIGH: todos.filter(t => !t.is_completed && t.priority === 'HIGH').length,
    MEDIUM: todos.filter(t => !t.is_completed && t.priority === 'MEDIUM').length,
    LOW: todos.filter(t => !t.is_completed && t.priority === 'LOW').length,
  }
  const priorityDistribution = [
    { name: '높음', value: priorityCounts.HIGH, color: '#ef4444' },
    { name: '보통', value: priorityCounts.MEDIUM, color: '#eab308' },
    { name: '낮음', value: priorityCounts.LOW, color: '#22c55e' },
  ].filter(i => i.value > 0)

  // Recent Activity (Sorted by updated_at)
  // Create a copy before sorting to avoid mutating state directly if strict mode
  const recentTodos = [...todos].sort((a, b) =>
    new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime()
  )

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">대시보드</h2>
      </div>

      <div className="space-y-4">
        <DashboardStats
          total={total}
          completed={completed}
          highPriority={highPriority}
          upcoming={upcoming}
        />

        <DashboardCharts
          weeklyActivity={weeklyActivity}
          priorityDistribution={priorityDistribution}
        />

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
          <RecentActivity recentTodos={recentTodos} />

          <Card className="col-span-1 lg:col-span-4">
            <CardHeader>
              <CardTitle>오늘의 할 일</CardTitle>
              <CardDescription>
                오늘 마감 및 높은 우선순위 항목
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Reusing TodoItem or simplified list */}
              <div className="space-y-4">
                {todos.filter(t => !t.is_completed && (t.priority === 'HIGH' || (t.due_date && isWithinInterval(new Date(t.due_date), { start: today, end: today })))).slice(0, 5).map(todo => (
                  <div key={todo.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{todo.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {todo.priority === 'HIGH' ? '높음' : todo.priority === 'MEDIUM' ? '보통' : '낮음'}
                      </p>
                    </div>
                    {todo.due_date && (
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(todo.due_date), 'MM/dd')}
                      </div>
                    )}
                  </div>
                ))}
                {todos.filter(t => !t.is_completed && (t.priority === 'HIGH' || (t.due_date && isWithinInterval(new Date(t.due_date), { start: today, end: today })))).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center">오늘 집중할 특별한 항목이 없습니다.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
