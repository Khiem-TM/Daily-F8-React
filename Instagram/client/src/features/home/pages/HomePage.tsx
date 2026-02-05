import StoryCarousel from "../components/StoryCarousel";
import PostFeed from "../components/PostFeed";
import SuggestedUsers from "../components/SuggestedUsers";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex justify-center gap-16 px-20">
      {/* Main Feed */}
      <div className="max-w-[470px] w-full py-8">
        <StoryCarousel />
        <PostFeed />
      </div>

      <SuggestedUsers />
    </div>
  );
}
