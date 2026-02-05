import { useState, useRef, useCallback } from "react";
import {
  X,
  ArrowLeft,
  ImageIcon,
  MapPin,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/apis/post.api";
import { useAuthStore } from "@/store/auth.store";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "upload" | "filter" | "details";

// Filter options (visual only for now)
const filters = [
  { name: "Bình thường", value: "none" },
  { name: "Clarendon", value: "clarendon" },
  { name: "Gingham", value: "gingham" },
  { name: "Moon", value: "moon" },
  { name: "Lark", value: "lark" },
  { name: "Reyes", value: "reyes" },
  { name: "Juno", value: "juno" },
  { name: "Slumber", value: "slumber" },
  { name: "Crema", value: "crema" },
  { name: "Ludwig", value: "ludwig" },
];

export default function CreatePostModal({
  isOpen,
  onClose,
}: CreatePostModalProps) {
  const [step, setStep] = useState<Step>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [hideStats, setHideStats] = useState(false);
  const [disableComments, setDisableComments] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const createPostMutation = useMutation({
    mutationFn: (formData: FormData) => createPost(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      handleClose();
    },
    onError: (error) => {
      console.error("Failed to create post:", error);
      alert("Không thể đăng bài. Vui lòng thử lại.");
    },
  });

  const handleClose = () => {
    setStep("upload");
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedFilter("none");
    setCaption("");
    setLocation("");
    setIsAdvancedOpen(false);
    setHideStats(false);
    setDisableComments(false);
    onClose();
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/quicktime",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Chỉ hỗ trợ file ảnh (jpg, png, gif) hoặc video (mp4, mov)");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("Dung lượng file tối đa là 5MB");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setStep("filter");
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleSubmit = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (caption.trim()) {
      formData.append("caption", caption.trim());
    }
    // Note: location, hideStats, disableComments would need API support

    createPostMutation.mutate(formData);
  };

  const handleBack = () => {
    if (step === "filter") {
      setStep("upload");
      setSelectedFile(null);
      setPreviewUrl(null);
    } else if (step === "details") {
      setStep("filter");
    }
  };

  const handleNext = () => {
    if (step === "filter") {
      setStep("details");
    }
  };

  const avatarUrl = user?.profilePicture
    ? `${import.meta.env.VITE_API_URL}${user.profilePicture}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user?.fullName || user?.username || "User"
      )}&background=random&size=128`;

  const isVideo = selectedFile?.type.startsWith("video/");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
      >
        <X size={28} />
      </button>

      {/* Modal */}
      <div
        className={`relative bg-[#262626] rounded-xl overflow-hidden transition-all duration-300 ${
          step === "upload"
            ? "w-[500px] h-[530px]"
            : step === "filter"
            ? "w-[900px] h-[530px]"
            : "w-[1000px] h-[530px]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          {step !== "upload" && (
            <button
              onClick={handleBack}
              className="text-white hover:text-gray-300"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <h2 className="text-white font-semibold flex-1 text-center">
            Tạo bài viết mới
          </h2>
          {step === "filter" && (
            <button
              onClick={handleNext}
              className="text-blue-500 font-semibold hover:text-blue-400"
            >
              Tiếp
            </button>
          )}
          {step === "details" && (
            <button
              onClick={handleSubmit}
              disabled={createPostMutation.isPending}
              className="text-blue-500 font-semibold hover:text-blue-400 disabled:opacity-50"
            >
              {createPostMutation.isPending ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Chia sẻ"
              )}
            </button>
          )}
          {step === "upload" && <div className="w-6" />}
        </div>

        {/* Content */}
        <div className="flex h-[calc(100%-53px)]">
          {/* Upload Step */}
          {step === "upload" && (
            <div
              className={`flex-1 flex flex-col items-center justify-center p-8 transition-colors ${
                isDragging ? "bg-white/5" : ""
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="w-24 h-24 mb-4 flex items-center justify-center">
                <ImageIcon size={64} className="text-white" strokeWidth={1} />
              </div>
              <p className="text-white text-xl mb-6">
                Kéo ảnh và video vào đây
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
              >
                Chọn từ máy tính
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,video/mp4,video/quicktime"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          )}

          {/* Filter Step */}
          {step === "filter" && previewUrl && (
            <>
              {/* Image Preview */}
              <div className="flex-1 flex items-center justify-center bg-black">
                {isVideo ? (
                  <video
                    src={previewUrl}
                    className="max-w-full max-h-full object-contain"
                    controls
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className={`max-w-full max-h-full object-contain filter-${selectedFilter}`}
                  />
                )}
              </div>

              {/* Filters Panel */}
              <div className="w-[340px] border-l border-gray-700 overflow-y-auto">
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-4">Bộ lọc</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {filters.map((filter) => (
                      <button
                        key={filter.value}
                        onClick={() => setSelectedFilter(filter.value)}
                        className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                          selectedFilter === filter.value
                            ? "bg-white/10"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden mb-1">
                          <img
                            src={previewUrl}
                            alt={filter.name}
                            className={`w-full h-full object-cover filter-${filter.value}`}
                          />
                        </div>
                        <span
                          className={`text-xs ${
                            selectedFilter === filter.value
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                        >
                          {filter.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Details Step */}
          {step === "details" && previewUrl && (
            <>
              {/* Image Preview */}
              <div className="w-[530px] flex items-center justify-center bg-black">
                {isVideo ? (
                  <video
                    src={previewUrl}
                    className="max-w-full max-h-full object-contain"
                    controls
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className={`max-w-full max-h-full object-contain filter-${selectedFilter}`}
                  />
                )}
              </div>

              {/* Details Panel */}
              <div className="flex-1 border-l border-gray-700 flex flex-col">
                {/* User Info */}
                <div className="flex items-center gap-3 p-4">
                  <img
                    src={avatarUrl}
                    alt={user?.username}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span className="text-white text-sm font-semibold">
                    {user?.username}
                  </span>
                </div>

                {/* Caption */}
                <div className="flex-1 px-4">
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value.slice(0, 2200))}
                    placeholder="Viết chú thích..."
                    className="w-full h-32 bg-transparent text-white text-sm resize-none outline-none placeholder:text-gray-500"
                  />
                  <div className="flex justify-end">
                    <span className="text-xs text-gray-500">
                      {caption.length}/2.200
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="border-t border-gray-700">
                  <div className="flex items-center justify-between px-4 py-3">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Thêm vị trí"
                      className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-gray-500"
                    />
                    <MapPin size={16} className="text-gray-400" />
                  </div>
                </div>

                {/* Collaborators */}
                <div className="border-t border-gray-700">
                  <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
                    <span className="text-white text-sm">
                      Thêm cộng tác viên
                    </span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </button>
                </div>

                {/* Advanced Settings */}
                <div className="border-t border-gray-700">
                  <button
                    onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
                  >
                    <span className="text-white text-sm">Cài đặt nâng cao</span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform ${
                        isAdvancedOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isAdvancedOpen && (
                    <div className="px-4 pb-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm">
                            Ẩn số lượt thích và lượt xem
                          </p>
                          <p className="text-gray-500 text-xs">
                            Chỉ có bạn mới thấy tổng số lượt thích
                          </p>
                        </div>
                        <button
                          onClick={() => setHideStats(!hideStats)}
                          className={`w-10 h-6 rounded-full transition-colors ${
                            hideStats ? "bg-blue-500" : "bg-gray-600"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full transition-transform ${
                              hideStats ? "translate-x-4" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm">
                            Tắt tính năng bình luận
                          </p>
                          <p className="text-gray-500 text-xs">
                            Bạn có thể thay đổi điều này sau
                          </p>
                        </div>
                        <button
                          onClick={() => setDisableComments(!disableComments)}
                          className={`w-10 h-6 rounded-full transition-colors ${
                            disableComments ? "bg-blue-500" : "bg-gray-600"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full transition-transform ${
                              disableComments
                                ? "translate-x-4"
                                : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
