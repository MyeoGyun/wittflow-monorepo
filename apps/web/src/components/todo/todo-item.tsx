'use client'

import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Calendar, Trash2, Edit2, MessageCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Todo, Priority, Status } from "@/lib/api"
import { TodoEditDialog } from "./todo-edit-dialog"
import { LabelBadge } from "@/components/label-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface TodoItemProps {
    todo: Todo
    onToggle: (id: number, status: Status) => void
    onDelete: (id: number) => void
    onUpdate: () => void
}

const statusColors: Record<Status, string> = {
    TODO: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
    IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    DONE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    ARCHIVED: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
}

const statusLabels: Record<Status, string> = {
    TODO: "예정",
    IN_PROGRESS: "진행 중",
    DONE: "완료",
    ARCHIVED: "보관됨",
}

const priorityColors: Record<Priority, string> = {
    HIGH: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-100/80",
    MEDIUM: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 hover:bg-yellow-100/80",
    LOW: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-100/80",
}

const priorityLabels: Record<Priority, string> = {
    HIGH: "높음",
    MEDIUM: "보통",
    LOW: "낮음",
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
    return (
        <Card className={cn("group transition-all hover:shadow-md", todo.status === 'DONE' && "opacity-60 bg-gray-50 dark:bg-gray-900/50")}>
            <CardContent className="p-4 flex items-start gap-4">
                <Checkbox
                    checked={todo.status === 'DONE'}
                    onCheckedChange={(checked) => onToggle(todo.id, checked ? 'DONE' : 'TODO')}
                    className="mt-1"
                />

                <div className="flex-1 min-w-0 space-y-1">
                    {todo.labels && todo.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-1">
                            {todo.labels.map(label => (
                                <LabelBadge key={label.id} label={label} />
                            ))}
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <span className={cn("font-medium truncate", todo.status === 'DONE' && "line-through text-muted-foreground")}>
                            {todo.title}
                        </span>
                        <Badge variant="secondary" className={cn("text-xs font-normal border-0", statusColors[todo.status])}>
                            {statusLabels[todo.status]}
                        </Badge>
                        <Badge variant="secondary" className={cn("text-xs font-normal border-0", priorityColors[todo.priority])}>
                            {priorityLabels[todo.priority]}
                        </Badge>
                    </div>

                    {todo.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {todo.description}
                        </p>
                    )}

                    {todo.due_date && (
                        <div className="flex items-center text-xs text-blue-500 mt-1.5">
                            <Calendar className="mr-1 h-3 w-3" />
                            {format(new Date(todo.due_date), "PPP", { locale: ko })}
                        </div>
                    )}
                </div>

                {/* Latest Comments Section */}
                {todo.latest_comments && todo.latest_comments.length > 0 && (
                    <div className="hidden md:flex flex-col gap-3 w-72 border-l pl-4 ml-4">
                        <div className="flex items-center gap-1 mb-1">
                            <span className="text-xs font-semibold text-muted-foreground">최신 활동</span>
                            {todo.comments_count ? (
                                <div className="flex items-center text-xs text-muted-foreground">
                                    <MessageCircle className="mx-1 h-3 w-3" />
                                    <span>{todo.comments_count}</span>
                                </div>
                            ) : null}
                        </div>
                        {todo.latest_comments.map(comment => (
                            <div key={comment.id} className="flex gap-3 items-start">
                                <Avatar className="h-6 w-6 mt-0.5">
                                    <AvatarFallback className="text-[10px]">US</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold leading-none">User</span>
                                        <span className="text-[10px] text-muted-foreground align-bottom pt-0.5">
                                            {format(new Date(comment.created_at), "yyyy년 M월 d일 HH:mm", { locale: ko })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-snug break-all">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <TodoEditDialog todo={todo} onTodoUpdated={onUpdate} />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    이 작업은 되돌릴 수 없습니다.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>취소</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete(todo.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    삭제
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    )
}
