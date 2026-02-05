import type { User } from "./user.type";

// config kiểu data cho đăng ký
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  fullname: string;
}

// config kiểu data cho đăng nhập
export interface LoginRequest {
  email: string;
  password: string;
}

// config kiểu data cho đăng nhập
export interface AuthResponse {
  message: string;
  data: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
  success: boolean;
}

// config kiểu data cho refresh token
export interface RefreshTokenData {
  accessToken: string;
  refreshToken: string;
}
