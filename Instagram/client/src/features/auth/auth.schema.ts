import z from "zod";

// Mục đích chính là xuất schema cho việc gọi tại api

// Form đăng ký
export const registerSchema = z
  .object({
    email: z.string().email("Email không hợp lệ"),
    username: z.string().min(3),
    fullname: z.string().min(3),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

// Form đăng nhập
export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

// Form quên mật khẩu
export const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

// Sinh type tự động từ schema
export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
