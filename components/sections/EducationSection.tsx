'use client';

import { FadeIn } from '@/components/FadeIn';
import content from '@/content/site-content.json';

export function EducationSection() {
  return (
    <section id="education" className="bg-[#0C0C0C] text-[#D7E2EA] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-10">
      {/* Heading */}
      <FadeIn delay={0} y={40} className="mb-16 sm:mb-20 md:mb-28">
        <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(3rem,12vw,160px)] text-center">
          Formation
        </h2>
      </FadeIn>

      {/* Timeline */}
      <div className="max-w-5xl mx-auto">
        {content.education.map((item, idx) => (
          <FadeIn
            key={item.name}
            delay={idx * 0.1}
            y={20}
            className="border-b border-[#D7E2EA]/15 last:border-0 py-8 sm:py-10 md:py-12 flex flex-col sm:flex-row gap-3 sm:gap-8 md:gap-12"
          >
            <div className="flex-shrink-0 sm:w-48">
              <p className="text-xs sm:text-sm uppercase tracking-widest text-[#D7E2EA]/50">
                {item.date}
              </p>
            </div>
            <div className="flex-1 flex flex-col gap-2 sm:gap-3">
              <h3 className="font-medium uppercase text-[clamp(1rem,2.2vw,2.1rem)] leading-tight">
                {item.name}
              </h3>
              <p className="text-sm sm:text-base text-[#D7E2EA]/60">{item.school}</p>
              <p className="font-light leading-relaxed text-[clamp(0.85rem,1.6vw,1.15rem)] text-[#D7E2EA]/60 max-w-2xl">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] sm:text-xs uppercase tracking-widest text-[#D7E2EA]/70 border border-[#D7E2EA]/20 rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
