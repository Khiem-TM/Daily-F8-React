import { axiosInstance as http } from "@/apis/axios";
import type {
  LoginSchema,
  RegisterSchema,
  ForgotPasswordSchema,
} from "@/features/auth/auth.schema";

import type { AuthResponse } from "@/types/auth.type";
// Call thẳng schema đã được define tại auth.schema
const authApi = {
  register: (body: RegisterSchema) =>
    http.post<AuthResponse>("/auth/register", body),
  login: (body: LoginSchema) => http.post<AuthResponse>("/auth/login", body),
  logout: () => http.post("/auth/logout"),
  verifyEmail: (token: string) =>
    http.post<AuthResponse>(`/auth/verify-email/${token}`),
  resendVerificationEmail: (email: string) =>
    http.post("/auth/resend-verification-email", { email }),
  forgotPassword: (body: ForgotPasswordSchema) =>
    http.post("/auth/forgot-password", body),
};

// Xuất ra dưới định dạng duy nhất --> Dễ maintain, tái sử dụng cao.
// LoginPage chỉ cần call authApi.login(data) --> là done luôn (an toàn, uy tín và tiện lợi)
export default authApi;
