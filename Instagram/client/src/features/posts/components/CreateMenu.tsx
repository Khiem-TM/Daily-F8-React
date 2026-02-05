import { Image, Sparkles } from "lucide-react";

interface CreateMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: () => void;
  sidebarExpanded: boolean;
}

export default function CreateMenu({
  isOpen,
  onClose,
  onCreatePost,
  sidebarExpanded,
}: CreateMenuProps) {
  if (!isOpen) return null;

  const handleAIClick = () => {
    window.open(
      "https://aistudio.instagram.com/create/?utm_source=ig_web_nav_create",
      "_blank"
    );
    onClose();
  };

  const handlePostClick = () => {
    onCreatePost();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Menu */}
      <div
        className={`absolute z-50 bg-[#262626] rounded-lg shadow-xl py-2 min-w-[200px] ${
          sidebarExpanded ? "left-3 bottom-full mb-2" : "left-16 top-0"
        }`}
      >
        <button
          onClick={handlePostClick}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left"
        >
          <Image size={20} className="text-white" />
          <span className="text-white text-sm">Bài viết</span>
        </button>

        <button
          onClick={handleAIClick}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left"
        >
          <Sparkles size={20} className="text-white" />
          <span className="text-white text-sm">AI</span>
        </button>
      </div>
    </>
  );
}
