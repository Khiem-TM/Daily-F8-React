import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import VerifyEmailPage from "@/features/auth/pages/VerifyEmailPage";
import CheckEmailPage from "@/features/auth/pages/CheckEmailPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import HomePage from "@/features/home/pages/HomePage";
import ReelsPage from "@/features/reels/pages/ReelsPage";
import ExplorePage from "@/features/explore/pages/ExplorePage";
import ProfilePage from "@/features/profile/pages/ProfilePage";
import MessagePage from "@/features/messages/pages/MessagePage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import EditProfileSection from "@/features/settings/components/EditProfileSection";
import NotificationsSection from "@/features/settings/components/NotificationsSection";
import AccountPrivacySection from "@/features/settings/components/AccountPrivacySection";
import CloseFriendsSection from "@/features/settings/components/CloseFriendsSection";
import BlockedAccountsSection from "@/features/settings/components/BlockedAccountsSection";
import HideStorySection from "@/features/settings/components/HideStorySection";
import MessagesSection from "@/features/settings/components/MessagesSection";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - Chỉ cho người chưa đăng nhập */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          <Route path="/check-email" element={<CheckEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Protected Routes - Cần đăng nhập */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/reels" element={<ReelsPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/direct/inbox" element={<MessagePage />} />

          {/* Profile Routes */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />

          {/* Settings Routes with nested children */}
          <Route path="/settings" element={<SettingsPage />}>
            <Route index element={<EditProfileSection />} />
            <Route path="notifications" element={<NotificationsSection />} />
            <Route path="account_privacy" element={<AccountPrivacySection />} />
            <Route path="close_friends" element={<CloseFriendsSection />} />
            <Route
              path="blocked_accounts"
              element={<BlockedAccountsSection />}
            />
            <Route path="hide_story_and_live" element={<HideStorySection />} />
            <Route
              path="messages_and_story_replies"
              element={<MessagesSection />}
            />
          </Route>

          {/* Thêm các route khác ở đây */}
          {/* <Route path="/p/:postId" element={<PostDetailPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
