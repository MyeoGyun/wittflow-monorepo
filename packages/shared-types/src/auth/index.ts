import { z } from 'zod';

export const LoginRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const RegisterRequestSchema = z
    .object({
        email: z.string().email(),
        username: z.string().min(2),
        password: z.string().min(6),
        confirmPassword: z.string().min(6),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
