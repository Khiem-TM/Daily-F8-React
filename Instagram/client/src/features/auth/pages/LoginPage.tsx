import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginSchema } from "../auth.schema";
import { useMutation } from "@tanstack/react-query";
import authApi from "@/apis/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import AuthLayout from "@/layouts/AuthLayout";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  const emailValue = watch("email");
  const passwordValue = watch("password");
  const isFormEmpty = !emailValue?.trim() || !passwordValue?.trim();

  const loginMutation = useMutation({
    mutationFn: (body: LoginSchema) => authApi.login(body),
    onSuccess: (res) => {
      const { user, tokens } = res.data.data;
      setAuth({
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
      toast.success("Đăng nhập thành công");
      navigate("/");
    },
    onError: () => {
      toast.error("Đã có lỗi xảy ra");
    },
  });

  const onSubmit = (data: LoginSchema) => {
    loginMutation.mutate(data);
  };

  return (
    <AuthLayout showShowcase={true}>
      <div className="w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-6 text-white/90">
          Log into Instagram
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1">
            <input
              {...register("email")}
              type="text"
              placeholder="Mobile number, username or email"
              className="w-full rounded-xl border border-white/10 bg-[#0f1419] px-4 py-3.5 text-sm text-white outline-none focus:border-white/25 focus:bg-[#0f1419]/80 transition-all placeholder:text-gray-500 shadow-sm"
            />
            {errors.email && (
              <p className="text-red-400 text-xs pl-1 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full rounded-xl border border-white/10 bg-[#0f1419] px-4 py-3.5 text-sm text-white outline-none focus:border-white/25 focus:bg-[#0f1419]/80 transition-all placeholder:text-gray-500 shadow-sm"
            />
            {errors.password && (
              <p className="text-red-400 text-xs pl-1 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={loginMutation.isPending || isFormEmpty}
            className="w-full bg-[#0064e0] hover:bg-[#0058c7] text-white font-semibold h-12 rounded-full text-[15px] mt-3 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
          >
            {loginMutation.isPending ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <div className="mt-5 text-center">
          <Link
            to="/forgot-password"
            className="text-white/70 hover:text-white text-sm transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <div className="mt-6 space-y-3">
          <button className="w-full flex items-center justify-center gap-2 border border-white/10 hover:bg-white/5 text-white font-medium py-3 rounded-full transition-all text-sm shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Log in with Facebook
          </button>

          <Link
            to="/register"
            className="w-full flex items-center justify-center border border-[#00a400]/50 bg-[#00a400]/10 hover:bg-[#00a400]/20 text-[#42b72a] font-semibold py-3 rounded-full transition-all text-sm shadow-sm"
          >
            Create new account
          </Link>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="flex items-center gap-1 text-gray-500">
            <svg className="w-6 h-6" viewBox="0 0 100 20" fill="currentColor">
              <path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" />
              <path d="M50 0c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10S55.5 0 50 0zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" />
              <path d="M30 10l-5-10h-4l7 14 7-14h-4z" />
            </svg>
            <span className="font-semibold text-sm ml-1">Meta</span>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
