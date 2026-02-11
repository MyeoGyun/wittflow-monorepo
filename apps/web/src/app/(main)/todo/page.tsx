'use client'

import { useState, useEffect, useCallback } from "react"
import { LayoutList, KanbanSquare } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { TodoList } from "@/components/todo/todo-list"
import { TodoFilters } from "@/components/todo/todo-filters"
import { KanbanBoard } from "@/components/kanban/kanban-board"
import { todoApi, Todo, TodoQueryParams } from "@/lib/api"
import { TodoCreateDialog } from "@/components/todo/todo-create-dialog"

export default function TodoPage() {
    const [todos, setTodos] = useState<Todo[]>([])
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState<'list' | 'board'>('list')
    const [filters, setFilters] = useState<TodoQueryParams>({
        ordering: '-created_at',
    })

    const fetchTodos = useCallback(async () => {
        setLoading(true)
        try {
            const data = await todoApi.getAll(filters)
            setTodos(data)
        } catch (error) {
            console.error("Failed to fetch todos", error)
        } finally {
            setLoading(false)
        }
    }, [filters])

    useEffect(() => {
        fetchTodos()
    }, [fetchTodos])

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
            <header className="flex h-14 items-center gap-4 border-b bg-white dark:bg-gray-950 px-6 shrink-0 z-10">
                <h1 className="font-semibold text-lg">할 일 관리</h1>
                <div className="ml-auto flex items-center gap-2">
                    <div className="flex items-center border rounded-md bg-background p-0.5">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn("h-7 w-7 p-0", viewMode === 'list' && "bg-muted shadow-sm")}
                            onClick={() => setViewMode('list')}
                        >
                            <LayoutList className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn("h-7 w-7 p-0", viewMode === 'board' && "bg-muted shadow-sm")}
                            onClick={() => setViewMode('board')}
                        >
                            <KanbanSquare className="h-4 w-4" />
                        </Button>
                    </div>
                    <TodoCreateDialog onTodoCreated={fetchTodos} />
                </div>
            </header>
            <main className="flex-1 overflow-hidden p-4 md:p-6 flex flex-col">
                <div className="mb-6 shrink-0 bg-white dark:bg-gray-950 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <TodoFilters filters={filters} onFilterChange={setFilters} />
                </div>

                <div className="flex-1 overflow-hidden min-h-0">
                    {loading && todos.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">로딩 중...</div>
                    ) : viewMode === 'list' ? (
                        <div className="h-full overflow-y-auto px-1">
                            <TodoList todos={todos} onTodoUpdated={fetchTodos} />
                        </div>
                    ) : (
                        <div className="h-full overflow-hidden">
                            <KanbanBoard todos={todos} onTodoUpdated={fetchTodos} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
