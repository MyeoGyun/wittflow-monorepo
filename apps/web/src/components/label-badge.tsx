import { Badge } from "@/components/ui/badge"
import { Label } from "@/lib/api"
import { cn } from "@/lib/utils"

interface LabelBadgeProps {
    label: Label
    className?: string
}

export function LabelBadge({ label, className }: LabelBadgeProps) {
    return (
        <Badge
            variant="outline"
            className={cn("text-xs font-normal border-0 px-2 py-0.5", className)}
            style={{
                backgroundColor: `${label.color}20`, // 20% opacity
                color: label.color,
            }}
        >
            {label.name}
        </Badge>
    )
}
