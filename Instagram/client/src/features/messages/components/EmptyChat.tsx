import { Send } from "lucide-react";

interface EmptyChatProps {
  onSendMessage: () => void;
}

export default function EmptyChat({ onSendMessage }: EmptyChatProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      {/* Icon */}
      <div className="w-24 h-24 rounded-full border-2 border-white flex items-center justify-center mb-4">
        <Send size={44} className="text-white" strokeWidth={1} />
      </div>

      {/* Title */}
      <h2 className="text-white text-xl font-normal mb-2">Tin nhắn của bạn</h2>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-6">
        Gửi ảnh và tin nhắn riêng tư cho bạn bè hoặc nhóm
      </p>

      {/* Button */}
      <button
        onClick={onSendMessage}
        className="px-4 py-2 bg-[#0095f6] text-white text-sm font-semibold rounded-lg hover:bg-[#1877f2] transition-colors"
      >
        Gửi tin nhắn
      </button>
    </div>
  );
}
