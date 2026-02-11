'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Todo } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"

interface RecentActivityProps {
    recentTodos: Todo[]
}

export function RecentActivity({ recentTodos }: RecentActivityProps) {
    return (
        <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
                <CardTitle>최근 활동</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {recentTodos.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">최근 활동이 없습니다.</p>
                    ) : (
                        recentTodos.slice(0, 5).map((todo) => (
                            <div key={todo.id} className="flex items-center">
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback>{todo.title.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">{todo.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(new Date(todo.updated_at || todo.created_at), { addSuffix: true, locale: ko })}
                                        {todo.is_completed ? " 완료됨" : " 수정됨"}
                                    </p>
                                </div>
                                <div className="ml-auto font-medium">
                                    {todo.is_completed ? (
                                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">완료</Badge>
                                    ) : (
                                        <Badge variant="outline">진행 중</Badge>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
