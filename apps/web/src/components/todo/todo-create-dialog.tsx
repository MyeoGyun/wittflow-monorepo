'use client'

import { useState } from "react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Calendar as CalendarIcon, Plus, Edit2 } from "lucide-react"

import { LabelPicker } from "@/components/label-picker"

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
import { todoApi, Priority, Status } from "@/lib/api"

interface TodoCreateDialogProps {
    onTodoCreated: () => void
}

export function TodoCreateDialog({ onTodoCreated }: TodoCreateDialogProps) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState<Priority>("MEDIUM")
    const [status, setStatus] = useState<Status>("TODO")
    const [date, setDate] = useState<Date>()
    const [labelIds, setLabelIds] = useState<number[]>([])
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return

        setLoading(true)
        try {
            await todoApi.create({
                title,
                description,
                priority,
                status,
                due_date: date ? date.toISOString() : null,
                label_ids: labelIds
            })
            setOpen(false)
            resetForm()
            onTodoCreated()
        } catch (error) {
            console.error("Failed to create todo", error)
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setTitle("")
        setDescription("")
        setPriority("MEDIUM")
        setStatus("TODO")
        setDate(undefined)
        setLabelIds([])
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> 할 일 추가
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="hidden">
                    <DialogTitle>새로운 할 일</DialogTitle>
                    <DialogDescription>
                        할 일을 추가하고 체계적으로 관리하세요.
                    </DialogDescription>
                </DialogHeader>
                <form id="create-todo-form" onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
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
                <DialogFooter>
                    <Button type="submit" form="create-todo-form" disabled={!title.trim() || loading}>
                        {loading ? "저장 중..." : "저장"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
