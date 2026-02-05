import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import authApi from "@/apis/auth.api";
import { toast } from "sonner";
import AuthLayout from "@/layouts/AuthLayout";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  const verifyMutation = useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: () => {
      setVerificationStatus("success");
      toast.success("Email đã được xác thực thành công!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    },
    onError: (error: any) => {
      setVerificationStatus("error");
      toast.error(error.response?.data?.message || "Xác thực email thất bại");
    },
  });

  const resendMutation = useMutation({
    mutationFn: (email: string) => authApi.resendVerificationEmail(email),
    onSuccess: () => {
      toast.success("Email xác thực đã được gửi lại!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Không thể gửi lại email");
    },
  });

  useEffect(() => {
    if (token) {
      verifyMutation.mutate(token);
    }
  }, [token]);

  const handleResendEmail = () => {
    if (email) {
      resendMutation.mutate(email);
    } else {
      toast.error("Vui lòng nhập email của bạn");
    }
  };

  return (
    <AuthLayout showShowcase={false}>
      <div className="w-full max-w-md border border-gray-800 rounded-sm bg-black p-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          {/* Loading State */}
          {verificationStatus === "loading" && (
            <>
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Đang xác thực email...
              </h2>
              <p className="text-gray-400 text-sm text-center">
                Vui lòng đợi trong giây lát
              </p>
            </>
          )}

          {/* Success State */}
          {verificationStatus === "success" && (
            <>
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Xác thực thành công!
              </h2>
              <p className="text-gray-400 text-sm text-center mb-6">
                Email của bạn đã được xác thực. <br />
                Đang chuyển hướng đến trang đăng nhập...
              </p>
              <Link to="/login">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  Đăng nhập ngay
                </Button>
              </Link>
            </>
          )}

          {/* Error State */}
          {verificationStatus === "error" && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Xác thực thất bại</h2>
              <p className="text-gray-400 text-sm text-center mb-6">
                Link xác thực không hợp lệ hoặc đã hết hạn. <br />
                Vui lòng yêu cầu gửi lại email xác thực.
              </p>

              <div className="w-full space-y-4">
                <div className="flex items-center gap-2 bg-gray-900 rounded-xl px-4 py-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn"
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                </div>

                <Button
                  onClick={handleResendEmail}
                  disabled={resendMutation.isPending}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  {resendMutation.isPending
                    ? "Đang gửi..."
                    : "Gửi lại email xác thực"}
                </Button>

                <Link to="/login" className="block">
                  <Button variant="outline" className="w-full">
                    Quay lại đăng nhập
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
