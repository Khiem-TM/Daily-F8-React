export default function BlockedAccountsSection() {
  // Mock data - replace with real API call
  const blockedAccounts = [
    {
      id: 1,
      username: "blocked_user_1",
      fullName: "Blocked User One",
      avatar: null,
    },
    {
      id: 2,
      username: "blocked_user_2",
      fullName: "Blocked User Two",
      avatar: null,
    },
  ];

  const handleUnblock = (username: string) => {
    // TODO: Implement API call to unblock user
    console.log("Unblock user:", username);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-2">Tài khoản bị chặn</h2>
      <p className="text-sm text-gray-400 mb-6">
        Khi bạn chặn ai đó, người đó sẽ không thể tìm thấy trang cá nhân, bài
        viết hoặc tin của bạn trên Instagram. Instagram sẽ không cho người đó
        biết bạn đã chặn họ.
      </p>

      {blockedAccounts.length === 0 ? (
        <div className="text-center py-12 bg-[#262626] rounded-2xl">
          <p className="text-gray-400">Bạn chưa chặn ai</p>
        </div>
      ) : (
        <div className="space-y-2">
          {blockedAccounts.map((account) => (
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
              <button
                onClick={() => handleUnblock(account.username)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold transition-colors"
              >
                Bỏ chặn
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
