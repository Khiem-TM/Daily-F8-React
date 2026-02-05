import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Play } from "lucide-react";
import { handleImageError } from "@/utils/media";

interface PostMediaProps {
  imageUrl?: string | null;
  video?: string | null;
  caption: string;
  onDoubleClick?: () => void;
}

export default function PostMedia({
  imageUrl,
  video,
  caption,
  onDoubleClick,
}: PostMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Intersection Observer - autoplay when in view
  useEffect(() => {
    if (!video || !videoRef.current || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video is in view - play
            videoRef.current?.play().catch(() => {});
            setIsPlaying(true);
          } else {
            // Video is out of view - pause
            videoRef.current?.pause();
            setIsPlaying(false);
          }
        });
      },
      {
        threshold: 0.5, // 50% visible
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [video]);

  // Handle video click to toggle play/pause
  const handleVideoClick = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Toggle mute
  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
    if (!newMuted) {
      videoRef.current.volume = volume;
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  };

  // If no media at all, show placeholder
  if (!video && !imageUrl) {
    return (
      <div className="relative w-full aspect-square bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500">Không có media</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square bg-black cursor-pointer select-none"
      onDoubleClick={onDoubleClick}
    >
      {video ? (
        <>
          <video
            ref={videoRef}
            src={video}
            className="w-full h-full object-contain"
            loop
            playsInline
            muted={isMuted}
            onClick={handleVideoClick}
          />

          {/* Play indicator when paused */}
          {!isPlaying && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              onClick={handleVideoClick}
            >
              <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                <Play className="text-white ml-1" size={28} fill="white" />
              </div>
            </div>
          )}

          {/* Volume Control - Bottom Right */}
          <div
            className="absolute bottom-3 right-3 z-10"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            {/* Vertical Volume Slider */}
            {showVolumeSlider && (
              <div className="absolute bottom-full right-0 mb-2 bg-black/80 rounded-lg p-2 h-24">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  onClick={(e) => e.stopPropagation()}
                  className="w-1 h-20 appearance-none bg-white/30 rounded-full cursor-pointer [writing-mode:vertical-lr] [direction:rtl]"
                  style={{
                    background: `linear-gradient(to top, white ${
                      (isMuted ? 0 : volume) * 100
                    }%, rgba(255,255,255,0.3) ${
                      (isMuted ? 0 : volume) * 100
                    }%)`,
                  }}
                />
              </div>
            )}

            <button
              onClick={handleMuteToggle}
              className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="text-white" size={16} />
              ) : (
                <Volume2 className="text-white" size={16} />
              )}
            </button>
          </div>
        </>
      ) : (
        <img
          src={imageUrl!}
          alt={caption}
          className="w-full h-full object-contain"
          draggable={false}
          onError={(e) => handleImageError(e, "Image Not Found")}
        />
      )}
    </div>
  );
}
