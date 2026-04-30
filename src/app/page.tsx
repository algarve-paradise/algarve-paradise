import { CommunitySection } from "@/components/sections/community-section";
import { EventsSection } from "@/components/sections/events-section";
import { HomeClosingSection } from "@/components/sections/home-closing-section";
import { HomeHeroSection } from "@/components/sections/home-hero-section";
import { HomeIntroSection } from "@/components/sections/home-intro-section";
import { NewsHighlightsSection } from "@/components/sections/news-highlights-section";

export default function HomePage() {
  return (
    <>
      <HomeHeroSection />
      <HomeIntroSection />
      <NewsHighlightsSection />
      <EventsSection />
      <CommunitySection />
      <HomeClosingSection />
    </>
  );
}
