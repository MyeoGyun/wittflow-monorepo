'use client'

import { useState, useEffect } from "react"
import { DragDropContext, DropResult } from "@hello-pangea/dnd"

import { Todo, Status, todoApi } from "@/lib/api"
import { KanbanColumn } from "./kanban-column"
import { TodoEditDialog } from "@/components/todo/todo-edit-dialog"

interface KanbanBoardProps {
    todos: Todo[]
    onTodoUpdated: () => void
}

const COLUMNS: { id: Status; title: string }[] = [
    { id: 'TODO', title: '예정' },
    { id: 'IN_PROGRESS', title: '진행 중' },
    { id: 'DONE', title: '완료' },
]

export function KanbanBoard({ todos, onTodoUpdated }: KanbanBoardProps) {
    const [localTodos, setLocalTodos] = useState<Todo[]>(todos)
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

    useEffect(() => {
        setLocalTodos(todos)
    }, [todos])

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result

        if (!destination) return

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return
        }

        const newStatus = destination.droppableId as Status
        const movedTodoId = parseInt(draggableId)

        // Optimistic update
        const newTodos = Array.from(localTodos)
        const movedTodoIndex = newTodos.findIndex(t => t.id === movedTodoId)
        if (movedTodoIndex === -1) return

        const movedTodo = { ...newTodos[movedTodoIndex], status: newStatus }

        // Remove from old position
        newTodos.splice(movedTodoIndex, 1)

        // Calculate insert position
        // We need to find the correct index in the *global* list based on the *column* index
        // This is tricky because destination.index is relative to the column 
        // But our state is a flat list.

        // Filter todos by destination status to emulate the column
        const columnTodos = newTodos.filter(t => t.status === newStatus)
        // Insert into the column list
        columnTodos.splice(destination.index, 0, movedTodo)

        // Reconstruct Global List?
        // Actually, just for optimistic UI, we can just update the status and maybe `order` roughly.
        // But since we rely on `order` field for sorting in backend, 
        // we should calculate the new 'order' value and send it to backend.

        // Let's assume the order is just the index for now.
        // Backend `reorder` logic takes `order` (index) and shifts things.

        // For local state, let's just update the status and re-render.
        // The optimistic UI for reordering within a column using a flat list state is hard 
        // without complex logic. 
        // A simpler way: Update local state to reflect the move visually (by updating `order` field locally).

        // Let's calculate the new order value.
        // Logic: 
        // If moved to index 0, order = 0.
        // If moved to index N, order = N.
        // We will send this index to backend.

        // However, we need to correctly update `localTodos` so it doesn't flicker.
        // 1. Remove from source.
        // 2. Insert into destination.
        // But `localTodos` is mixed.

        // Let's rely on the fact that `KanbanColumn` filters `localTodos`.
        // To make it appear at the right spot, we need to update the `order` property of the moved item 
        // AND potentially shift others locally? 
        // OR we can just ignore local reordering for a split second until backend confirms? 
        // No, drag needs to be smooth.

        // Better: Split state into columns? 
        // No, single source of truth is better.

        // Let's just update the `status` and call the API. 
        // The list might jump if we don't handle order locally. 
        // Let's implement a simple local reorder: 
        // Just update status and order of the moved item locally.

        movedTodo.order = destination.index // Approximate order

        // Update local state (Optimistic)
        // Note: This is an approximation. Real order management with a flat list requires 
        // shifting all items in the column locally.
        const updatedLocalTodos = localTodos.map(t =>
            t.id === movedTodoId ? { ...t, status: newStatus, order: destination.index } : t
        )

        // Also shift other items in the target column?
        // Checking if we are just moving status or reordering.
        // For V1, simplest optimistic update is just changing status. 
        // Reordering within column might be glitchy without full shift logic. 
        // Let's apply basic status change first.
        setLocalTodos(updatedLocalTodos)

        try {
            await todoApi.reorder(movedTodoId, {
                status: newStatus,
                order: destination.index
            })
            // Refresh from server to get correct orders and normalized data
            onTodoUpdated()
        } catch (error) {
            console.error("Failed to reorder todo", error)
            // Revert changes on error
            setLocalTodos(todos)
        }
    }

    const columnsTodos = (status: Status) => {
        return localTodos
            .filter(todo => todo.status === status)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
    }

    return (
        <div className="h-full overflow-x-auto pb-4">
            <div className="flex h-full gap-6 min-w-fit px-4">
                <DragDropContext onDragEnd={onDragEnd}>
                    {COLUMNS.map(col => (
                        <KanbanColumn
                            key={col.id}
                            id={col.id}
                            title={col.title}
                            todos={columnsTodos(col.id)}
                            onCardClick={setEditingTodo}
                        />
                    ))}
                </DragDropContext>
            </div>

            {editingTodo && (
                <TodoEditDialog
                    todo={editingTodo}
                    open={true}
                    onOpenChange={(open) => {
                        if (!open) setEditingTodo(null)
                    }}
                    onTodoUpdated={() => {
                        setEditingTodo(null)
                        onTodoUpdated()
                    }}
                />
            )}

            {/* Hack: The dialog needs to be open. 
                We should probably refactor TodoEditDialog to be controlled or 
                use a wrapper. For now, let's assume we can pass `open={true}` if we refactor, 
                or just create a separate dialog instance for the board.
                
                Actually, the current `TodoEditDialog` has a Trigger. 
                We need a way to open it without a trigger button for the Kanban Card click.
                
                Planned fix: Modify `TodoEditDialog` to accept `open` and `onOpenChange` props.
            */}
        </div>
    )
}
