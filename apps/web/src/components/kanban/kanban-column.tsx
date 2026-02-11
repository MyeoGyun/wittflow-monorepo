'use client'

import { Droppable } from "@hello-pangea/dnd"
import { MoreHorizontal, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Todo, Status } from "@/lib/api"
import { cn } from "@/lib/utils"
import { KanbanCard } from "./kanban-card"

interface KanbanColumnProps {
    id: Status
    title: string
    todos: Todo[]
    onCardClick: (todo: Todo) => void
    onAddClick?: () => void
}

const statusColors: Record<Status, string> = {
    TODO: "bg-slate-100/80 dark:bg-slate-800/50",
    IN_PROGRESS: "bg-blue-50/80 dark:bg-blue-900/10",
    DONE: "bg-green-50/80 dark:bg-green-900/10",
    ARCHIVED: "bg-gray-50/80 dark:bg-gray-800/50",
}

const headerColors: Record<Status, string> = {
    TODO: "bg-slate-200/50 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
    IN_PROGRESS: "bg-blue-100/50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    DONE: "bg-green-100/50 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    ARCHIVED: "bg-gray-100/50 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
}

export function KanbanColumn({ id, title, todos, onCardClick, onAddClick }: KanbanColumnProps) {
    return (
        <div className={cn("flex flex-col h-full rounded-lg w-80 shrink-0", statusColors[id])}>
            {/* Header */}
            <div className="p-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={cn("rounded-md px-2 font-semibold", headerColors[id])}>
                        {title}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-medium">
                        {todos.length}
                    </span>
                </div>
                <div className="flex gap-1">
                    {onAddClick && (
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onAddClick}>
                            <Plus className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>
            </div>

            {/* Droppable Area */}
            <Droppable droppableId={id}>
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={cn(
                            "flex-1 p-2 overflow-y-auto min-h-[100px]",
                            snapshot.isDraggingOver && "bg-primary/5 dark:bg-primary/10 rounded-md transition-colors"
                        )}
                    >
                        {todos.map((todo, index) => (
                            <KanbanCard
                                key={todo.id}
                                todo={todo}
                                index={index}
                                onClick={() => onCardClick(todo)}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    )
}
