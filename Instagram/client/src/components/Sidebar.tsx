import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import MoreOptionsModal from "./MoreOptionsModal";
import SearchSidebar from "./SearchSidebar";
import NotificationsSidebar from "./NotificationsSidebar";
import CreateMenu from "@/features/posts/components/CreateMenu";
import CreatePostModal from "@/features/posts/components/CreatePostModal";
import { getAvatarUrl, getFallbackAvatarUrl } from "@/utils/avatar";
import {
  Home,
  Search,
  Compass,
  Film,
  MessageCircle,
  Heart,
  PlusSquare,
  Menu,
  Instagram,
  Grid3x3,
} from "lucide-react";

type MenuItem =
  | { icon: any; label: string; path: string; action?: never }
  | { icon: any; label: string; action: string; path?: never };

const menuItems: MenuItem[] = [
  { icon: Home, label: "Trang chủ", path: "/" },
  { icon: Search, label: "Tìm kiếm", action: "search" },
  { icon: Compass, label: "Khám phá", path: "/explore" },
  { icon: Film, label: "Reels", path: "/reels" },
  { icon: MessageCircle, label: "Tin nhắn", path: "/direct/inbox" },
  { icon: Heart, label: "Thông báo", action: "notifications" },
  { icon: PlusSquare, label: "Tạo", action: "create" },
];

export default function Sidebar() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    // No delay - collapse immediately
    setIsExpanded(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed left-0 top-0 h-screen bg-black flex flex-col py-8 px-3 z-50 transition-all duration-200 ease-out ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      {/* Logo - Icon only */}
      <Link to="/" className="px-3 py-3 flex items-center mb-4">
        <Instagram className="w-7 h-7 shrink-0" />
      </Link>

      {/* Navigation - Centered between logo and bottom */}
      <nav className="flex-1 flex flex-col justify-center space-y-1 py-4">
        {menuItems.map((item) => {
          const isActive = item.path ? location.pathname === item.path : false;
          const Icon = item.icon;

          // Handle action items (Search, Notifications, Create)
          if (item.action) {
            return (
              <div key={item.label} className="relative">
                <button
                  onClick={() => {
                    if (item.action === "search") {
                      setIsSearchOpen(true);
                      setIsNotificationsOpen(false);
                      setIsCreateMenuOpen(false);
                    } else if (item.action === "notifications") {
                      setIsNotificationsOpen(true);
                      setIsSearchOpen(false);
                      setIsCreateMenuOpen(false);
                    } else if (item.action === "create") {
                      setIsCreateMenuOpen(!isCreateMenuOpen);
                      setIsSearchOpen(false);
                      setIsNotificationsOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 hover:bg-white/10 group relative ${
                    (item.action === "search" && isSearchOpen) ||
                    (item.action === "notifications" && isNotificationsOpen) ||
                    (item.action === "create" && isCreateMenuOpen)
                      ? "font-bold"
                      : ""
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 shrink-0 ${
                      (item.action === "search" && isSearchOpen) ||
                      (item.action === "notifications" &&
                        isNotificationsOpen) ||
                      (item.action === "create" && isCreateMenuOpen)
                        ? "stroke-[2.5px]"
                        : ""
                    }`}
                  />
                  <span
                    className={`whitespace-nowrap transition-all duration-200 ${
                      isExpanded
                        ? "opacity-100 w-auto"
                        : "opacity-0 w-0 overflow-hidden"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>

                {/* Create Menu - positioned relative to this button */}
                {item.action === "create" && (
                  <CreateMenu
                    isOpen={isCreateMenuOpen}
                    onClose={() => setIsCreateMenuOpen(false)}
                    onCreatePost={() => setIsCreatePostModalOpen(true)}
                    sidebarExpanded={isExpanded}
                  />
                )}
              </div>
            );
          }

          // Regular navigation items
          return (
            <Link
              key={item.path}
              to={item.path || "#"}
              className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 hover:bg-white/10 group relative ${
                isActive ? "font-bold" : ""
              }`}
            >
              <Icon
                className={`w-6 h-6 shrink-0 ${
                  isActive ? "stroke-[2.5px]" : ""
                }`}
              />
              <span
                className={`whitespace-nowrap transition-all duration-200 ${
                  isExpanded
                    ? "opacity-100 w-auto"
                    : "opacity-0 w-0 overflow-hidden"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Profile Link */}
        <Link
          to="/profile"
          className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 hover:bg-white/10 relative ${
            location.pathname === "/profile" ||
            location.pathname === `/${user?.username}`
              ? "font-bold"
              : ""
          }`}
        >
          <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border-2 border-white">
            <img
              src={getAvatarUrl(
                user?.profilePicture,
                user?.fullName || user?.username || "User"
              )}
              alt={user?.username || "User"}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getFallbackAvatarUrl(
                  user?.fullName || user?.username || "User"
                );
              }}
            />
          </div>
          <span
            className={`whitespace-nowrap transition-all duration-200 ${
              isExpanded
                ? "opacity-100 w-auto"
                : "opacity-0 w-0 overflow-hidden"
            }`}
          >
            Trang cá nhân
          </span>
        </Link>
      </nav>

      {/* Bottom Section */}
      <div className="space-y-1">
        {/* More Options Button */}
        <button
          onClick={() => setIsMoreModalOpen(true)}
          className="flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 hover:bg-white/10 w-full text-left relative"
        >
          <Menu className="w-6 h-6 shrink-0" />
          <span
            className={`whitespace-nowrap transition-all duration-200 ${
              isExpanded
                ? "opacity-100 w-auto"
                : "opacity-0 w-0 overflow-hidden"
            }`}
          >
            Xem thêm
          </span>
        </button>

        {/* Cũng của Meta - Always visible */}
        <div className="flex items-center gap-4 px-3 py-3">
          <Grid3x3 className="w-6 h-6 shrink-0 text-gray-400" />
          <span
            className={`whitespace-nowrap transition-all duration-200 text-sm ${
              isExpanded
                ? "opacity-100 w-auto"
                : "opacity-0 w-0 overflow-hidden"
            }`}
          >
            Cũng của Meta
          </span>
        </div>
      </div>

      {/* More Options Modal */}
      <MoreOptionsModal
        isOpen={isMoreModalOpen}
        onClose={() => setIsMoreModalOpen(false)}
        sidebarExpanded={isExpanded}
      />

      {/* Search Sidebar */}
      <SearchSidebar
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Notifications Sidebar */}
      <NotificationsSidebar
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
      />
    </aside>
  );
}
