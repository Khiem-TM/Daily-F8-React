export default function AccountPrivacySection() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-6">Quyền riêng tư tài khoản</h2>

      <div className="space-y-4">
        {/* Private Account */}
        <div className="bg-[#262626] rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Tài khoản riêng tư</h3>
              <p className="text-sm text-gray-400">
                Khi tài khoản của bạn ở chế độ riêng tư, chỉ những người bạn
                chấp thuận mới có thể xem ảnh và video của bạn trên Instagram.
                Những người theo dõi bạn hiện tại sẽ không bị ảnh hưởng.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>

        {/* Activity Status */}
        <div className="bg-[#262626] rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Trạng thái hoạt động</h3>
              <p className="text-sm text-gray-400">
                Cho phép các tài khoản mà bạn theo dõi và bất kỳ ai bạn nhắn tin
                xem khi bạn hoạt động lần cuối trên ứng dụng Instagram.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>

        {/* Story Sharing */}
        <div className="bg-[#262626] rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Chia sẻ tin</h3>
              <p className="text-sm text-gray-400">
                Cho phép mọi người chia sẻ bài viết của bạn vào tin của họ
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>

        {/* Comments */}
        <div className="bg-[#262626] rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Bình luận</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="comments"
                defaultChecked
                className="w-4 h-4 accent-blue-500"
              />
              <span className="text-sm">Cho phép bình luận từ mọi người</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="comments"
                className="w-4 h-4 accent-blue-500"
              />
              <span className="text-sm">
                Chỉ người tôi theo dõi mới có thể bình luận
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="comments"
                className="w-4 h-4 accent-blue-500"
              />
              <span className="text-sm">Tắt bình luận</span>
            </label>
          </div>
        </div>

        {/* Mentions */}
        <div className="bg-[#262626] rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Nhắc đến</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="mentions"
                defaultChecked
                className="w-4 h-4 accent-blue-500"
              />
              <span className="text-sm">Cho phép nhắc đến từ mọi người</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="mentions"
                className="w-4 h-4 accent-blue-500"
              />
              <span className="text-sm">
                Chỉ người tôi theo dõi mới có thể nhắc đến tôi
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="mentions"
                className="w-4 h-4 accent-blue-500"
              />
              <span className="text-sm">Không cho phép nhắc đến</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
