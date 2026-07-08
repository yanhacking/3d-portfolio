'use client';

import { useState } from 'react';
import { FadeIn } from '@/components/FadeIn';
import { ContactButton } from '@/components/Buttons';
import { Magnet } from '@/components/Magnet';
import content from '@/content/site-content.json';

const navItems = [
  { id: 'about', label: 'Profil' },
  { id: 'skills', label: 'Compétences' },
  { id: 'projects', label: 'Projets' },
  { id: 'education', label: 'Formation' },
  { id: 'contact', label: 'Contact' },
];

export function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section className="h-screen flex flex-col justify-between bg-[#0C0C0C] text-[#D7E2EA] overflow-x-clip relative">
      {/* Navbar */}
      <FadeIn delay={0} y={-20} className="w-full">
        <nav className="flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8 relative z-30">
          <div className="text-sm md:text-lg lg:text-[1.4rem] font-medium uppercase tracking-wider">
            YRA
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-8 lg:gap-10">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-lg lg:text-[1.4rem] font-medium uppercase tracking-wider hover:opacity-70 transition-opacity duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            className="md:hidden flex flex-col justify-center items-end gap-1.5 w-10 h-10 -mr-2"
          >
            <span
              className={`block h-[1.5px] bg-[#D7E2EA] transition-all duration-200 ${menuOpen ? 'w-6 rotate-45 translate-y-[7px]' : 'w-6'}`}
            />
            <span className={`block h-[1.5px] bg-[#D7E2EA] transition-opacity duration-200 w-6 ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span
              className={`block h-[1.5px] bg-[#D7E2EA] transition-all duration-200 ${menuOpen ? 'w-6 -rotate-45 -translate-y-[7px]' : 'w-4'}`}
            />
          </button>
        </nav>
      </FadeIn>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-[#0C0C0C] flex flex-col items-center justify-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setMenuOpen(false)}
              className="text-2xl font-medium uppercase tracking-wider"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative w-full">
        {/* Hero Heading */}
        <FadeIn delay={0.15} y={40} className="w-full overflow-hidden text-center z-5 absolute top-[10%]">
          <h1
            className="
              hero-heading
              font-black uppercase tracking-tight leading-none whitespace-nowrap
              text-[12vw] sm:text-[14vw] md:text-[16vw] lg:text-[17.5vw]
              mt-6 sm:mt-4 md:-mt-5 px-4
            "
          >
            {content.hero.headline}
          </h1>
        </FadeIn>

        {/* Monogram Badge with Magnet Effect - Centered */}
        <Magnet padding={150} strength={3}>
          <div className="relative w-full h-full flex items-center justify-center z-10">
            <div
              className="
                w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] aspect-square
                rounded-full flex flex-col items-center justify-center gap-3
                relative
              "
              style={{
                background: 'radial-gradient(circle at 35% 30%, #B600A8 0%, #18011F 60%, #0C0C0C 100%)',
                boxShadow: '0 0 0 2px rgba(215,226,234,0.15), 0 20px 80px rgba(182,0,168,0.25)',
              }}
            >
              <span className="absolute inset-6 rounded-full border border-[#D7E2EA]/15" />
              <span className="absolute inset-14 rounded-full border border-[#D7E2EA]/10" />
              <span className="font-black tracking-tight text-[clamp(2.5rem,7vw,5rem)] leading-none">
                YRA
              </span>
              <span className="text-[clamp(0.7rem,1.3vw,1rem)] uppercase tracking-[0.3em] opacity-70 text-center px-6">
                Dev &amp; Réseau
              </span>
            </div>
          </div>
        </Magnet>

        {/* Bottom Section */}
        <div className="absolute bottom-0 w-full left-0 right-0">
          <FadeIn delay={0.35} y={20} className="w-full">
            <div className="flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10">
              <p
                className="
                  font-light uppercase tracking-wide leading-snug
                  text-[clamp(0.75rem,1.4vw,1.5rem)]
                  max-w-[160px] sm:max-w-[220px] md:max-w-[260px]
                "
              >
                {content.hero.tagline}
              </p>
              <FadeIn delay={0.5} y={20}>
                <ContactButton />
              </FadeIn>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
