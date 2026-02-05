import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

export default function SimpleProtectedRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);

  // Nếu chưa đăng nhập, chuyển hướng về trang login
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Render page without layout
  return <Outlet />;
}
