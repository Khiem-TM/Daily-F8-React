export default function CloseFriendsSection() {
  // Mock data - replace with real API call
  const closeFriends = [
    { id: 1, username: "user_1", fullName: "User One", avatar: null },
    { id: 2, username: "user_2", fullName: "User Two", avatar: null },
  ];

  const suggestedFriends = [
    { id: 3, username: "user_3", fullName: "User Three", avatar: null },
    { id: 4, username: "user_4", fullName: "User Four", avatar: null },
    { id: 5, username: "user_5", fullName: "User Five", avatar: null },
  ];

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-2">Bạn thân</h2>
      <p className="text-sm text-gray-400 mb-6">
        Chia sẻ tin với bạn thân của bạn. Chỉ bạn mới biết ai đó có trong danh
        sách bạn thân của mình.
      </p>

      {/* Current Close Friends */}
      {closeFriends.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold mb-4">
            Danh sách bạn thân của bạn ({closeFriends.length})
          </h3>
          <div className="space-y-2">
            {closeFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center gap-3 p-3 bg-[#262626] rounded-lg hover:bg-[#2a2a2a] transition-colors"
              >
                <div className="w-11 h-11 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold shrink-0">
                  {friend.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{friend.username}</p>
                  <p className="text-sm text-gray-400 truncate">
                    {friend.fullName}
                  </p>
                </div>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold transition-colors">
                  Xóa
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Friends */}
      <div>
        <h3 className="font-semibold mb-4">Gợi ý</h3>
        <div className="space-y-2">
          {suggestedFriends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center gap-3 p-3 bg-[#262626] rounded-lg hover:bg-[#2a2a2a] transition-colors"
            >
              <div className="w-11 h-11 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold shrink-0">
                {friend.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{friend.username}</p>
                <p className="text-sm text-gray-400 truncate">
                  {friend.fullName}
                </p>
              </div>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-semibold transition-colors">
                Thêm
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
