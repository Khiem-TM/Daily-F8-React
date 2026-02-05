import { X, Heart } from "lucide-react";

interface NotificationsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsSidebar({
  isOpen,
  onClose,
}: NotificationsSidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-120 bg-black border-r border-gray-800 z-50 flex flex-col animate-slide-in-left shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-white text-2xl font-semibold">Thông báo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center mb-4">
            <Heart size={32} className="text-white" />
          </div>
          <p className="text-white text-center text-sm">
            Chưa có thông báo nào
          </p>
        </div>
      </div>
    </>
  );
}
