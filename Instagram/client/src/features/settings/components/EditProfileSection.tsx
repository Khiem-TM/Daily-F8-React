import { useState, useRef } from "react";
import { useAuthStore } from "@/store/auth.store";
import {
  useUpdateProfile,
  useDeleteProfilePicture,
} from "@/hooks/useUserProfile";
import { Loader2 } from "lucide-react";
import { getAvatarUrl, getFallbackAvatarUrl } from "@/utils/avatar";

export default function EditProfileSection() {
  const user = useAuthStore((state) => state.user);
  const updateProfileMutation = useUpdateProfile();
  const deleteProfilePictureMutation = useDeleteProfilePicture();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    website: user?.website || "",
    bio: user?.bio || "",
    gender: user?.gender || "",
    showThreadsBadge: true,
    showAccountSuggestions: true,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleToggle = (field: string) => {
    setFormData({
      ...formData,
      [field]: !formData[field as keyof typeof formData],
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleChangePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      if (formData.website) formDataToSend.append("website", formData.website);
      if (formData.bio) formDataToSend.append("bio", formData.bio);
      if (formData.gender) formDataToSend.append("gender", formData.gender);

      if (selectedFile) {
        formDataToSend.append("profilePicture", selectedFile);
      }

      await updateProfileMutation.mutateAsync(formDataToSend);

      setSelectedFile(null);
      setPreviewUrl(null);

      alert("Cập nhật thành công!");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
    }
  };

  const isLoading =
    updateProfileMutation.isPending || deleteProfilePictureMutation.isPending;
  const displayImage =
    previewUrl ||
    getAvatarUrl(
      user?.profilePicture,
      user?.fullName || user?.username || "User"
    );

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Chỉnh sửa trang cá nhân</h2>

      {/* Profile Avatar Section */}
      <div className="bg-[#262626] rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
            <img
              src={displayImage}
              alt={user?.username}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getFallbackAvatarUrl(
                  user?.fullName || user?.username || "User"
                );
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base">{user?.username}</h3>
            <p className="text-sm text-gray-400">{user?.fullName}</p>
          </div>
          <button
            type="button"
            onClick={handleChangePhoto}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm"
          >
            Đổi ảnh
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Website */}
        <div>
          <label className="block text-sm font-semibold mb-2">Trang web</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Trang web"
            className="w-full bg-[#262626] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-gray-500 transition-colors text-sm"
          />
          <p className="text-xs text-gray-500 mt-2">
            Bạn chỉ có thể chỉnh sửa liên kết trên di động. Hãy mở ứng dụng
            Instagram và chỉnh sửa trang cá nhân của bạn để thay đổi trang web
            trong phần tiểu sử.
          </p>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-semibold mb-2">Tiểu sử</label>
          <div className="relative">
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tiểu sử"
              rows={3}
              maxLength={150}
              className="w-full bg-[#262626] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-gray-500 transition-colors resize-none text-sm"
            />
            <span className="absolute bottom-3 right-3 text-xs text-gray-500">
              {formData.bio.length} / 150
            </span>
          </div>
        </div>

        {/* Show Threads Badge */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Hiển thị huy hiệu Threads
          </label>
          <div className="flex items-center justify-between bg-[#262626] border border-gray-700 rounded-xl px-4 py-3">
            <span className="text-sm">Hiển thị huy hiệu Threads</span>
            <button
              type="button"
              onClick={() => handleToggle("showThreadsBadge")}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                formData.showThreadsBadge ? "bg-blue-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  formData.showThreadsBadge ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-semibold mb-2">Giới tính</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full bg-[#262626] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-gray-500 transition-colors text-sm appearance-none cursor-pointer"
          >
            <option value="">Không muốn tiết lộ</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
          <p className="text-xs text-gray-500 mt-2">
            Thông tin này sẽ không xuất hiện trên trang cá nhân công khai của
            bạn.
          </p>
        </div>

        {/* Show Account Suggestions */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Hiển thị gợi ý tài khoản trên trang cá nhân
          </label>
          <div className="flex items-center justify-between bg-[#262626] border border-gray-700 rounded-xl px-4 py-3">
            <span className="text-sm">
              Hiển thị gợi ý tài khoản trên trang cá nhân
            </span>
            <button
              type="button"
              onClick={() => handleToggle("showAccountSuggestions")}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                formData.showAccountSuggestions ? "bg-blue-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  formData.showAccountSuggestions ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang lưu...
            </>
          ) : (
            "Lưu thay đổi"
          )}
        </button>
      </form>
    </div>
  );
}
