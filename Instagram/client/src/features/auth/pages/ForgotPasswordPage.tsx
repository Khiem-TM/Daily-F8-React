import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "../auth.schema";
import { useMutation } from "@tanstack/react-query";
import authApi from "@/apis/auth.api";
import { toast } from "sonner";
import AuthLayout from "@/layouts/AuthLayout";
import { ChevronLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const emailValue = watch("email");
  const isFormEmpty = !emailValue?.trim();

  const forgotPasswordMutation = useMutation({
    mutationFn: (body: ForgotPasswordSchema) => authApi.forgotPassword(body),
    onSuccess: () => {
      toast.success("Gửi reset thành công");
    },
    onError: () => {
      toast.error("Lỗi gửi email reset");
    },
  });

  const onSubmit = (data: ForgotPasswordSchema) => {
    forgotPasswordMutation.mutate(data);
  };

  return (
    <AuthLayout showShowcase={false}>
      <div className="w-full max-w-lg">
        {/* Back Button */}
        <Link
          to="/login"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/20 hover:bg-white/5 transition-colors mb-8"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </Link>

        {/* Title & Description */}
        <h1 className="text-2xl font-semibold text-white mb-2">
          Find your account
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Enter your mobile number, username or email.{" "}
          <Link
            to="#"
            className="text-[#0095f6] hover:text-[#1877f2] transition-colors"
          >
            Can't reset your password?
          </Link>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <input
              {...register("email")}
              type="text"
              placeholder="Mobile number, username or email"
              className="w-full rounded-xl border border-white/10 bg-[#1c2128] px-4 py-4 text-sm text-white outline-none focus:border-white/25 transition-all placeholder:text-gray-500"
            />
            {errors.email && (
              <p className="text-red-400 text-xs pl-1 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Info Text */}
          <p className="text-gray-500 text-xs">
            You may receive WhatsApp and SMS notifications from us for security
            and login purposes.
          </p>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={forgotPasswordMutation.isPending || isFormEmpty}
            className="w-full bg-[#0064e0] hover:bg-[#0058c7] text-white font-semibold h-12 rounded-xl text-[15px] transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {forgotPasswordMutation.isPending ? "Sending..." : "Continue"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
