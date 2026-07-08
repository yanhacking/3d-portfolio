'use client';

import { motion, useScroll } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const skillsRow1 = [
  'React', 'React Native', 'Flutter', 'JavaScript', 'TypeScript',
  'Laravel', 'Node.js', 'Express', 'REST APIs', 'Python', 'MySQL',
];

const skillsRow2 = [
  'PostgreSQL', 'Firebase', 'MongoDB', 'Git', 'GitHub', 'Docker', 'Linux',
  'Cisco CCNA', 'Windows Server', 'VPN', 'Firewalls', 'AI Agents', 'NLP',
];

function MarqueeRow({
  items,
  direction = 'right',
  offset,
}: {
  items: string[];
  direction?: 'left' | 'right';
  offset: number;
}) {
  const tripled = [...items, ...items, ...items];

  const moveAmount = direction === 'right' ? offset - 200 : -(offset - 200);

  return (
    <motion.div
      className="flex gap-3"
      style={{
        x: moveAmount,
        willChange: 'transform',
      }}
    >
      {tripled.map((skill, idx) => (
        <div
          key={idx}
          className="
            flex-shrink-0 h-[70px] sm:h-[84px] px-7 sm:px-9
            rounded-full border border-[#D7E2EA]/15 bg-[#D7E2EA]/[0.03]
            flex items-center justify-center gap-3
          "
        >
          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#B600A8] to-[#BE4C00] flex-shrink-0" />
          <span className="text-sm sm:text-base md:text-lg font-medium uppercase tracking-wider text-[#D7E2EA] whitespace-nowrap">
            {skill}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

export function MarqueeSection() {
  const ref = useRef<HTMLDivElement>(null);
  useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const sectionTop = ref.current.getBoundingClientRect().top + window.scrollY;
      const scrollOffset =
        (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(scrollOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={ref}
      className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-x-hidden"
    >
      <div className="flex flex-col gap-3">
        <MarqueeRow items={skillsRow1} direction="right" offset={offset} />
        <MarqueeRow items={skillsRow2} direction="left" offset={offset} />
      </div>
    </section>
  );
}
