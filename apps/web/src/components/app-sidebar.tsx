'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, CheckSquare, Settings, LogOut, Menu, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WittflowLogo } from "@/components/wittflow-logo"
import { useState } from "react"

interface SidebarItem {
    title: string
    href: string
    icon: any
    disabled?: boolean
}

const sidebarItems: SidebarItem[] = [
    {
        title: "대시보드",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "할 일",
        href: "/todo",
        icon: CheckSquare,
    },
    {
        title: "일정 보기",
        href: "/schedule",
        icon: Calendar,
    },
    {
        title: "설정",
        href: "/settings",
        icon: Settings,
    },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function AppSidebar({ className }: SidebarProps) {
    const pathname = usePathname()

    return (
        <div className={cn("pb-12 h-screen border-r bg-white dark:bg-gray-950", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <Link href="/" className="flex items-center pl-2 mb-8">
                        <WittflowLogo className="w-8 h-8 mr-2" />
                        <h2 className="text-xl font-bold tracking-tight">
                            Wittflow
                        </h2>
                    </Link>
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Button
                                key={item.href}
                                variant={pathname === item.href ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start",
                                    pathname === item.href && "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
                                )}
                                asChild
                                disabled={item.disabled}
                            >
                                <Link href={item.href}>
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* User Profile Section (Fixed at bottom) */}
            <div className="absolute bottom-4 left-0 w-full px-4">
                <Separator className="mb-4" />
                <div className="flex items-center gap-3 px-2">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="/placeholder-user.jpg" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-none truncate">User</p>
                        <p className="text-xs text-muted-foreground truncate">guest@wittflow.com</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto">
                        <LogOut className="h-4 w-4" />
                        <span className="sr-only">Log out</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}

// Mobile Sidebar (Sheet)
export function MobileSidebar() {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
                <AppSidebar className="border-none w-full" />
            </SheetContent>
        </Sheet>
    )
}
