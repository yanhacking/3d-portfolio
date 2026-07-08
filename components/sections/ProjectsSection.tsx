'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { LiveProjectButton } from '@/components/Buttons';
import content from '@/content/site-content.json';

const projects = content.projects.map((p, idx) => ({
  ...p,
  number: String(idx + 1).padStart(2, '0'),
}));

type Project = (typeof projects)[number];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 1 - (projects.length - 1 - index) * 0.03]
  );

  return (
    <motion.div
      ref={ref}
      style={{
        scale,
        top: `${index * 28}px`,
      }}
      className="sticky top-24 md:top-32 h-[92vh] flex items-center justify-center px-4 sm:px-6 md:px-8 z-20"
    >
      <div className="w-full bg-[#0C0C0C] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] p-4 sm:p-6 md:p-8 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="flex-1">
            <p className="font-black text-[clamp(2rem,8vw,120px)] leading-none text-[#D7E2EA] mb-2">
              {project.number}
            </p>
            <div className="flex flex-col gap-1">
              <p className="text-xs sm:text-sm md:text-base text-[#D7E2EA]/60 uppercase tracking-widest">
                {project.category}
              </p>
              <h3 className="text-lg sm:text-xl md:text-2xl font-medium uppercase text-[#D7E2EA]">
                {project.name}
              </h3>
            </div>
          </div>
          <LiveProjectButton href={project.liveUrl || content.contact.github}>
            {project.liveUrl ? 'Voir le site' : 'Voir sur GitHub'}
          </LiveProjectButton>
        </div>

        {/* Description + tech */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-3">
          <p className="text-sm sm:text-base text-[#D7E2EA]/70 max-w-2xl">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-[10px] sm:text-xs uppercase tracking-widest text-[#D7E2EA]/70 border border-[#D7E2EA]/20 rounded-full px-3 py-1"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Visual Grid */}
        <div className="flex gap-4 h-[40vh] sm:h-[44vh] md:h-[48vh] min-h-0 overflow-hidden">
          {/* Left Column - 2 panels */}
          <div className="w-2/5 h-full min-h-0 flex flex-col gap-4">
            <div
              className="relative flex-[2] min-h-0 overflow-hidden rounded-[40px] sm:rounded-[50px] md:rounded-[60px] flex items-center justify-center"
              style={{ background: project.gradient }}
            >
              <span className="text-4xl sm:text-5xl opacity-90">{project.emoji}</span>
            </div>
            <div
              className="relative flex-[3] min-h-0 overflow-hidden rounded-[40px] sm:rounded-[50px] md:rounded-[60px] flex items-center justify-center"
              style={{ background: project.gradient, opacity: 0.85 }}
            >
              <span className="text-3xl sm:text-4xl opacity-80">{project.emoji}</span>
            </div>
          </div>

          {/* Right Column - 1 tall panel */}
          <div
            className="relative w-3/5 h-full min-h-0 overflow-hidden rounded-[40px] sm:rounded-[50px] md:rounded-[60px] flex items-center justify-center"
            style={{ background: project.gradient, filter: 'brightness(1.1)' }}
          >
            <span className="text-6xl sm:text-7xl md:text-8xl opacity-90">{project.emoji}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-5 sm:px-8 md:px-10 pt-20 pb-20 relative z-10">
      {/* Heading */}
      <div className="max-w-7xl mx-auto mb-20 sm:mb-24 md:mb-32">
        <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(3rem,12vw,160px)] text-[#D7E2EA]">
          Projets
        </h2>
      </div>

      {/* Cards Stack */}
      <div
        className="max-w-7xl mx-auto relative"
        style={{ height: `${projects.length * 100}vh` }}
      >
        {projects.map((project, idx) => (
          <ProjectCard key={project.number} project={project} index={idx} />
        ))}
      </div>
    </section>
  );
}
