import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import MainLayout from "@/layouts/MainLayout";

export default function ProtectedRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);

  // Nếu chưa đăng nhập, chuyển hướng về trang login
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Tất cả protected routes đều dùng MainLayout
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
