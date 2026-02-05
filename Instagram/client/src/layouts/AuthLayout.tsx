import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";

// Import images from assets
import pic1 from "@/assets/pic1.png";
import pic2 from "@/assets/pic2.png";
import pic3 from "@/assets/pic3.png";

const showcaseImages = [pic1, pic2, pic3];

interface AuthLayoutProps {
  children: ReactNode;
  showShowcase?: boolean;
}

export default function AuthLayout({
  children,
  showShowcase = false,
}: AuthLayoutProps) {
  const [currentImage, setCurrentImage] = useState(0);

  // Rotate images every 4 seconds
  useEffect(() => {
    if (!showShowcase) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % showcaseImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [showShowcase]);

  return (
    <div className="flex min-h-screen w-full bg-[#0f1419] text-white overflow-hidden relative font-sans">
      {showShowcase && (
        <div className="hidden lg:flex w-[60%] flex-col justify-between p-12 relative bg-[#0f1419]">
          {/* Instagram Logo */}
          <div className="flex items-center"></div>

          {/* Main Content */}
          <div className="flex flex-col items-center flex-1 justify-center -mt-10">
            {/* Tagline */}
            <h1 className="text-4xl font-semibold leading-tight text-center mb-12 tracking-tight">
              See everyday moments from your{" "}
              <span className="bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-transparent bg-clip-text font-bold animate-gradient bg-[length:200%_auto]">
                close friends
              </span>
              .
            </h1>

            {/* Image Showcase */}
            <div className="relative w-full max-w-md aspect-square drop-shadow-2xl">
              {showcaseImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Showcase ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ${
                    currentImage === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="h-16"></div>
        </div>
      )}

      <div
        className={`flex ${
          showShowcase ? "w-full lg:w-[40%]" : "w-full"
        } flex-col items-center justify-center ${
          showShowcase ? "bg-[#1c1f26]" : "bg-[#0f1419]"
        } p-8 relative shadow-[-20px_0_40px_rgba(0,0,0,0.3)]`}
      >
        {children}
      </div>

      <Footer />
    </div>
  );
}
