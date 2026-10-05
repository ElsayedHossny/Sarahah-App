import { z } from "zod";

export const loginSchema = z.strictObject({
  email: z.email(),
  password: z.coerce.string().min(6).max(16),
});

export const registerSchema = loginSchema
  .extend({
    firstName: z.string().min(3).max(30),
    lastName: z.string().min(3).max(30),
    gender: z.literal(["Male", "Female", "other"]),
    age: z.number().min(16).max(100),
    profilePicture: z.string(),
    phone: z.e164(), //e164 => Egyption phone +20
    role: z.literal(["user", "admin"]).default("user"),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      return data.password == data.confirmPassword;
    },
    {
      message: "password and confirmPassword not matcheded",
      path: ["confirmPassword"],
    },
  );

export const login = z.object({
  // must be object only because i can send body only or any thing only
  body: loginSchema,
  // for ex
  // query: z.strictObject({
  //   lang: z.enum(["EN", "AR"]).default("EN"),
  // }),
});
export const register = z.object({
  body: registerSchema,
});
