'use client'

import { useTheme } from "next-themes"
import { Monitor, Moon, Sun } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">설정</h2>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>테마 설정</CardTitle>
                        <CardDescription>
                            애플리케이션의 외관을 선택하세요.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            defaultValue={theme}
                            onValueChange={(value: string) => setTheme(value)}
                            className="grid max-w-md grid-cols-1 gap-8 pt-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="light" id="light" className="peer sr-only" />
                                <Label
                                    htmlFor="light"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer w-full"
                                >
                                    <Sun className="mb-3 h-6 w-6" />
                                    <span>라이트 모드</span>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                                <Label
                                    htmlFor="dark"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer w-full"
                                >
                                    <Moon className="mb-3 h-6 w-6" />
                                    <span>다크 모드</span>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="system" id="system" className="peer sr-only" />
                                <Label
                                    htmlFor="system"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer w-full"
                                >
                                    <Monitor className="mb-3 h-6 w-6" />
                                    <span>시스템 설정</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>계정 정보</CardTitle>
                        <CardDescription>
                            현재 로그인된 사용자 정보입니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label>이름</Label>
                            <div className="text-sm font-medium">User</div>
                        </div>
                        <div className="space-y-1">
                            <Label>이메일</Label>
                            <div className="text-sm font-medium text-muted-foreground">guest@wittflow.com</div>
                        </div>
                        <Button variant="outline" disabled className="w-full mt-4">
                            프로필 수정 (준비 중)
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
