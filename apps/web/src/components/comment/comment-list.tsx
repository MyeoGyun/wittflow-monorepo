'use client'

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Send, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { commentApi, Comment } from "@/lib/api"
import { cn } from "@/lib/utils"

interface CommentListProps {
    todoId: number
}

export function CommentList({ todoId }: CommentListProps) {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)

    const fetchComments = async () => {
        try {
            const data = await commentApi.getAll(todoId)
            setComments(data)
        } catch (error) {
            console.error("Failed to fetch comments", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchComments()
    }, [todoId])

    const handleCommentAdded = (newComment: Comment) => {
        setComments([newComment, ...comments])
    }

    const handleDelete = async (id: number) => {
        try {
            await commentApi.delete(id)
            setComments(comments.filter(c => c.id !== id))
        } catch (error) {
            console.error("Failed to delete comment", error)
        }
    }

    return (
        <div className="flex flex-col h-[400px]">
            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full pr-4">
                    <div className="space-y-4">
                        {loading ? (
                            <p className="text-center text-muted-foreground py-4">Loading comments...</p>
                        ) : comments.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">아직 댓글이 없습니다.</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3 group">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/avatars/01.png" alt="@user" />
                                        <AvatarFallback>US</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold">User</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {format(new Date(comment.created_at), "PPP p", { locale: ko })}
                                                </span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleDelete(comment.id)}
                                            >
                                                <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                                            </Button>
                                        </div>
                                        <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>
            <div className="pt-4 mt-auto border-t">
                <CommentInput todoId={todoId} onCommentAdded={handleCommentAdded} />
            </div>
        </div>
    )
}

interface CommentInputProps {
    todoId: number
    onCommentAdded: (comment: Comment) => void
}

function CommentInput({ todoId, onCommentAdded }: CommentInputProps) {
    const [content, setContent] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim() || submitting) return

        setSubmitting(true)
        try {
            const newComment = await commentApi.create({
                todo: todoId,
                content: content.trim()
            })
            onCommentAdded(newComment)
            setContent("")
        } catch (error) {
            console.error("Failed to post comment", error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
                placeholder="댓글을 입력하세요..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[40px] max-h-[120px]"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e)
                    }
                }}
            />
            <Button type="submit" size="icon" disabled={!content.trim() || submitting}>
                <Send className="h-4 w-4" />
            </Button>
        </form>
    )
}
