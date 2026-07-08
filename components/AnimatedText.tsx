'use client';

import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export function AnimatedText({ text, className = '' }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const [characters, setCharacters] = useState<
    { char: string; index: number }[]
  >([]);

  useEffect(() => {
    setCharacters(
      text.split('').map((char, index) => ({ char, index }))
    );
  }, [text]);

  return (
    <p ref={ref} className={className}>
      {characters.map((item) => (
        <CharacterAnimation
          key={item.index}
          character={item.char}
          index={item.index}
          totalCharacters={characters.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </p>
  );
}

function CharacterAnimation({
  character,
  index,
  totalCharacters,
  scrollYProgress,
}: {
  character: string;
  index: number;
  totalCharacters: number;
  scrollYProgress: MotionValue<number>;
}) {
  const opacity = useTransform(scrollYProgress, (progress) => {
    const characterProgress = index / totalCharacters;
    const start = Math.max(0, characterProgress - 0.1);
    const end = Math.min(1, characterProgress + 0.1);

    if (progress < start) return 0.2;
    if (progress > end) return 1;

    return 0.2 + (progress - start) / (end - start) * 0.8;
  });

  return (
    <motion.span
      style={{ opacity }}
      className="relative"
    >
      {character}
    </motion.span>
  );
}
