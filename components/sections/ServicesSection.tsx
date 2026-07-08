'use client';

import { FadeIn } from '@/components/FadeIn';
import content from '@/content/site-content.json';

export function ServicesSection() {
  return (
    <section id="skills" className="bg-white text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32">
      {/* Heading */}
      <FadeIn delay={0} y={40} className="mb-16 sm:mb-20 md:mb-28">
        <h2 className="font-black uppercase text-[clamp(3rem,12vw,160px)] text-center leading-none">
          Compétences
        </h2>
      </FadeIn>

      {/* Services List */}
      <div className="max-w-5xl mx-auto">
        {content.skills.map((service, idx) => (
          <FadeIn
            key={service.name}
            delay={idx * 0.1}
            y={20}
            className="border-b border-[rgba(12,12,12,0.15)] last:border-0 py-8 sm:py-10 md:py-12 flex gap-6 sm:gap-8 md:gap-12"
          >
            <div className="flex-shrink-0">
              <p className="font-black text-[clamp(3rem,10vw,140px)] leading-none text-[#0C0C0C]">
                {String(idx + 1).padStart(2, '0')}
              </p>
            </div>
            <div className="flex-1 flex flex-col gap-2 sm:gap-3">
              <h3 className="font-medium uppercase text-[clamp(1rem,2.2vw,2.1rem)] leading-tight text-[#0C0C0C]">
                {service.name}
              </h3>
              <p className="font-light leading-relaxed text-[clamp(0.85rem,1.6vw,1.25rem)] opacity-60 max-w-2xl">
                {service.description}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
