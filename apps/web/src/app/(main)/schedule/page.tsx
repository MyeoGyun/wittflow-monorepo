'use client'

import React, { useState, useEffect } from 'react'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { todoApi, Todo } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { WittflowLogo } from '@/components/wittflow-logo'

export default function SchedulePage() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [todos, setTodos] = useState<Todo[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTodos()
    }, [])

    const fetchTodos = async () => {
        try {
            const data = await todoApi.getAll()
            setTodos(data)
        } catch (error) {
            console.error('Failed to fetch todos', error)
        } finally {
            setLoading(false)
        }
    }

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
    const resetDate = () => setCurrentDate(new Date())

    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }) // Sunday start
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

    const days = eachDayOfInterval({ start: startDate, end: endDate })

    const getTodosForDate = (date: Date) => {
        return todos.filter(todo =>
            todo.due_date && isSameDay(new Date(todo.due_date), date)
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 flex flex-col">
            <div className="max-w-5xl mx-auto w-full space-y-6 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <WittflowLogo className="w-8 h-8" />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">일정 보기</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" onClick={prevMonth}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <h2 className="text-xl font-semibold w-32 text-center text-gray-900 dark:text-gray-100">
                            {format(currentDate, 'yyyy년 M월', { locale: ko })}
                        </h2>
                        <Button variant="outline" size="icon" onClick={nextMonth}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={resetDate} className="ml-2">
                            오늘
                        </Button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <Card className="flex-1 flex flex-col overflow-hidden shadow-sm border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                    {/* Days Header */}
                    <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-800">
                        {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
                            <div key={day} className={`py-3 text-center text-sm font-medium ${idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-gray-500'}`}>
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days Body */}
                    <div className="flex-1 grid grid-cols-7 grid-rows-6 md:grid-rows-5 lg:grid-rows-auto">
                        {days.map((day, dayIdx) => {
                            const dateTodos = getTodosForDate(day)
                            const isCurrentMonth = isSameMonth(day, monthStart)
                            const isToday = isSameDay(day, new Date())

                            return (
                                <div
                                    key={day.toString()}
                                    className={`
                                        min-h-[100px] border-b border-r border-gray-100 dark:border-gray-800 p-2 relative transition-colors
                                        hover:bg-gray-50 dark:hover:bg-gray-800/50
                                        ${!isCurrentMonth ? 'bg-gray-50/50 dark:bg-gray-900/50 text-gray-300' : 'text-gray-900'}
                                    `}
                                >
                                    {/* Date Number */}
                                    <div className={`
                                        text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1
                                        ${isToday ? 'bg-blue-600 text-white' : ''}
                                        ${!isToday && !isCurrentMonth ? 'text-gray-300' : ''}
                                    `}>
                                        {format(day, 'd')}
                                    </div>

                                    {/* Todos List */}
                                    <div className="space-y-1">
                                        {dateTodos.map(todo => (
                                            <motion.div
                                                key={todo.id}
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className={`
                                                    text-xs truncate px-1.5 py-0.5 rounded cursor-pointer
                                                    ${todo.is_completed
                                                        ? 'bg-gray-100 text-gray-500 line-through'
                                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}
                                                `}
                                            >
                                                {todo.title}
                                            </motion.div>
                                        ))}
                                        {/* Placeholder if user wants to add todo directly (future feature) */}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Card>
            </div>
        </div>
    )
}
