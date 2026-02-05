import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import authApi from "@/apis/auth.api";
import { toast } from "sonner";
import AuthLayout from "@/layouts/AuthLayout";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [countdown, setCountdown] = useState(0);

  const resendMutation = useMutation({
    mutationFn: (email: string) => authApi.resendVerificationEmail(email),
    onSuccess: () => {
      toast.success("Email xác thực đã được gửi lại!");
      // Start countdown
      setCountdown(60);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Không thể gửi lại email");
    },
  });

  // Nếu không có email trong state, redirect về register
  if (!email) {
    navigate("/register");
    return null;
  }

  const handleResendEmail = () => {
    if (countdown === 0) {
      resendMutation.mutate(email);
    }
  };

  return (
    <AuthLayout showShowcase={false}>
      <div className="w-full max-w-md border border-gray-800 rounded-sm bg-black p-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          {/* Email Icon */}
          <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
            <Mail className="w-10 h-10 text-blue-500" />
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-semibold mb-3 text-center">
            Kiểm tra email của bạn
          </h2>

          {/* Description */}
          <p className="text-gray-400 text-sm text-center mb-2">
            Chúng tôi đã gửi email xác thực đến:
          </p>
          <p className="text-white font-semibold mb-6">{email}</p>

          <p className="text-gray-400 text-sm text-center mb-8 max-w-sm">
            Vui lòng kiểm tra hộp thư của bạn và nhấp vào liên kết xác thực để
            kích hoạt tài khoản.
          </p>

          {/* Resend Button */}
          <div className="w-full space-y-4">
            <Button
              onClick={handleResendEmail}
              disabled={resendMutation.isPending || countdown > 0}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
            >
              {resendMutation.isPending
                ? "Đang gửi..."
                : countdown > 0
                ? `Gửi lại sau ${countdown}s`
                : "Gửi lại email xác thực"}
            </Button>

            <Link to="/login" className="block">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại đăng nhập
              </Button>
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-800 w-full">
            <p className="text-xs text-gray-500 text-center">
              Không nhận được email?{" "}
              <button
                onClick={handleResendEmail}
                disabled={countdown > 0}
                className="text-blue-500 hover:underline disabled:opacity-50"
              >
                Gửi lại
              </button>
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              Kiểm tra thư mục spam nếu không thấy email trong hộp thư đến.
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
