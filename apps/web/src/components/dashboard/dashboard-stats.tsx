'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, CircleDashed, AlertTriangle, Calendar } from "lucide-react"

interface DashboardStatsProps {
    total: number
    completed: number
    highPriority: number
    upcoming: number
}

export function DashboardStats({ total, completed, highPriority, upcoming }: DashboardStatsProps) {
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        전체 할 일
                    </CardTitle>
                    <CircleDashed className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{total}</div>
                    <p className="text-xs text-muted-foreground">
                        현재 등록된 모든 할 일
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        완료율
                    </CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{completionRate}%</div>
                    <p className="text-xs text-muted-foreground">
                        {completed}개 완료됨
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        높은 중요도
                    </CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{highPriority}</div>
                    <p className="text-xs text-muted-foreground">
                        해결되지 않은 중요 항목
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        마감 임박
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{upcoming}</div>
                    <p className="text-xs text-muted-foreground">
                        3일 내 마감 예정
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
