import { Container } from "@/components/layout/container";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { Reveal } from "@/components/shared/reveal";
import { homeHero, homePillars } from "@/data/home";

export function HomeHeroSection() {
  return (
    <Reveal
      as="section"
      className="relative overflow-hidden py-8 sm:py-12"
    >
      <Container className="space-y-12">
        {/* Top Grid - Asymmetrical Layout */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
          
          {/* Main Article (Left) - Light Theme */}
          <div className="flex flex-col md:flex-row gap-6 border-b lg:border-b-0 lg:border-r border-border pb-8 lg:pb-0 lg:pr-6">
            <div className="flex-1 space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                TECHNOLOGY / PEOPLE
              </p>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.1] font-medium tracking-tight text-foreground">
                {homeHero.title}
              </h1>
              
              <div className="flex gap-4">
                <p className="text-sm leading-relaxed text-muted-foreground w-1/2">
                  {homeHero.description}
                </p>
                <p className="font-heading text-xl italic leading-tight text-foreground w-1/2 border-l border-border pl-4">
                  &quot;We will not shrink from this responsibility.&quot;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <div className="size-8 rounded-full bg-muted border border-border" />
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  By <span className="font-bold text-foreground">REDACAO ALGARVE</span>
                  <br />
                  <span className="font-normal opacity-80">Oct 18, 2026</span>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-5/12 h-[300px] md:h-auto shrink-0 border border-border bg-muted">
              <MediaPlaceholder
                label="Main Image"
                tone="hero"
                className="h-full w-full object-cover grayscale"
              />
            </div>
          </div>

          {/* Secondary Article (Right) - Dark Theme */}
          <div className="bg-[#111111] text-white p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group">
             {/* Simulating image background */}
             <div className="absolute inset-0 z-0 opacity-40 grayscale group-hover:opacity-50 transition-opacity duration-500 bg-gradient-to-t from-black to-transparent" />
             <div className="relative z-10 space-y-4 max-w-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                  SPORT
                </p>
                <h2 className="font-heading text-3xl sm:text-4xl leading-[1.1] font-medium tracking-tight">
                  Surfing Under the Northern Lights
                </h2>
                <p className="text-sm leading-relaxed text-white/80">
                  There is a thriving surf scene in Norway&apos;s Lofoten Islands, where the waves are cold and the air is colder.
                </p>
             </div>

             <div className="relative z-10 flex items-center gap-3 mt-12">
                <div className="size-8 rounded-full bg-white/20" />
                <div className="text-[10px] uppercase tracking-widest text-white/70">
                  By <span className="font-bold text-white">NICK WINGFIELD</span>
                  <br />
                  <span className="font-normal opacity-80">Nov 28, 2026</span>
                </div>
             </div>
          </div>
        </div>

        {/* Bottom Row - Smaller Articles */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 border-t border-b border-border py-6">
           {homePillars.map((item) => (
             <div key={item.title} className="flex gap-4 group cursor-pointer">
               <div className="size-16 shrink-0 bg-muted border border-border grayscale group-hover:grayscale-0 transition-all" />
               <div className="space-y-1">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                   {item.tag}
                 </p>
                 <h3 className="font-heading text-base leading-snug font-medium text-foreground group-hover:underline decoration-foreground/30 underline-offset-2">
                   {item.title}
                 </h3>
               </div>
             </div>
           ))}
        </div>
      </Container>
    </Reveal>
  );
}
