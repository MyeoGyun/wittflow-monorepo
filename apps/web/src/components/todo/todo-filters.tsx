'use client'

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Priority, TodoQueryParams, Label, labelApi, Status } from "@/lib/api"
import { useEffect, useState } from "react"

interface TodoFiltersProps {
    filters: TodoQueryParams
    onFilterChange: (filters: TodoQueryParams) => void
}

export function TodoFilters({ filters, onFilterChange }: TodoFiltersProps) {
    const [labels, setLabels] = useState<Label[]>([])

    useEffect(() => {
        const fetchLabels = async () => {
            try {
                const data = await labelApi.getAll()
                setLabels(data)
            } catch (error) {
                console.error("Failed to fetch labels", error)
            }
        }
        fetchLabels()
    }, [])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange({ ...filters, search: e.target.value })
    }

    const handlePriorityChange = (value: string) => {
        const priority = value === "ALL" ? undefined : (value as Priority)
        onFilterChange({ ...filters, priority })
    }

    const handleStatusChange = (value: string) => {
        const status = value === "ALL" ? undefined : (value as Status)
        onFilterChange({ ...filters, status })
    }

    const handleOrderingChange = (value: string) => {
        onFilterChange({ ...filters, ordering: value })
    }

    const handleLabelChange = (value: string) => {
        const labelId = value === "ALL" ? undefined : parseInt(value)
        const newFilters = { ...filters }
        if (labelId) {
            newFilters.labels = [labelId]
        } else {
            delete newFilters.labels
        }
        onFilterChange(newFilters)
    }

    // Simple mock for label filter - in real app would use LabelPicker or MultiSelect
    // For now, let's just stick to basic filters as per request, or we can add a simple input for label search if needed.
    // Given the complexity of adding another picker here, let's hold off on specific label filter UI 
    // until we have a proper MultiSelect component. 
    // But I will add a placeholder or simple text input for label ID if critical, 
    // actually, let's wait for the user to ask for explicit label filtering UI or implement a simple dropdown if easy.
    // Let's implement a simpler "Label" dropdown if we can fetch them.

    // Actually, I'll add a simple input for now to filter by label name if backend supported it, 
    // but backend supports `labels` ID list.
    // Let's skip updating TodoFilters with Label for this specific step to avoid scope creep 
    // and potential bugs without a proper MultiSelect component. 
    // I will focus on CRUD and assignment first.
    // OPTIONAL: Add a "Has Label" checkbox?
    // Let's just return the original component for now, or maybe add a "Labels" placeholder.

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="할 일 검색..."
                    value={filters.search || ""}
                    onChange={handleSearchChange}
                    className="pl-8"
                />
            </div>
            <div className="flex gap-2">
                <Select
                    value={filters.priority || "ALL"}
                    onValueChange={handlePriorityChange}
                >
                    <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="우선순위" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">모든 우선순위</SelectItem>
                        <SelectItem value="HIGH">높음</SelectItem>
                        <SelectItem value="MEDIUM">보통</SelectItem>
                        <SelectItem value="LOW">낮음</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={filters.status || "ALL"}
                    onValueChange={handleStatusChange}
                >
                    <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="상태" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">모든 상태</SelectItem>
                        <SelectItem value="TODO">예정</SelectItem>
                        <SelectItem value="IN_PROGRESS">진행 중</SelectItem>
                        <SelectItem value="DONE">완료</SelectItem>
                        <SelectItem value="ARCHIVED">보관됨</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={filters.ordering || "-created_at"}
                    onValueChange={handleOrderingChange}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="정렬" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="-created_at">최신순</SelectItem>
                        <SelectItem value="created_at">오래된순</SelectItem>
                        <SelectItem value="due_date">마감일 임박순</SelectItem>
                        <SelectItem value="-priority">중요도순</SelectItem>
                        <SelectItem value="priority">중요도 낮은순</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
