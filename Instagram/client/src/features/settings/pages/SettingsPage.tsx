import { Link, useLocation, Outlet } from "react-router-dom";
import {
  User,
  Shield,
  Tv,
  Bell,
  Lock,
  Star,
  Ban,
  MapPin,
  MessageCircle,
  ExternalLink,
} from "lucide-react";

// Settings menu structure with groups
const settingsGroups = [
  {
    title: "Cách bạn dùng Instagram",
    items: [
      {
        label: "Chỉnh sửa trang cá nhân",
        path: "/settings",
        icon: User,
      },
      {
        label: "Thông báo",
        path: "/settings/notifications",
        icon: Bell,
      },
    ],
  },
  {
    title: "Ai có thể xem nội dung của bạn",
    items: [
      {
        label: "Quyền riêng tư của tài khoản",
        path: "/settings/account_privacy",
        icon: Lock,
      },
      {
        label: "Bạn thân",
        path: "/settings/close_friends",
        icon: Star,
      },
      {
        label: "Đã chặn",
        path: "/settings/blocked_accounts",
        icon: Ban,
      },
      {
        label: "Tin và vị trí",
        path: "/settings/hide_story_and_live",
        icon: MapPin,
      },
    ],
  },
  {
    title: "Cách người khác có thể tương tác với bạn",
    items: [
      {
        label: "Tin nhắn và lượt phản hồi",
        path: "/settings/messages_and_story_replies",
        icon: MessageCircle,
      },
    ],
  },
];

export default function SettingsPage() {
  const location = useLocation();

  return (
    <div className="flex gap-8 h-full max-w-6xl mx-auto py-8">
      {/* Left Sidebar - Settings Menu */}
      <aside className="w-80 shrink-0">
        <div className="sticky top-8">
          {/* Header */}
          <h1 className="text-2xl font-bold mb-6 px-2">Cài đặt</h1>

          {/* Meta Account Center Card */}
          <div className="bg-[#1a1a1a] rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">∞</span>
              </div>
              <span className="font-semibold text-white">Meta</span>
            </div>
            <h3 className="font-semibold text-sm mb-1">Trung tâm tài khoản</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Quản lý phần cài đặt tài khoản và trải nghiệm kết nối trên các
              công nghệ của Meta.
            </p>

            {/* Account Center Links */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <User size={14} />
                <span>Thông tin cá nhân</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Shield size={14} />
                <span>Mật khẩu và bảo mật</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Tv size={14} />
                <span>Tùy chọn quảng cáo</span>
              </div>
            </div>

            <Link
              to="/accounts/center"
              className="text-xs text-blue-500 hover:text-blue-400 font-semibold flex items-center gap-1"
            >
              Xem thêm trong Trung tâm tài khoản
              <ExternalLink size={12} />
            </Link>
          </div>

          {/* Settings Groups */}
          <nav className="space-y-6">
            {settingsGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-xs text-gray-500 font-medium mb-2 px-2">
                  {group.title}
                </h2>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          isActive
                            ? "bg-white/10 font-medium"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <Icon size={20} className="text-gray-400" />
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Right Content Area */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
