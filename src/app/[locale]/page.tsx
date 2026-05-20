import { CommunitySection } from "@/components/sections/community-section";
import { CronicaDaSemanaSection } from "@/components/sections/cronica-da-semana-section";
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
      <CronicaDaSemanaSection />
      <EventsSection />
      <CommunitySection />
      <HomeClosingSection />
    </>
  );
}
