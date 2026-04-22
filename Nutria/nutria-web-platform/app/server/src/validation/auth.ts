import { z } from 'zod';

export const RegisterBody = z.object({
  email: z.string().email().max(320),
  password: z.string().min(8).max(200),
  householdName: z.string().min(1).max(120).optional(),
});

export const LoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type RegisterBody = z.infer<typeof RegisterBody>;
export type LoginBody = z.infer<typeof LoginBody>;
