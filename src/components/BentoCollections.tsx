import React from 'react';
import { type CategoryHandle, type Product } from '../utils/catalogLogic';
import { StudioImage } from './StudioImage';

interface BentoCollectionsProps {
  products: Product[];
  activeCategory: CategoryHandle;
  onSelectCategory: (category: CategoryHandle) => void;
}

interface BentoCategoryItem {
  handle: Exclude<CategoryHandle, 'all' | 'everyday-drop' | 'premium-drop' | 'earrings' | 'watches'>;
  title: string;
  subtitle: string;
  colSpanClass: string;
  sampleProductId: string;
}

const BENTO_CATEGORIES: BentoCategoryItem[] = [
  {
    handle: 'cyber-bundle',
    title: '3-PC CYBER SET',
    subtitle: 'Complete Hardware Bundle',
    colSpanClass: 'lg:col-span-3',
    sampleProductId: 'rwnd-bun-01',
  },
  {
    handle: 'chrome-earphones',
    title: 'CHROME EARPHONES',
    subtitle: 'Type-C Wired Audio',
    colSpanClass: 'lg:col-span-3',
    sampleProductId: 'rwnd-iem-01',
  },
  {
    handle: 'y2k-rings',
    title: 'Y2K RINGS',
    subtitle: 'Heavy Steel Signets',
    colSpanClass: 'lg:col-span-2',
    sampleProductId: 'rwnd-ring-01',
  },
  {
    handle: 'chains',
    title: 'CHAINS',
    subtitle: '316L Pendant Links',
    colSpanClass: 'lg:col-span-2',
    sampleProductId: 'rwnd-chain-01',
  },
  {
    handle: 'bracelets',
    title: 'BRACELETS',
    subtitle: 'Industrial Wrist Hardware',
    colSpanClass: 'lg:col-span-2',
    sampleProductId: 'rwnd-bracelet-01',
  },
];

export const BentoCollections: React.FC<BentoCollectionsProps> = ({
  products,
  activeCategory,
  onSelectCategory,
}) => {
  const getCategoryImage = (productId: string) => {
    const match = products.find((p) => p.id === productId);
    return match?.images[0] || products[0]?.images[0] || '';
  };

  return (
    <section
      id="collections"
      className="metallic-chrome-bg border-b border-black/15 py-14 lg:py-24 text-[#09090B]"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Header: FEATURED COLLECTIONS + Hairline Divider + View all */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="font-mono-tech text-[11px] font-semibold tracking-[0.22em] text-[#3F3F46] uppercase">
              01 // CURATED HARDWARE CATEGORIES
            </p>
            <h2 className="mt-1 font-display text-xl font-extrabold tracking-tight text-[#09090B] uppercase sm:text-3xl">
              FEATURED COLLECTIONS
            </h2>
          </div>

          <div
            aria-hidden="true"
            className="hidden h-px flex-1 bg-gradient-to-r from-black/25 via-black/10 to-transparent sm:block"
          />

          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-white px-3.5 py-1.5 font-mono-tech text-xs font-bold tracking-wider text-[#09090B] uppercase shadow-2xs transition-colors hover:bg-[#09090B] hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>View all →</span>
          </button>
        </div>

        {/* Sleek 5-Card Visual Bento Grid (2+3 on Desktop) with White Accent Footer Bars */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6">
          {BENTO_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.handle;
            const imgSrc = getCategoryImage(cat.sampleProductId);

            return (
              <button
                key={cat.handle}
                type="button"
                aria-label={`Shop ${cat.title}`}
                onClick={() => onSelectCategory(cat.handle)}
                className={`group relative flex h-64 sm:h-72 w-full flex-col justify-end overflow-hidden rounded-3xl border bg-white p-4 text-left transition-all duration-300 hover:border-black/50 cursor-pointer ${
                  cat.colSpanClass
                } ${
                  isSelected
                    ? 'border-[#09090B] ring-2 ring-black/25'
                    : 'border-black/15 shadow-xs'
                }`}
              >
                {/* Edge-to-Edge Full Card Image */}
                <StudioImage
                  src={imgSrc}
                  alt={cat.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Foreground White Accent Card Bar with Black Text */}
                <div className="relative z-10 flex w-full items-end justify-between gap-3 rounded-2xl border border-black/15 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-md">
                  <div className="min-w-0">
                    <h3
                      className={`font-display font-extrabold tracking-tight text-[#09090B] uppercase ${
                        cat.colSpanClass === 'lg:col-span-3'
                          ? 'text-xl sm:text-2xl'
                          : 'text-lg sm:text-xl'
                      }`}
                    >
                      {cat.title}
                    </h3>
                    <p className="mt-0.5 font-mono-tech text-xs text-[#3F3F46]">
                      {cat.subtitle}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full border border-black/20 bg-white px-3.5 py-1.5 font-mono-tech text-xs font-bold tracking-wider text-[#09090B] uppercase transition-colors group-hover:bg-[#09090B] group-hover:text-white shrink-0">
                    Shop →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

