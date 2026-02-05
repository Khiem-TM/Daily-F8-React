import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

export default function PublicRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);

  // Nếu đã đăng nhập, chuyển hướng về trang chủ
  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  // Nếu chưa đăng nhập, cho phép truy cập trang login/register
  return <Outlet />;
}
