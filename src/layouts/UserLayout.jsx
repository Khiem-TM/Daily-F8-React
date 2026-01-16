import {NavLink, Outlet, useNavigate} from "react-router-dom";
import { useAuth } from "../stores/authStore";

export default function UserLayout(){
    const navigate = useNavigate();
    const logOut = useAuth((state) => state.logOut);
    
    const navLinkClass = ({ isActive }) =>
        isActive
            ? "user-nav-link active"
            : "user-nav-link";
    
    const handleLogout = () => {
        if (confirm('Bạn có chắc muốn đăng xuất?')) {
            logOut();
            localStorage.removeItem("intended_url");
            navigate('/login');
        }
    };

    return (
        <div className="user-layout">
            <nav className="user-nav">
                <div className="user-nav-header">
                    <h2>👤 User Panel</h2>
                </div>
                <div className="user-nav-links">
                    <NavLink to="/users" end className={navLinkClass}>
                        📊 Dashboard
                    </NavLink>
                    <NavLink to="/users/products" className={navLinkClass}>
                        🛍️ Products
                    </NavLink>
                    <NavLink to="/users/sales" className={navLinkClass}>
                        💰 Sales
                    </NavLink>
                    <NavLink to="#" className={navLinkClass}>
                        👤 Profile
                    </NavLink>
                    <button 
                        onClick={handleLogout}
                        className="user-nav-link logout-button"
                        style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            marginTop: 'auto'
                        }}
                    >
                        🚪 Logout
                    </button>
                </div>
            </nav>
            <main className="user-content">
                <Outlet />
            </main>
        </div>
    );
}