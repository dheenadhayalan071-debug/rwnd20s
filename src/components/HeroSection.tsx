import React, { useState } from 'react';
import { motion, AnimatePresence } from '../utils/motion';
import { type Product, formatINR } from '../utils/catalogLogic';
import { Starburst, OrbitalRing } from './ChromeVectors';
import { StudioImage } from './StudioImage';
import { DropCountdown } from './DropCountdown';

interface HeroSectionProps {
  heroProducts: Product[];
  onExploreCollection: () => void;
  onOpenQuickView: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

const HERO_TABS = [
  { index: 0, label: '01 CYBER SET' },
  { index: 1, label: '02 PINK CHROME EARPHONES' },
  { index: 2, label: '03 Y2K WATCH' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroProducts,
  onExploreCollection,
  onOpenQuickView,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const currentProduct = heroProducts[activeSlide] || heroProducts[0];

  return (
    <section
      id="home"
      className="metallic-chrome-bg relative overflow-hidden border-b border-black/15 pt-6 pb-14 lg:py-20 text-[#09090B]"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-10">
          {/* Top on Mobile / Right on Desktop: Studio Hardware Showcase on Metallic Chrome */}
          <div className="order-1 flex flex-col items-center lg:order-2 lg:col-span-7">
            <div className="relative flex w-full flex-col items-center justify-center">
              {/* Soft Radial White Studio Spotlight */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 studio-spotlight-intense"
              />

              {/* Subtle Orbital Vector Arc & 4-Point Chrome Starbursts */}
              <OrbitalRing className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[96%] max-w-[560px] opacity-80" />
              <Starburst
                size={32}
                delay={0}
                className="absolute top-4 right-[6%] z-20 sm:right-[10%]"
              />
              <Starburst
                size={24}
                delay={1.5}
                className="absolute bottom-20 left-[6%] z-20 sm:left-[10%]"
              />

              {/* Studio Hardware Card Frame with White Accent Caption Bar */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProduct.id}
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  className="relative z-10 flex w-full max-w-[460px] flex-col items-center"
                >
                  <button
                    type="button"
                    onClick={() => onOpenQuickView(currentProduct)}
                    aria-label={`Inspect ${currentProduct.title}`}
                    className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-black/20 bg-white shadow-[0_24px_60px_rgba(9,9,11,0.16)] focus:outline-none cursor-pointer"
                  >
                    {/* Top-Left White Accent Status Pill */}
                    <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-black/20 bg-white/95 px-3 py-1 font-mono-tech text-[10px] font-bold tracking-wider text-[#09090B] uppercase shadow-xs backdrop-blur-md">
                      <span>{currentProduct.specBadge}</span>
                    </div>

                    <StudioImage
                      src={currentProduct.images[0]}
                      alt={currentProduct.imageAlt || currentProduct.title}
                      loading="eager"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Bottom White Accent Caption Bar */}
                    <div className="absolute inset-x-3 bottom-3 z-20 flex items-center justify-between rounded-2xl border border-black/15 bg-white/95 px-4 py-3 text-left shadow-sm backdrop-blur-md">
                      <div>
                        <p className="font-display text-sm sm:text-base font-extrabold tracking-wide text-[#09090B] uppercase">
                          {currentProduct.title}
                        </p>
                        <p className="font-mono-tech text-[11px] text-[#3F3F46]">
                          {currentProduct.subtitle}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="block rounded-full border border-black/15 bg-[#09090B] px-3.5 py-1 font-mono-tech text-xs font-bold text-white">
                          {formatINR(currentProduct.price)}
                        </span>
                        <span className="mt-0.5 block font-mono-tech text-[10px] text-[#52525B] line-through">
                          {formatINR(currentProduct.compareAtPrice)}
                        </span>
                      </div>
                    </div>
                  </button>
                </motion.div>
              </AnimatePresence>

              {/* Interactive Stage Switcher: Clean White Accent Pill Tabs */}
              <div
                role="tablist"
                aria-label="Hero hardware showcase switcher"
                className="relative z-20 mt-5 inline-flex max-w-full flex-wrap items-center justify-center gap-1 sm:gap-2 rounded-full border border-black/15 bg-white/75 p-1 sm:p-1.5 shadow-xs backdrop-blur-md"
              >
                {HERO_TABS.map((tab) => {
                  const isActive = activeSlide === tab.index;
                  return (
                    <button
                      key={tab.label}
                      role="tab"
                      type="button"
                      aria-selected={isActive}
                      onClick={() => setActiveSlide(tab.index)}
                      className={`rounded-full px-3 sm:px-4 py-1.5 sm:py-2 font-mono-tech text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase transition-colors duration-100 whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? 'border border-black/20 bg-white text-[#09090B] font-bold shadow-xs'
                          : 'text-[#3F3F46] hover:text-[#09090B]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom on Mobile / Left on Desktop: High-Converting Luxury Copy Stack */}
          <div className="order-2 flex flex-col items-start lg:order-1 lg:col-span-5">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-1.5 font-mono-tech text-[11px] font-bold tracking-[0.2em] text-[#09090B] uppercase shadow-xs">
              <span>+ DROP 01 // LIVE NOW</span>
            </div>

            <h1 className="w-full text-balance leading-[0.96] tracking-tight">
              <span className="block font-display text-4xl font-extrabold tracking-tight text-[#09090B] uppercase sm:text-6xl lg:text-[4rem]">
                TIMELESS
              </span>
              <span className="mt-1.5 block font-editorial text-4xl font-normal italic tracking-wide text-[#27272A] sm:text-5xl lg:text-[3.5rem]">
                BUT MAKE IT Y2K.
              </span>
            </h1>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-[#27272A] sm:text-base line-clamp-3">
              Heavy 316L steel hardware, pink chrome Type-C wired earphones &amp;
              analog chronographs. Free shipping above ₹999. Cash on Delivery
              available.
            </p>

            {/* Drop Countdown Component styled with retro-window-bar */}
            <div className="mt-6">
              <DropCountdown />
            </div>

            {/* Full-Width White Accent Pill CTA Button with Black Text */}
            <div className="mt-7 w-full">
              <button
                type="button"
                onClick={onExploreCollection}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-black/20 bg-white px-8 py-4 font-mono-tech text-xs font-bold tracking-widest text-[#09090B] uppercase shadow-[0_10px_28px_rgba(9,9,11,0.12)] transition-colors hover:bg-[#09090B] hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>SHOP DROP 01 →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

