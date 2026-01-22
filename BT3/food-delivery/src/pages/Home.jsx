import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import RestaurantsSection from "@/components/home/RestaurantsSection";
import FAQSection from "@/components/home/FAQSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <RestaurantsSection />
      <FAQSection />
    </div>
  );
}
