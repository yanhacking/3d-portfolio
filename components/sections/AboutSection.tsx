'use client';

import { FadeIn } from '@/components/FadeIn';
import { AnimatedText } from '@/components/AnimatedText';
import { ContactButton } from '@/components/Buttons';
import content from '@/content/site-content.json';

export function AboutSection() {
  return (
    <section id="about" className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] relative flex items-center justify-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden">
      {/* Content */}
      <div className="max-w-3xl flex flex-col items-center gap-10 sm:gap-14 md:gap-16 relative z-10">
        {/* Heading */}
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(3rem,12vw,160px)] text-center">
            Qui suis-je
          </h2>
        </FadeIn>

        {/* Animated Paragraph */}
        <div className="w-full flex flex-col gap-16 sm:gap-20 md:gap-24">
          <AnimatedText
            text={content.about.bio}
            className="text-[#D7E2EA] font-medium text-center leading-relaxed text-[clamp(1rem,2vw,1.35rem)] max-w-[560px] mx-auto"
          />

          {/* Detail chips */}
          <FadeIn delay={0.1} y={20} className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {content.about.details.map((d) => (
              <div
                key={d.k}
                className="rounded-full border border-[#D7E2EA]/15 bg-[#D7E2EA]/[0.03] px-5 py-2.5 sm:px-6 sm:py-3 flex items-center gap-2"
              >
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#D7E2EA]/50">
                  {d.k}
                </span>
                <span className="text-xs sm:text-sm font-medium">{d.v}</span>
              </div>
            ))}
          </FadeIn>

          {/* Contact Button */}
          <FadeIn delay={0.2} y={20} className="flex justify-center">
            <ContactButton />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
