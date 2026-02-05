export default function MessagesSection() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-6">Tin nhắn và phản hồi tin</h2>

      <div className="space-y-4">
        {/* Message Requests */}
        <div className="bg-[#262626] rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Yêu cầu nhắn tin</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="message_requests"
                defaultChecked
                className="w-4 h-4 accent-blue-500"
              />
              <div>
                <p className="text-sm font-medium">Cho phép yêu cầu</p>
                <p className="text-xs text-gray-400">
                  Bạn sẽ nhận được yêu cầu nhắn tin từ mọi người
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="message_requests"
                className="w-4 h-4 accent-blue-500"
              />
              <div>
                <p className="text-sm font-medium">Chỉ từ người tôi theo dõi</p>
                <p className="text-xs text-gray-400">
                  Chỉ những người bạn theo dõi mới có thể gửi tin nhắn cho bạn
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="message_requests"
                className="w-4 h-4 accent-blue-500"
              />
              <div>
                <p className="text-sm font-medium">Tắt yêu cầu</p>
                <p className="text-xs text-gray-400">
                  Không ai có thể gửi yêu cầu nhắn tin cho bạn
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Story Replies */}
        <div className="bg-[#262626] rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Phản hồi tin</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="story_replies"
                defaultChecked
                className="w-4 h-4 accent-blue-500"
              />
              <div>
                <p className="text-sm font-medium">
                  Cho phép phản hồi từ mọi người
                </p>
                <p className="text-xs text-gray-400">
                  Mọi người có thể phản hồi tin của bạn
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="story_replies"
                className="w-4 h-4 accent-blue-500"
              />
              <div>
                <p className="text-sm font-medium">Chỉ người tôi theo dõi</p>
                <p className="text-xs text-gray-400">
                  Chỉ những người bạn theo dõi mới có thể phản hồi
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="story_replies"
                className="w-4 h-4 accent-blue-500"
              />
              <div>
                <p className="text-sm font-medium">Tắt phản hồi</p>
                <p className="text-xs text-gray-400">
                  Không ai có thể phản hồi tin của bạn
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Read Receipts */}
        <div className="bg-[#262626] rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Xác nhận đã đọc</h3>
              <p className="text-sm text-gray-400">
                Cho phép người khác biết bạn đã xem tin nhắn của họ. Nếu bạn tắt
                tính năng này, bạn cũng sẽ không thể xem xác nhận đã đọc từ
                người khác.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>

        {/* Show Activity Status in Messages */}
        <div className="bg-[#262626] rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold mb-2">
                Hiển thị trạng thái hoạt động trong tin nhắn
              </h3>
              <p className="text-sm text-gray-400">
                Cho phép những người bạn nhắn tin thấy khi bạn đang hoạt động
                trên Instagram
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
