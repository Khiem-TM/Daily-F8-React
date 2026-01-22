import { z } from "zod";

export const contactInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  age: z.coerce.number().min(18, "Must be at least 18").max(120, "Invalid age"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
});

export const usernameSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .refine((value) => {
      return true;
    }, "Username should include your first name"),
});

export const wizardSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  age: z.coerce.number().min(18, "Must be at least 18").max(120, "Invalid age"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  username: z.string().min(1, "Username is required"),
});
