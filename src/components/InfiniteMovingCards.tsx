import React, { useEffect, useState, useRef, useMemo } from "react";
import { Star, Quote } from 'lucide-react';

interface TestimonialItem {
  quote: string;
  name: string;
  title: string;
  image?: string;
  initial?: string;
}

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: TestimonialItem[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const duration = useMemo(() => {
    if (speed === "fast") return "20s";
    if (speed === "normal") return "40s";
    return "80s";
  }, [speed]);

  const animationDirection = useMemo(() => {
    return direction === "left" ? "forwards" : "reverse";
  }, [direction]);

  // We duplicate the items to create the infinite scroll effect
  const duplicatedItems = useMemo(() => [...items, ...items], [items]);

  return (
    <div
      ref={containerRef}
      className={`scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] ${className}`}
      style={{
        "--animation-duration": duration,
        "--animation-direction": animationDirection,
      } as React.CSSProperties}
    >
      <style>{`
        @keyframes scroll {
          to {
            transform: translate(calc(-50% - 0.5rem));
          }
        }
        .animate-scroll {
          animation: scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite;
          will-change: transform;
        }
      `}</style>
      <ul
        className={`flex min-w-full shrink-0 gap-4 md:gap-6 py-4 w-max flex-nowrap animate-scroll ${
          pauseOnHover && "hover:[animation-play-state:paused]"
        }`}
      >
        {duplicatedItems.map((item, idx) => (
          <li
            className="w-[180px] max-w-full relative rounded-[16px] md:rounded-[28px] border border-marrom-profundo/10 flex-shrink-0 px-3 py-4 md:px-8 md:py-10 md:w-[450px] bg-bege backdrop-blur-xl shadow-lg"
            key={`${item.name}-${idx}`}
          >
            <blockquote className="flex flex-col h-full justify-between relative">
              <Quote className="absolute -top-2 -left-2 w-6 h-6 md:w-12 md:h-12 text-marrom-profundo opacity-10" />
              
              <div className="relative z-20">
                <div className="flex gap-1 text-marrom-profundo mb-2 md:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 md:w-4 md:h-4 fill-current" />
                  ))}
                </div>
                <span className="relative z-20 text-[10px] md:text-lg italic leading-[1.5] text-marrom-profundo font-serif">
                  "{item.quote}"
                </span>
              </div>

              <div className="relative z-20 mt-3 md:mt-8 flex flex-row items-center gap-2 md:gap-4">
                <div className="w-7 h-7 md:w-12 md:h-12 rounded-full overflow-hidden bg-marrom-profundo flex items-center justify-center text-bege font-bold text-[10px] md:text-lg border border-marrom-profundo/30">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    item.initial
                  )}
                </div>
                <span className="flex flex-col">
                  <span className="text-[10px] leading-tight text-marrom-profundo font-bold">
                    {item.name}
                  </span>
                  <span className="text-[9px] leading-tight text-marrom-profundo/60 font-normal">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
