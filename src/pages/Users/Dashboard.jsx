import { useNavigate } from "react-router-dom";
import { useAuth } from "../../stores/authStore";

export default function Dashboard() {
    const navigate = useNavigate();
    const logOut = useAuth((state) => state.logOut);

    const handleLogout = () => {
        logOut();
        localStorage.removeItem("intended_url");
        navigate('/login');
    };

    return (
        <div className="user-page fade-in">
            <div className="page-header" style={{ textAlign: 'left' }}>
                <h1>📊 Dashboard</h1>
                <p>Welcome back! Here's what's happening with your account.</p>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <div className="dashboard-card-icon">🛒</div>
                    <div className="dashboard-card-content">
                        <h3>Total Orders</h3>
                        <div className="dashboard-card-value">24</div>
                        <p className="dashboard-card-change positive">↑ 12% from last month</p>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-card-icon">💰</div>
                    <div className="dashboard-card-content">
                        <h3>Revenue</h3>
                        <div className="dashboard-card-value">$2,450</div>
                        <p className="dashboard-card-change positive">↑ 8% from last month</p>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-card-icon">📦</div>
                    <div className="dashboard-card-content">
                        <h3>Products Sold</h3>
                        <div className="dashboard-card-value">142</div>
                        <p className="dashboard-card-change positive">↑ 23% from last month</p>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-card-icon">⭐</div>
                    <div className="dashboard-card-content">
                        <h3>Reviews</h3>
                        <div className="dashboard-card-value">4.8</div>
                        <p className="dashboard-card-change neutral">→ Same as last month</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-section">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                    <div className="activity-item">
                        <span className="activity-icon">🛍️</span>
                        <div className="activity-content">
                            <p><strong>New order received</strong></p>
                            <p className="activity-time">2 hours ago</p>
                        </div>
                    </div>
                    <div className="activity-item">
                        <span className="activity-icon">⭐</span>
                        <div className="activity-content">
                            <p><strong>5-star review received</strong></p>
                            <p className="activity-time">5 hours ago</p>
                        </div>
                    </div>
                    <div className="activity-item">
                        <span className="activity-icon">📦</span>
                        <div className="activity-content">
                            <p><strong>Order #12345 shipped</strong></p>
                            <p className="activity-time">1 day ago</p>
                        </div>
                    </div>
                </div>
                <button className="log-out" onClick={handleLogout}>
                    Log Out
                </button>
            </div>
        </div>
    );
}