'use client'

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Calendar as CalendarIcon, Edit2 } from "lucide-react"

import { LabelPicker } from "@/components/label-picker"
import { CommentList } from "@/components/comment/comment-list"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { todoApi, Priority, Todo, Status } from "@/lib/api"

interface TodoEditDialogProps {
    todo: Todo
    onTodoUpdated: () => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function TodoEditDialog({ todo, onTodoUpdated, open: controlledOpen, onOpenChange: controlledOnOpenChange }: TodoEditDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)

    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? controlledOnOpenChange : setInternalOpen

    if (!setOpen) return null // Should not happen if types are correct or defaulted
    const [title, setTitle] = useState(todo.title)
    const [description, setDescription] = useState(todo.description)
    const [priority, setPriority] = useState<Priority>(todo.priority)
    const [status, setStatus] = useState<Status>(todo.status || 'TODO') // Fallback for old data if any
    const [date, setDate] = useState<Date | undefined>(todo.due_date ? new Date(todo.due_date) : undefined)
    const [labelIds, setLabelIds] = useState<number[]>(todo.labels ? todo.labels.map(l => l.id) : [])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open) {
            setTitle(todo.title)
            setDescription(todo.description)
            setPriority(todo.priority)
            setStatus(todo.status || 'TODO')
            setDate(todo.due_date ? new Date(todo.due_date) : undefined)
            setLabelIds(todo.labels ? todo.labels.map(l => l.id) : [])
        }
    }, [open, todo])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return

        setLoading(true)
        try {
            await todoApi.update(todo.id, {
                title,
                description,
                priority,
                status,
                due_date: date ? date.toISOString() : null,
                label_ids: labelIds
            })
            setOpen(false)
            onTodoUpdated()
        } catch (error) {
            console.error("Failed to update todo", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {!isControlled && (
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-500">
                        <Edit2 className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="hidden">
                    <DialogTitle>할 일 수정</DialogTitle>
                    <DialogDescription>내용을 수정합니다.</DialogDescription>
                </DialogHeader>

                <form id="edit-todo-form" onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
                    {/* Header Section: Title & Description */}
                    <div className="space-y-4">
                        <Input
                            id="title"
                            placeholder="할 일 제목을 입력하세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-xl font-semibold border-none shadow-none px-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50"
                        />
                        <Textarea
                            id="description"
                            placeholder="상세 설명을 입력하세요..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="resize-none border-none shadow-none px-0 min-h-[80px] focus-visible:ring-0 text-muted-foreground placeholder:text-muted-foreground/50"
                        />
                    </div>

                    {/* Properties Section - Property List Style */}
                    <div className="space-y-1">
                        {/* Status */}
                        <div className="grid grid-cols-[100px_1fr] items-center h-10">
                            <span className="text-sm text-muted-foreground flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                상태
                            </span>
                            <Select value={status} onValueChange={(v: Status) => setStatus(v)}>
                                <SelectTrigger className="h-8 border-0 shadow-none bg-transparent hover:bg-muted/50 px-2 -ml-2 w-auto min-w-[120px] justify-start text-sm">
                                    <SelectValue placeholder="상태" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TODO">예정</SelectItem>
                                    <SelectItem value="IN_PROGRESS">진행 중</SelectItem>
                                    <SelectItem value="DONE">완료</SelectItem>
                                    <SelectItem value="ARCHIVED">보관됨</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Priority */}
                        <div className="grid grid-cols-[100px_1fr] items-center h-10">
                            <span className="text-sm text-muted-foreground flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${priority === 'HIGH' ? 'bg-red-500' :
                                        priority === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                                    }`} />
                                우선순위
                            </span>
                            <Select value={priority} onValueChange={(v: Priority) => setPriority(v)}>
                                <SelectTrigger className="h-8 border-0 shadow-none bg-transparent hover:bg-muted/50 px-2 -ml-2 w-auto min-w-[120px] justify-start text-sm">
                                    <SelectValue placeholder="우선순위" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="HIGH">높음</SelectItem>
                                    <SelectItem value="MEDIUM">보통</SelectItem>
                                    <SelectItem value="LOW">낮음</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Due Date */}
                        <div className="grid grid-cols-[100px_1fr] items-center h-10">
                            <span className="text-sm text-muted-foreground flex items-center gap-2">
                                <CalendarIcon className="h-3.5 w-3.5" />
                                마감일
                            </span>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"ghost"}
                                        className={cn(
                                            "h-8 border-0 shadow-none bg-transparent hover:bg-muted/50 px-2 -ml-2 w-full justify-start text-sm font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        {date ? format(date, "PPP", { locale: ko }) : <span>날짜 없음</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        locale={ko}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Labels */}
                        <div className="grid grid-cols-[100px_1fr] items-start py-2 min-h-10">
                            <span className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                                <Edit2 className="h-3.5 w-3.5" />
                                라벨
                            </span>
                            <LabelPicker
                                selectedLabelIds={labelIds}
                                onLabelsChange={setLabelIds}
                                className="border-0 shadow-none bg-transparent hover:bg-muted/50 px-2 -ml-2 w-full justify-start min-h-8 h-auto py-1"
                            />
                        </div>
                    </div>
                </form>

                <Separator className="my-2" />

                <div className="py-2 space-y-4">
                    <h4 className="text-sm font-semibold">활동 기록</h4>
                    <CommentList todoId={todo.id} />
                </div>

                <DialogFooter>
                    <Button type="submit" form="edit-todo-form" disabled={!title.trim() || loading}>
                        {loading ? "저장 중..." : "저장"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
