import { useMutation } from "@tanstack/react-query";
import authApi from "@/apis/auth.api";
import { useAuthStore } from "@/store/auth.store";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      const { user, tokens } = res.data.data;
      setAuth({
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => logout(),
  });
};
