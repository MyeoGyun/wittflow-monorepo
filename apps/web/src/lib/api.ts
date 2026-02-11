import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED';

export interface Label {
    id: number;
    name: string;
    color: string;
}

export interface Todo {
    id: number;
    title: string;
    description: string;
    is_completed: boolean; // Deprecated, use status
    status: Status;
    priority: Priority;
    order?: number;
    due_date: string | null;
    labels: Label[];
    created_at: string;
    updated_at: string;
    latest_comments?: Comment[];
    comments_count?: number;
}

export interface TodoQueryParams {
    search?: string;
    ordering?: string;
    priority?: Priority;
    status?: Status;
    is_completed?: boolean;
    labels?: number[]; // Filter by label IDs
}

export const todoApi = {
    getAll: async (params?: TodoQueryParams) => {
        const response = await api.get<Todo[]>('/todos/', { params });
        return response.data;
    },
    create: async (data: {
        title: string;
        description?: string;
        priority?: Priority;
        status?: Status;
        due_date?: string | null;
        label_ids?: number[];
    }) => {
        const response = await api.post<Todo>('/todos/', data);
        return response.data;
    },
    update: async (id: number, data: Partial<Todo> & { label_ids?: number[] }) => {
        const response = await api.patch<Todo>(`/todos/${id}/`, data);
        return response.data;
    },
    reorder: async (id: number, data: { status: Status; order: number }) => {
        const response = await api.patch<Todo>(`/todos/${id}/reorder/`, data);
        return response.data;
    },
    delete: async (id: number) => {
        await api.delete(`/todos/${id}/`);
    },
};

export const labelApi = {
    getAll: async () => {
        const response = await api.get<Label[]>('/labels/');
        return response.data;
    },
    create: async (data: { name: string; color?: string }) => {
        const response = await api.post<Label>('/labels/', data);
        return response.data;
    },
    delete: async (id: number) => {
        await api.delete(`/labels/${id}/`);
    },
};

export interface Comment {
    id: number;
    todo: number;
    content: string;
    created_at: string;
}

export const commentApi = {
    getAll: async (todoId: number) => {
        const response = await api.get<Comment[]>('/comments/', { params: { todo: todoId } });
        return response.data;
    },
    create: async (data: { todo: number; content: string }) => {
        const response = await api.post<Comment>('/comments/', data);
        return response.data;
    },
    delete: async (id: number) => {
        await api.delete(`/comments/${id}/`);
    },
};
