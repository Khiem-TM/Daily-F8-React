export default function HideStorySection() {
  // Mock data - replace with real API call
  const hiddenAccounts = [
    {
      id: 1,
      username: "hidden_user_1",
      fullName: "Hidden User One",
      avatar: null,
    },
  ];

  const suggestedAccounts = [
    { id: 2, username: "user_2", fullName: "User Two", avatar: null },
    { id: 3, username: "user_3", fullName: "User Three", avatar: null },
    { id: 4, username: "user_4", fullName: "User Four", avatar: null },
  ];

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-2">Ẩn tin và video trực tiếp</h2>
      <p className="text-sm text-gray-400 mb-6">
        Ẩn tin và video trực tiếp của bạn khỏi những người cụ thể. Họ sẽ không
        biết bạn đã ẩn tin và video trực tiếp của mình khỏi họ.
      </p>

      {/* Currently Hidden */}
      {hiddenAccounts.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold mb-4">
            Đang ẩn tin khỏi ({hiddenAccounts.length})
          </h3>
          <div className="space-y-2">
            {hiddenAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center gap-3 p-3 bg-[#262626] rounded-lg hover:bg-[#2a2a2a] transition-colors"
              >
                <div className="w-11 h-11 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold shrink-0">
                  {account.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{account.username}</p>
                  <p className="text-sm text-gray-400 truncate">
                    {account.fullName}
                  </p>
                </div>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold transition-colors">
                  Bỏ ẩn
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Add */}
      <div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full bg-[#262626] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-gray-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          {suggestedAccounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center gap-3 p-3 bg-[#262626] rounded-lg hover:bg-[#2a2a2a] transition-colors"
            >
              <div className="w-11 h-11 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold shrink-0">
                {account.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{account.username}</p>
                <p className="text-sm text-gray-400 truncate">
                  {account.fullName}
                </p>
              </div>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-semibold transition-colors">
                Ẩn
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
