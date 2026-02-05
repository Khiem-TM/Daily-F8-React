import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types/user.type";

// create 1 global state for save, control automatic all token (access and refreshToken) --> to call other API
// fix bug F5

// Define authState
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  // 2 move là đăng nhập và đăng xuất sẽ được handle bởi 2 hàm dưới 
  setAuth: (data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  }) => void;
  logout: () => void;
}

// persit help do automatic updating all data to  localStorage if we change sth :V 
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      // login done
      setAuth: (data) => {
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
      },

      // logout done
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        });
        localStorage.removeItem("auth-storage"); // Xoá dữ liệu trong localStorage
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Tóm lại đống này giúp ta xử lý việc lưu trữ tạm thời 2 chức năng cơ bản là đăng nhập và đăng xuất (web state saving)