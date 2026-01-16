import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../stores/authStore";

export default function AuthMiddleware() {
    const location = useLocation();
    const { pathname } = location;
    const isAuth = useAuth((state) => state.isAuthenticated || Boolean(state.accessToken));
    
    if (!isAuth) {
        localStorage.setItem("intended_url", location.pathname);
        return <Navigate to={`/login?continue=${pathname}`} replace />;
    }
    
    return <Outlet />;
}
