import { Grid, Bookmark, Film } from "lucide-react";

type TabType = "posts" | "saved" | "videos";

interface ProfileTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isOwnProfile: boolean;
}

export default function ProfileTabs({
  activeTab,
  setActiveTab,
  isOwnProfile,
}: ProfileTabsProps) {
  const tabs = [
    { id: "posts" as TabType, label: "BÀI VIẾT", icon: Grid },
    ...(isOwnProfile
      ? [{ id: "saved" as TabType, label: "ĐÃ LƯU", icon: Bookmark }]
      : []),
    { id: "videos" as TabType, label: "VIDEO", icon: Film },
  ];

  return (
    <div className="border-t border-gray-800">
      <div className="flex justify-center gap-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 border-t transition-colors ${
                isActive
                  ? "border-white text-white"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
              style={{ marginTop: "-1px" }}
            >
              <Icon size={12} />
              <span className="text-xs font-semibold tracking-wide">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
