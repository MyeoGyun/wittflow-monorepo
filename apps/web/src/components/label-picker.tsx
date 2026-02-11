'use client'

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Label, labelApi } from "@/lib/api"
import { LabelBadge } from "./label-badge"
import { toast } from "sonner" // Assuming sonner or toast exists, if not console.log

interface LabelPickerProps {
    selectedLabelIds: number[]
    onLabelsChange: (labelIds: number[]) => void
    className?: string
}

export function LabelPicker({ selectedLabelIds, onLabelsChange, className }: LabelPickerProps) {
    const [open, setOpen] = React.useState(false)
    const [labels, setLabels] = React.useState<Label[]>([])
    const [inputValue, setInputValue] = React.useState("")

    React.useEffect(() => {
        fetchLabels()
    }, [])

    const fetchLabels = async () => {
        try {
            const data = await labelApi.getAll()
            setLabels(data)
        } catch (error) {
            console.error("Failed to fetch labels", error)
        }
    }

    const toggleLabel = (labelId: number) => {
        const newSelectedIds = selectedLabelIds.includes(labelId)
            ? selectedLabelIds.filter(id => id !== labelId)
            : [...selectedLabelIds, labelId]
        onLabelsChange(newSelectedIds)
    }

    const createLabel = async () => {
        if (!inputValue.trim()) return
        try {
            const newLabel = await labelApi.create({
                name: inputValue,
                color: getRandomColor()
            })
            setLabels([...labels, newLabel])
            onLabelsChange([...selectedLabelIds, newLabel.id])
            setInputValue("")
        } catch (error) {
            console.error("Failed to create label", error)
        }
    }

    const getRandomColor = () => {
        const colors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e']
        return colors[Math.floor(Math.random() * colors.length)]
    }

    const selectedLabels = labels.filter(label => selectedLabelIds.includes(label.id))

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between h-auto min-h-10 py-2", className)}
                >
                    {selectedLabels.length > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                            {selectedLabels.map(label => (
                                <LabelBadge key={label.id} label={label} />
                            ))}
                        </div>
                    ) : (
                        "라벨 선택..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="라벨 검색..." value={inputValue} onValueChange={setInputValue} />
                    <CommandList>
                        <CommandEmpty>
                            <div className="p-2 text-sm text-center text-muted-foreground">
                                {inputValue ? "검색 결과가 없습니다." : "새로운 라벨 이름을 입력하세요."}
                            </div>
                        </CommandEmpty>
                        <CommandGroup heading="Labels">
                            {labels.map((label) => (
                                <CommandItem
                                    key={label.id}
                                    value={label.name}
                                    onSelect={() => toggleLabel(label.id)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedLabelIds.includes(label.id) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{ backgroundColor: label.color }}
                                    />
                                    {label.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        {inputValue && !labels.some(l => l.name.toLowerCase() === inputValue.toLowerCase()) && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        value={`create ${inputValue}`}
                                        onSelect={createLabel}
                                        className="cursor-pointer"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        "{inputValue}" 생성
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
