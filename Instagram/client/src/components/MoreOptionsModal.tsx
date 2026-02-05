import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";
import {
  Settings,
  Activity,
  Bookmark,
  Moon,
  Sun,
  Monitor,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";

interface MoreOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sidebarExpanded?: boolean;
}

const menuOptions = [
  { icon: Settings, label: "Cài đặt", action: "settings" },
  { icon: Activity, label: "Hoạt động của bạn", action: "activity" },
  { icon: Bookmark, label: "Đã lưu", action: "saved" },
  { icon: Moon, label: "Chuyển chế độ", action: "theme" },
  { icon: AlertCircle, label: "Báo cáo sự cố", action: "report" },
];

export default function MoreOptionsModal({
  isOpen,
  onClose,
  sidebarExpanded = false,
}: MoreOptionsModalProps) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { theme, setTheme } = useThemeStore();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  if (!isOpen) return null;

  const handleAction = (action: string) => {
    switch (action) {
      case "settings":
        navigate("/settings");
        onClose();
        break;
      case "activity":
        navigate("/activity");
        onClose();
        break;
      case "saved":
        navigate("/profile");
        onClose();
        break;
      case "theme":
        setShowThemeMenu(true);
        break;
      case "report":
        alert("Chức năng báo cáo sẽ được thêm sau");
        onClose();
        break;
    }
  };

  const handleThemeChange = (newTheme: "dark" | "light" | "system") => {
    setTheme(newTheme);
    setShowThemeMenu(false);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleSwitchAccount = () => {
    alert("Chức năng chuyển tài khoản sẽ được thêm sau");
    onClose();
  };

  // Theme submenu
  if (showThemeMenu) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => {
            setShowThemeMenu(false);
            onClose();
          }}
        />

        {/* Theme Menu */}
        <div
          className={`fixed bottom-24 z-50 w-64 bg-[#262626] dark:bg-[#262626] light:bg-white rounded-2xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200 ${
            sidebarExpanded ? "left-4" : "left-4"
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700 dark:border-gray-700 light:border-gray-200">
            <button
              onClick={() => setShowThemeMenu(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold">Chuyển chế độ</span>
          </div>

          {/* Theme Options */}
          <div className="py-2">
            {/* Dark Mode */}
            <button
              onClick={() => handleThemeChange("dark")}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5" />
                <span className="text-sm">Chế độ tối</span>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  theme === "dark"
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-500"
                }`}
              >
                {theme === "dark" && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </button>

            {/* Light Mode */}
            <button
              onClick={() => handleThemeChange("light")}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5" />
                <span className="text-sm">Chế độ sáng</span>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  theme === "light"
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-500"
                }`}
              >
                {theme === "light" && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </button>

            {/* System */}
            <button
              onClick={() => handleThemeChange("system")}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5" />
                <span className="text-sm">Tự động</span>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  theme === "system"
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-500"
                }`}
              >
                {theme === "system" && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Modal - Position above the "Xem thêm" button */}
      <div
        className={`fixed bottom-24 z-50 w-64 bg-[#262626] rounded-2xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200 transition-all ${
          sidebarExpanded ? "left-4" : "left-4"
        }`}
      >
        {/* Menu Options */}
        <div className="py-2">
          {menuOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.action}
                onClick={() => handleAction(option.action)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{option.label}</span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700" />

        {/* Account Actions */}
        <div className="py-2">
          <button
            onClick={handleSwitchAccount}
            className="w-full px-4 py-3 hover:bg-white/5 transition-colors text-left text-sm"
          >
            Chuyển tài khoản
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700" />

        {/* Logout */}
        <div className="py-2">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 hover:bg-white/5 transition-colors text-left text-sm"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </>
  );
}
