import React from 'react';
import { Eye, Heart, Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import { motion } from '../utils/motion';
import {
  type CategoryHandle,
  type Product,
  type SortOption,
  formatINR,
} from '../utils/catalogLogic';
import { StudioImage } from './StudioImage';

interface ProductArchiveSectionProps {
  allProductsCount: number;
  filteredProducts: Product[];
  activeCategory: CategoryHandle;
  searchQuery: string;
  sortBy: SortOption;
  wishlistIds: string[];
  onSelectCategory: (category: CategoryHandle) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: SortOption) => void;
  onQuickAdd: (product: Product) => void;
  onOpenQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

const FILTER_TABS: { handle: CategoryHandle; label: string }[] = [
  { handle: 'all', label: 'ALL (7)' },
  { handle: 'cyber-bundle', label: '3-PC CYBER SET' },
  { handle: 'chrome-earphones', label: 'PINK CHROME EARPHONES' },
  { handle: 'y2k-rings', label: 'Y2K RINGS' },
  { handle: 'chains', label: 'CHAINS' },
  { handle: 'bracelets', label: 'BRACELETS' },
  { handle: 'earrings', label: 'Y2K STUDS' },
  { handle: 'watches', label: 'Y2K WATCH' },
];

export const ProductArchiveSection: React.FC<ProductArchiveSectionProps> = ({
  allProductsCount,
  filteredProducts,
  activeCategory,
  searchQuery,
  sortBy,
  wishlistIds,
  onSelectCategory,
  onSearchChange,
  onSortChange,
  onQuickAdd,
  onOpenQuickView,
  onToggleWishlist,
  searchInputRef,
}) => {
  return (
    <section
      id="shop"
      className="metallic-chrome-bg border-b border-black/15 py-14 lg:py-24 text-[#09090B]"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"
        >
          <div>
            <p className="font-mono-tech text-xs font-semibold tracking-widest text-[#3F3F46] uppercase">
              02 · LIMITED HARDWARE RELEASE
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-[#09090B] uppercase sm:text-4xl">
              DROP 01 — ARCHIVE COLLECTION
            </h2>
          </div>

          <p className="font-mono-tech text-xs font-semibold text-[#27272A]">
            SHOWING {filteredProducts.length} OF {allProductsCount} PIECES · FREE SHIPPING ABOVE ₹999
          </p>
        </motion.div>

        {/* Category Filter Bar + Search + Sort Controls */}
        <div className="mt-8 flex flex-col gap-4 border-y border-black/15 py-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Category Filter Pill Tabs */}
          <div
            role="tablist"
            aria-label="Filter products by category"
            className="flex flex-wrap items-center gap-2"
          >
            {FILTER_TABS.map((tab) => {
              const isSelected = activeCategory === tab.handle;
              return (
                <button
                  key={tab.handle}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  onClick={() => onSelectCategory(tab.handle)}
                  className={`rounded-full border px-3.5 py-2 font-mono-tech text-[11px] font-bold tracking-wider uppercase transition-colors duration-100 whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'border-[#09090B] bg-white text-[#09090B] shadow-sm'
                      : 'border-black/15 bg-white/55 text-[#27272A] hover:border-black/40 hover:bg-white hover:text-[#09090B]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Input & Sort Dropdown */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center shrink-0">
            <div className="relative flex-1 sm:w-60">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#52525B]" />
              <input
                ref={searchInputRef}
                type="text"
                role="searchbox"
                aria-label="Search archive hardware"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search rings, chains, Type-C..."
                className="w-full rounded-full border border-black/15 bg-white py-2.5 pr-9 pl-10 font-mono-tech text-xs text-[#09090B] placeholder-[#71717A] transition-colors focus:border-[#09090B] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search query"
                  onClick={() => onSearchChange('')}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#52525B] hover:text-[#09090B] cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="relative inline-flex items-center">
              <SlidersHorizontal className="pointer-events-none absolute left-3.5 h-3.5 w-3.5 text-[#52525B]" />
              <select
                aria-label="Sort archive products"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="w-full sm:w-auto rounded-full border border-black/15 bg-white py-2.5 pr-8 pl-9 font-mono-tech text-xs font-semibold text-[#09090B] transition-colors focus:border-[#09090B] focus:outline-none cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* 7-Product Price-Anchored Grid: Full-Width Spotlight Bundle Card (col-span-2) + 3x2 Balanced Grid */}
        {filteredProducts.length === 0 ? (
          <div className="my-12 flex flex-col items-center justify-center rounded-3xl border border-black/15 bg-white px-6 py-16 text-center shadow-xs">
            <p className="font-display text-xl font-bold uppercase text-[#09090B]">
              NO MATCHING HARDWARE IN ARCHIVE
            </p>
            <p className="mt-2 max-w-md text-sm text-[#3F3F46]">
              No items matched &ldquo;{searchQuery}&rdquo; in the current
              filter. Reset filters to view all {allProductsCount} pieces.
            </p>
            <button
              type="button"
              onClick={() => {
                onSelectCategory('all');
                onSearchChange('');
                onSortChange('featured');
              }}
              className="mt-6 rounded-full border border-black bg-[#09090B] px-6 py-2.5 font-mono-tech text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-white hover:text-[#09090B] cursor-pointer"
            >
              RESET ARCHIVE FILTERS
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredProducts.map((product, index) => {
              const isWishlisted = wishlistIds.includes(product.id);
              const isSpotlightBundle =
                product.id === 'rwnd-bun-01' && filteredProducts.length > 1;
              const savings =
                product.compareAtPrice > product.price
                  ? product.compareAtPrice - product.price
                  : 0;

              if (isSpotlightBundle) {
                return (
                  <motion.article
                    key={product.id}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.12 }}
                    transition={{ duration: 0.55 }}
                    className="group relative grid grid-cols-1 overflow-hidden rounded-3xl border border-black/20 bg-white shadow-[0_14px_40px_rgba(9,9,11,0.08)] transition-colors duration-200 hover:border-black/45 md:col-span-2 lg:grid-cols-12"
                  >
                    {/* Left / Top Edge-to-Edge Image Frame */}
                    <div className="relative aspect-square w-full overflow-hidden bg-[#080808] sm:aspect-[16/10] lg:col-span-7 lg:aspect-auto lg:min-h-[380px]">
                      <StudioImage
                        src={product.images[0]}
                        alt={product.imageAlt || product.title}
                        onClick={() => onOpenQuickView(product)}
                        className="h-full w-full cursor-pointer object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Top-Left High-Contrast White Spotlight Badge */}
                      <div className="pointer-events-none absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-black/20 bg-white px-3.5 py-1.5 font-mono-tech text-[11px] font-bold tracking-wider text-[#09090B] uppercase shadow-sm">
                        <span>{product.specBadge}</span>
                      </div>

                      {/* Wishlist Heart Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(product);
                        }}
                        aria-label={
                          isWishlisted
                            ? `Remove ${product.title} from wishlist`
                            : `Save ${product.title} to wishlist`
                        }
                        aria-pressed={isWishlisted}
                        className={`absolute top-4 right-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors cursor-pointer ${
                          isWishlisted
                            ? 'border-black bg-[#09090B] text-white'
                            : 'border-black/20 bg-white/95 text-[#09090B] hover:bg-white'
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            isWishlisted ? 'fill-white text-white' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {/* Right / Bottom Conversion Copy Stack */}
                    <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5">
                      <div>
                        <span className="inline-flex items-center rounded-full border border-black/15 bg-[#E8EBF0] px-3 py-1 font-mono-tech text-[10px] font-bold tracking-widest text-[#09090B] uppercase">
                          FREE SHIPPING ELIGIBLE
                        </span>

                        <h3 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#09090B] uppercase">
                          {product.title}
                        </h3>

                        <p className="mt-1.5 font-mono-tech text-xs font-semibold text-[#27272A]">
                          Ring + Chain + Bracelet Included
                        </p>

                        <p className="mt-3 text-sm leading-relaxed text-[#3F3F46]">
                          {product.description}
                        </p>
                      </div>

                      <div className="mt-6 border-t border-black/15 pt-5">
                        {/* Price Row: Bold MRP ₹1,199 + Doubled Stash Price ₹2,894 */}
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono-tech text-2xl sm:text-3xl font-bold text-[#09090B]">
                            {formatINR(product.price)}
                          </span>
                          <span className="font-mono-tech text-sm text-[#52525B] line-through">
                            {formatINR(product.compareAtPrice)}
                          </span>
                          {savings > 0 && (
                            <span className="rounded-full border border-black/20 bg-[#E8EBF0] px-2.5 py-0.5 font-mono-tech text-[11px] font-bold text-[#09090B] uppercase">
                              SAVE {formatINR(savings)}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => onQuickAdd(product)}
                            aria-label={`Add ${product.title} to bag`}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-black bg-[#09090B] px-6 py-3.5 font-mono-tech text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-white hover:text-[#09090B] whitespace-nowrap cursor-pointer"
                          >
                            <span>ADD TO BAG</span>
                            <Plus className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onOpenQuickView(product)}
                            aria-label={`Quick view ${product.title}`}
                            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/20 bg-[#E8EBF0] text-[#09090B] transition-colors hover:bg-[#09090B] hover:text-white cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              }

              return (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{
                    duration: 0.55,
                    delay: (index % 2) * 0.08,
                  }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black/20 bg-white shadow-[0_12px_32px_rgba(9,9,11,0.06)] transition-colors duration-200 hover:border-black/45"
                >
                  {/* 1. Edge-to-Edge Studio Image (aspect-square) with White Accent Status Pill */}
                  <div className="relative aspect-square w-full overflow-hidden bg-[#080808]">
                    <StudioImage
                      src={product.images[0]}
                      alt={product.imageAlt || product.title}
                      onClick={() => onOpenQuickView(product)}
                      className="h-full w-full cursor-pointer object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Top-Left White Accent Status Pill */}
                    <div className="pointer-events-none absolute top-4 left-4 z-20 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full border border-black/20 bg-white/95 px-3 py-1 font-mono-tech text-[10px] font-bold tracking-wider text-[#09090B] uppercase shadow-2xs">
                        {product.specBadge}
                      </span>
                      {product.price >= 999 && product.phase === 1 && (
                        <span className="rounded-full border border-black/20 bg-white/90 px-2.5 py-1 font-mono-tech text-[10px] font-semibold tracking-wider text-[#09090B] uppercase shadow-2xs">
                          FREE SHIPPING ELIGIBLE
                        </span>
                      )}
                    </div>

                    {/* Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product);
                      }}
                      aria-label={
                        isWishlisted
                          ? `Remove ${product.title} from wishlist`
                          : `Save ${product.title} to wishlist`
                      }
                      aria-pressed={isWishlisted}
                      className={`absolute top-4 right-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors cursor-pointer ${
                        isWishlisted
                          ? 'border-black bg-[#09090B] text-white'
                          : 'border-black/20 bg-white/95 text-[#09090B] hover:bg-white'
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isWishlisted ? 'fill-white text-white' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Clean White Accent Card Info Stack with Black Text */}
                  <div className="flex flex-1 flex-col justify-between px-6 pt-5 pb-6">
                    <div>
                      <h3 className="truncate font-display text-lg sm:text-xl font-extrabold tracking-wide text-[#09090B] uppercase">
                        {product.title}
                      </h3>
                      <p className="mt-1 truncate font-mono-tech text-xs text-[#3F3F46]">
                        {product.subtitle}
                      </p>
                    </div>

                    <div className="mt-5 space-y-3 border-t border-black/15 pt-4">
                      {/* Price Row: Actual MRP + Doubled Stash Price */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono-tech text-xl font-bold text-[#09090B]">
                          {formatINR(product.price)}
                        </span>
                        <span className="font-mono-tech text-xs text-[#52525B] line-through">
                          {formatINR(product.compareAtPrice)}
                        </span>
                        {savings > 0 && (
                          <span className="rounded-full border border-black/15 bg-[#E8EBF0] px-2.5 py-0.5 font-mono-tech text-[10px] font-bold text-[#09090B] uppercase">
                            SAVE {formatINR(savings)}
                          </span>
                        )}
                      </div>

                      {/* CTA Button + Quick-View Trigger */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onQuickAdd(product)}
                          aria-label={`Add ${product.title} to bag`}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-black bg-[#09090B] px-5 py-3 font-mono-tech text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-white hover:text-[#09090B] whitespace-nowrap cursor-pointer"
                        >
                          <span>
                            {product.phase === 2
                              ? 'PRE-ORDER →'
                              : 'ADD TO BAG +'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenQuickView(product)}
                          aria-label={`Quick view ${product.title}`}
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/20 bg-[#E8EBF0] text-[#09090B] transition-colors hover:bg-[#09090B] hover:text-white cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

