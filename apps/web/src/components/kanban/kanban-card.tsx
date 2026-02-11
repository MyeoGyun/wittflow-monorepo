'use client'

import { Draggable } from "@hello-pangea/dnd"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Calendar } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Todo, Priority } from "@/lib/api"
import { LabelBadge } from "@/components/label-badge"

interface KanbanCardProps {
    todo: Todo
    index: number
    onClick: () => void
}

const priorityColors: Record<Priority, string> = {
    HIGH: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300",
    MEDIUM: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-300",
    LOW: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-300",
}

const priorityLabels: Record<Priority, string> = {
    HIGH: "높음",
    MEDIUM: "보통",
    LOW: "낮음",
}

export function KanbanCard({ todo, index, onClick }: KanbanCardProps) {
    return (
        <Draggable draggableId={String(todo.id)} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-3"
                    onClick={onClick}
                >
                    <Card
                        className={cn(
                            "cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow",
                            snapshot.isDragging && "shadow-lg rotate-2 opacity-90 ring-2 ring-primary/20",
                            todo.status === 'DONE' && "opacity-60 bg-gray-50",
                        )}
                    >
                        <CardContent className="p-3 space-y-2">
                            <div className="flex justify-between items-start gap-2">
                                <span className={cn("text-sm font-medium leading-tight", todo.status === 'DONE' && "line-through text-muted-foreground")}>
                                    {todo.title}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-1">
                                <Badge variant="secondary" className={cn("text-[10px] px-1 py-0 h-5 font-normal", priorityColors[todo.priority])}>
                                    {priorityLabels[todo.priority]}
                                </Badge>
                                {todo.labels?.map(label => (
                                    <LabelBadge key={label.id} label={label} />
                                ))}
                            </div>

                            {todo.due_date && (
                                <div className="flex items-center text-xs text-muted-foreground pt-1">
                                    <Calendar className="mr-1 h-3 w-3" />
                                    {format(new Date(todo.due_date), "MM.dd", { locale: ko })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </Draggable>
    )
}
