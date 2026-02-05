import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { registerSchema, type RegisterSchema } from "../auth.schema";
import { useMutation } from "@tanstack/react-query";
import authApi from "@/apis/auth.api";
import { toast } from "sonner";
import AuthLayout from "@/layouts/AuthLayout";

export default function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: (body: RegisterSchema) => authApi.register(body),
    onSuccess: (_res, variables) => {
      toast.success(
        "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
      );
      // Navigate to check email page with email in state
      navigate("/check-email", { state: { email: variables.email } });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra");
    },
  });

  const onSubmit = (data: RegisterSchema) => {
    registerMutation.mutate(data);
  };

  return (
    <AuthLayout showShowcase={false}>
      <div className="w-full max-w-100 border border-gray-800 rounded-sm bg-black p-8">
        <div className="mt-12 flex justify-center mb-4">
          <div className="flex items-center gap-1 text-gray-500">
            <span className="text-xl">∞</span>
            <span className="font-semibold text-sm">Meta</span>
          </div>
        </div>

        <h2 className="text-lg font-bold text-center mb-2">
          Bắt đầu trên Instagram
        </h2>
        <p className="text-center text-gray-400 text-sm mb-6">
          Đăng ký để xem ảnh và video từ bạn bè.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <input
              {...register("email")}
              type="text"
              placeholder="Số di động hoặc email"
              className="w-full rounded-xl border border-gray-700 bg-[#121212] px-4 py-3.5 text-sm text-white outline-none focus:border-gray-500 transition-all placeholder:text-gray-500"
            />
            {errors.email && (
              <p className="text-red-500 text-xs pl-1 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <input
              {...register("password")}
              type="password"
              placeholder="Mật khẩu"
              className="w-full rounded-xl border border-gray-700 bg-[#121212] px-4 py-3.5 text-sm text-white outline-none focus:border-gray-500 transition-all placeholder:text-gray-500"
            />
            {errors.password && (
              <p className="text-red-500 text-xs pl-1 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <input
              {...register("fullname")}
              type="text"
              placeholder="Tên đầy đủ"
              className="w-full rounded-xl border border-gray-700 bg-[#121212] px-4 py-3.5 text-sm text-white outline-none focus:border-gray-500 transition-all placeholder:text-gray-500"
            />
            {errors.fullname && (
              <p className="text-red-500 text-xs pl-1 mt-1">
                {errors.fullname.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <input
              {...register("username")}
              type="text"
              placeholder="Tên người dùng"
              className="w-full rounded-xl border border-gray-700 bg-[#121212] px-4 py-3.5 text-sm text-white outline-none focus:border-gray-500 transition-all placeholder:text-gray-500"
            />
            {errors.username && (
              <p className="text-red-500 text-xs pl-1 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Xác nhận mật khẩu"
              className="w-full rounded-xl border border-gray-700 bg-[#121212] px-4 py-3.5 text-sm text-white outline-none focus:border-gray-500 transition-all placeholder:text-gray-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs pl-1 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <p className="text-xs text-gray-500 text-center px-2">
            Những người dùng dịch vụ của chúng tôi có thể đã tải thông tin liên
            hệ của bạn lên Instagram.{" "}
            <a href="#" className="text-blue-500">
              Tìm hiểu thêm
            </a>
            .
          </p>

          <p className="text-xs text-gray-500 text-center px-2">
            Bằng việc nhấn vào Đăng ký, bạn đồng ý với{" "}
            <a href="#" className="text-blue-500">
              Điều khoản
            </a>
            ,{" "}
            <a href="#" className="text-blue-500">
              Chính sách quyền riêng tư
            </a>{" "}
            và{" "}
            <a href="#" className="text-blue-500">
              Chính sách cookie
            </a>{" "}
            của chúng tôi.
          </p>

          <Button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full bg-[#0064e0] hover:bg-[#005bb5] text-white font-semibold h-10 rounded-full text-sm mt-2 transition-all active:scale-[0.98]"
          >
            {registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-gray-800 pt-6">
          <p className="text-sm">
            Bạn có tài khoản rồi?{" "}
            <Link to="/login" className="text-blue-500 font-semibold">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
