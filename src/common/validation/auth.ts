import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
});

export const signUpSchema = loginSchema.extend({
  name: z.string(),
  password: z.string().min(8),
});

export type ILogin = z.infer<typeof loginSchema>;
export type ISignUp = z.infer<typeof signUpSchema>;
