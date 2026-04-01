import { CommunitySection } from "@/components/sections/community-section";
import { EventsSection } from "@/components/sections/events-section";
import { HomeClosingSection } from "@/components/sections/home-closing-section";
import { HomeHeroSection } from "@/components/sections/home-hero-section";
import { NewsHighlightsSection } from "@/components/sections/news-highlights-section";
import { PartnersSection } from "@/components/sections/partners-section";
import { SupportSection } from "@/components/sections/support-section";
import { VideoShowcaseSection } from "@/components/sections/video-showcase-section";

export default function HomePage() {
  return (
    <>
      <HomeHeroSection />
      <NewsHighlightsSection />
      <VideoShowcaseSection />
      <EventsSection />
      <PartnersSection />
      <CommunitySection />
      <SupportSection />
      <HomeClosingSection />
    </>
  );
}
