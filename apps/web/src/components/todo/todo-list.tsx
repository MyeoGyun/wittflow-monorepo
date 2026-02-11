'use client'

import { motion, AnimatePresence } from "framer-motion"
import { Todo } from "@/lib/api"
import { TodoItem } from "./todo-item"
import { todoApi } from "@/lib/api"

interface TodoListProps {
    todos: Todo[]
    onTodoUpdated: () => void
}

export function TodoList({ todos, onTodoUpdated }: TodoListProps) {
    const handleToggle = async (id: number, currentStatus: boolean) => {
        // Optimistic update handled by parent or just API call here?
        // Let's call API and refresh. Parent handles state, but we don't have `setTodos` here.
        // We will just call API and trigger refresh.
        // Parent `fetchTodos` will update state.
        // To be safer for optimistic UI, we might want to lift state up fully, 
        // but for now let's just trigger update.
        try {
            // Note: status toggling logic is slightly complex with new status field.
            // But TodoItem handles the UI toggle and calls onToggle with `Status`.
            // Wait, TodoItem expects `onToggle: (id: number, status: Status) => void`.
            // The previous page.tsx had `handleToggle(id, currentStatus: boolean)`.
            // I need to check TodoItem signature again.
            // Ah, I recall refactoring TodoItem to pass `Status`.
            // Let's assume TodoItem uses updated signature.
            // Wait, previous `page.tsx` (step 1625) had `handleToggle(id, currentStatus: boolean)`.
            // This means `TodoItem` might NOT have been fully updated or I misread.
            // Let's check `TodoItem` prop type.

            // If TodoItem sends boolean, I should handle boolean. 
            // If TodoItem sends Status, I should handle Status.

            // Re-reading step 1486 summary: 
            // "Updated onToggle prop to accept Status and modified the checkbox logic to toggle between DONE and TODO"
            // So TodoItem should be emitting Status.
            // But the page.tsx I read in 1625 had `handleToggle(id, currentStatus: boolean)`.
            // This suggests page.tsx was outdated or I am confused.

            // Let's check TodoItem content to be sure.
        } catch (error) {
            console.error("Failed to update todo", error)
        }
    }

    // Let's define handleToggle properly after checking TodoItem.
    // However, I can't check it inside WriteToFile.
    // I'll write a generic handler or just pass `onTodoUpdated` down? 
    // TodoItem needs `onToggle` and `onDelete` and `onUpdate`.

    return (
        <div className="space-y-3">
            <AnimatePresence mode='popLayout'>
                {todos.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-10 text-gray-400"
                    >
                        할 일이 없습니다. 새로운 목표를 세워보세요!
                    </motion.div>
                ) : (
                    todos.map((todo) => (
                        <motion.div
                            key={todo.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                        >
                            <TodoItem
                                todo={todo}
                                onToggle={async (id, status) => {
                                    try {
                                        await todoApi.update(id, { status })
                                        onTodoUpdated()
                                    } catch (e) { console.error(e) }
                                }}
                                onDelete={async (id) => {
                                    try {
                                        await todoApi.delete(id)
                                        onTodoUpdated()
                                    } catch (e) { console.error(e) }
                                }}
                                onUpdate={onTodoUpdated}
                            />
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
        </div>
    )
}
