'use client';

import { FadeIn } from '@/components/FadeIn';
import { ContactButton } from '@/components/Buttons';
import content from '@/content/site-content.json';

const navLinks = [
  { id: 'about', label: 'Profil' },
  { id: 'skills', label: 'Compétences' },
  { id: 'projects', label: 'Projets' },
  { id: 'education', label: 'Formation' },
];

const contactLinks = [
  { label: `@${content.contact.github.split('/').pop()}`, href: content.contact.github },
  { label: content.contact.phone, href: `tel:${content.contact.phone.replace(/\s+/g, '')}` },
];

const serviceLinks = content.skills.map((s) => s.name);

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="text-sm sm:text-base font-light uppercase tracking-widest text-[#D7E2EA]/60 hover:text-[#D7E2EA] transition-colors duration-200"
    >
      {children}
    </a>
  );
}

export function FooterSection() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-[#0C0C0C] text-[#D7E2EA] px-5 sm:px-8 md:px-10 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* CTA Card */}
        <FadeIn delay={0} y={30}>
          <div className="border-2 border-[#D7E2EA] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] p-6 sm:p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12">
            <div className="flex flex-col gap-3 sm:gap-4">
              <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(2rem,6vw,72px)]">
                Travaillons
                <br />
                Ensemble
              </h2>
              <p className="font-light uppercase tracking-widest text-[#D7E2EA]/60 text-xs sm:text-sm max-w-md leading-relaxed">
                Disponible pour des opportunités internationales dès août 2026
              </p>
            </div>
            <div className="flex-shrink-0">
              <ContactButton />
            </div>
          </div>
        </FadeIn>

        {/* Links Grid */}
        <FadeIn delay={0.1} y={20}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12 mt-14 sm:mt-16 md:mt-20 py-12 sm:py-14 border-t border-[#D7E2EA]/15">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
              <p className="text-lg md:text-xl font-medium uppercase tracking-wider">
                Yan Rooven Andrew
              </p>
              <p className="font-light text-sm leading-relaxed text-[#D7E2EA]/50 max-w-[220px]">
                Développeur Web & Mobile et Administrateur Réseau basé à Port-au-Prince, Haïti.
              </p>
            </div>

            {/* Navigation */}
            <div className="flex flex-col gap-4 sm:gap-5">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D7E2EA]/40">
                Navigation
              </p>
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <FooterLink key={link.id} href={`#${link.id}`}>
                    {link.label}
                  </FooterLink>
                ))}
              </nav>
            </div>

            {/* Services */}
            <div className="flex flex-col gap-4 sm:gap-5">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D7E2EA]/40">
                Compétences
              </p>
              <nav className="flex flex-col gap-3">
                {serviceLinks.map((link) => (
                  <FooterLink key={link} href="#skills">
                    {link}
                  </FooterLink>
                ))}
              </nav>
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-4 sm:gap-5">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D7E2EA]/40">
                Contact
              </p>
              <nav className="flex flex-col gap-3">
                {contactLinks.map((link) => (
                  <FooterLink key={link.label} href={link.href}>
                    {link.label}
                  </FooterLink>
                ))}
              </nav>
              <a
                href={`mailto:${content.contact.email}`}
                className="text-sm sm:text-base font-light uppercase tracking-widest text-[#D7E2EA]/60 hover:text-[#D7E2EA] transition-colors duration-200 mt-2"
              >
                {content.contact.email}
              </a>
            </div>
          </div>
        </FadeIn>

        {/* Bottom Bar */}
        <FadeIn delay={0.15} y={10}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 pt-8 border-t border-[#D7E2EA]/15">
            <p className="text-xs sm:text-sm font-light uppercase tracking-widest text-[#D7E2EA]/40 text-center sm:text-left">
              &copy; {new Date().getFullYear()} Yan Rooven Andrew. Tous droits réservés.
            </p>
            <p className="text-xs sm:text-sm font-light uppercase tracking-widest text-[#D7E2EA]/40">
              Développeur & Admin Réseau
            </p>
            <button
              onClick={scrollToTop}
              className="text-xs sm:text-sm font-medium uppercase tracking-widest text-[#D7E2EA]/60 hover:text-[#D7E2EA] transition-colors duration-200 border-2 border-[#D7E2EA]/30 hover:border-[#D7E2EA]/60 rounded-full px-6 py-2"
            >
              Haut de page
            </button>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
