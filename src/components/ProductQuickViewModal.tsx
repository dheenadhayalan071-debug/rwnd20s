import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '../utils/motion';
import {
  X,
  Check,
  ShieldCheck,
  ShoppingBag,
  Zap,
  Heart,
  BellRing,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ImagePlus,
  RotateCcw,
} from 'lucide-react';
import {
  type Product,
  type ProductVariant,
  formatINR,
  validatePriceDropEmail,
  validateCustomImageUrl,
} from '../utils/catalogLogic';
import { StudioImage } from './StudioImage';

interface ProductQuickViewModalProps {
  product: Product | null;
  isWishlisted: boolean;
  subscribedEmail?: string;
  customImageUrl?: string;
  recentlyViewedProducts: Product[];
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onBuyNow: (product: Product, variant: ProductVariant, quantity: number) => void;
  onToggleWishlist: (product: Product) => void;
  onSubscribePriceDrop: (product: Product, email: string) => void;
  onUpdateCustomImage: (product: Product, url: string | null) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  isWishlisted,
  subscribedEmail,
  customImageUrl,
  recentlyViewedProducts,
  onClose,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  onSubscribePriceDrop,
  onUpdateCustomImage,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [showPriceAlertForm, setShowPriceAlertForm] = useState(false);
  const [alertEmail, setAlertEmail] = useState('');
  const [alertError, setAlertError] = useState('');

  const [customUrlInput, setCustomUrlInput] = useState('');
  const [customUrlError, setCustomUrlError] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants[0] || null);
      setActiveImageIndex(0);
      setQuantity(1);
      setShowPriceAlertForm(false);
      setAlertEmail(subscribedEmail || '');
      setAlertError('');
      setCustomUrlInput(customImageUrl || '');
      setCustomUrlError('');
    }
  }, [product, subscribedEmail, customImageUrl]);

  if (!product || !selectedVariant) return null;

  const activePrice = product.price + (selectedVariant.priceDelta ?? 0);
  const activeComparePrice =
    product.compareAtPrice + (selectedVariant.priceDelta ?? 0);

  const handlePriceDropSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validatePriceDropEmail(alertEmail);
    if (!validation.valid) {
      setAlertError(validation.error || 'Please enter a valid email address.');
      return;
    }
    setAlertError('');
    onSubscribePriceDrop(product, validation.normalizedEmail);
    setShowPriceAlertForm(false);
  };

  const handleCustomImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateCustomImageUrl(customUrlInput);
    if (!validation.valid) {
      setCustomUrlError(validation.error || 'Invalid image URL.');
      return;
    }
    setCustomUrlError('');
    setActiveImageIndex(0);
    onUpdateCustomImage(product, validation.trimmedUrl);
  };

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-md"
        />

        {/* Modal Container (Metallic Chrome Clean Background + Black Text + White Accents) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="metallic-chrome-bg relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-black/20 p-5 sm:p-8 text-[#09090B] shadow-[0_30px_90px_rgba(9,9,11,0.35)]"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product specification modal"
            className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/15 bg-white text-[#09090B] transition-colors hover:bg-[#09090B] hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Column: Multi-Angle Studio Image Gallery + Custom Image URL Swapper */}
            <div className="flex flex-col justify-between lg:col-span-6">
              <div>
                <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border border-black/15 bg-white">
                  <StudioImage
                    src={product.images[activeImageIndex] || product.images[0]}
                    alt={`${product.title} view ${activeImageIndex + 1}`}
                    vignette={false}
                    className="relative z-10 h-full w-full object-cover"
                  />

                  {/* Quick-View Wishlist Heart Button */}
                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product)}
                    aria-label={
                      isWishlisted
                        ? `Remove ${product.title} from wishlist`
                        : `Save ${product.title} to wishlist`
                    }
                    aria-pressed={isWishlisted}
                    className={`absolute top-3.5 right-3.5 z-20 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 font-mono-tech text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                      isWishlisted
                        ? 'border-black bg-[#09090B] text-white'
                        : 'border-black/20 bg-white/95 text-[#09090B] hover:bg-white'
                    }`}
                  >
                    <Heart
                      className={`h-3.5 w-3.5 ${
                        isWishlisted ? 'fill-white text-white' : ''
                      }`}
                    />
                    <span>{isWishlisted ? 'SAVED' : 'WISHLIST'}</span>
                  </button>
                </div>

                {/* 3-Angle Thumbnail Selector */}
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {product.images.map((imgUrl, idx) => {
                    const angleLabels = ['Studio 01', 'Angle 02', 'Detail 03'];
                    const isCurrent = activeImageIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`group flex flex-col items-center overflow-hidden rounded-xl border p-1.5 transition-colors cursor-pointer ${
                          isCurrent
                            ? 'border-[#09090B] bg-white shadow-xs'
                            : 'border-black/15 bg-white/60 hover:bg-white'
                        }`}
                      >
                        <StudioImage
                          src={imgUrl}
                          alt={`${product.title} thumbnail ${idx + 1}`}
                          vignette={false}
                          className="h-14 w-full rounded-lg object-cover"
                        />
                        <span className="mt-1 font-mono-tech text-[10px] font-semibold text-[#27272A]">
                          {angleLabels[idx] || `Angle 0${idx + 1}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Store Owner Custom Image URL Swapper */}
              <form
                onSubmit={handleCustomImageSubmit}
                noValidate
                className="mt-4 rounded-2xl border border-black/15 bg-white p-3.5 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="custom-image-url-input"
                    className="flex items-center gap-1.5 font-mono-tech text-[11px] font-bold tracking-wider text-[#09090B] uppercase"
                  >
                    <ImagePlus className="h-3.5 w-3.5 text-[#09090B]" />
                    <span>Custom Image URL</span>
                  </label>

                  {customImageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomUrlInput('');
                        setCustomUrlError('');
                        onUpdateCustomImage(product, null);
                      }}
                      className="inline-flex items-center gap-1 font-mono-tech text-[10px] text-[#3F3F46] hover:text-[#09090B] cursor-pointer"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Reset Default</span>
                    </button>
                  )}
                </div>

                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <input
                    id="custom-image-url-input"
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => {
                      setCustomUrlInput(e.target.value);
                      if (customUrlError) setCustomUrlError('');
                    }}
                    placeholder="Paste upscaled photo URL (https://...)"
                    className="flex-1 rounded-xl border border-black/20 bg-[#F4F5F7] px-3 py-2 font-mono-tech text-xs text-[#09090B] placeholder-[#71717A] focus:border-[#09090B] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-xl border border-black bg-[#09090B] px-4 py-2 font-mono-tech text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-white hover:text-[#09090B] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    PREVIEW PHOTO
                  </button>
                </div>

                {customUrlError && (
                  <p
                    role="alert"
                    className="mt-1.5 font-mono-tech text-[11px] font-semibold text-[#09090B]"
                  >
                    {customUrlError}
                  </p>
                )}
              </form>
            </div>

            {/* Right Column: Contiguous Purchase & Specification Module */}
            <div className="flex flex-col justify-between lg:col-span-6">
              <div>
                <div className="retro-window-bar mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-black/15 px-3 py-1.5 pr-12 font-mono-tech text-[10px] font-bold text-[#27272A]">
                  <span className="uppercase">
                    DROP 01 // {product.categoryLabel}
                  </span>
                  <span className="text-[#09090B]">{product.specBadge}</span>
                </div>

                <h2
                  id="quick-view-title"
                  className="font-display text-2xl font-extrabold tracking-tight text-[#09090B] uppercase sm:text-3xl"
                >
                  {product.title}
                </h2>
                <p className="mt-1 font-mono-tech text-xs text-[#3F3F46]">
                  {product.subtitle}
                </p>

                {/* Price Callout & Notify Me of Price Drops Trigger */}
                <div className="mt-4 border-b border-black/15 pb-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono-tech text-2xl font-bold text-[#09090B]">
                          {formatINR(activePrice)}
                        </span>
                        <span className="font-mono-tech text-sm text-[#52525B] line-through">
                          {formatINR(activeComparePrice)}
                        </span>
                      </div>
                      <p className="mt-0.5 font-mono-tech text-[10px] text-[#3F3F46]">
                        MRP inclusive of all taxes · Net Qty: {product.netQuantity || '1 N'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowPriceAlertForm((prev) => !prev);
                        setAlertError('');
                      }}
                      aria-expanded={showPriceAlertForm}
                      className="inline-flex items-center gap-1.5 rounded-full border border-black/20 bg-white px-3 py-1.5 font-mono-tech text-[11px] font-bold text-[#09090B] shadow-2xs transition-colors hover:bg-[#09090B] hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <BellRing className="h-3.5 w-3.5" />
                      <span>Notify me of price drops</span>
                    </button>
                  </div>

                  {/* Active Subscription Status Banner */}
                  {subscribedEmail && !showPriceAlertForm && (
                    <div className="mt-3 flex items-center justify-between rounded-xl border border-black/15 bg-white px-3.5 py-2 font-mono-tech text-[11px] text-[#09090B]">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#09090B]" />
                        <span>Price drop alert active for {subscribedEmail}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowPriceAlertForm(true)}
                        className="font-bold text-[#09090B] underline hover:text-[#3F3F46] cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  )}

                  {/* Simulated Email Input Field for Price Drop Notifications */}
                  {showPriceAlertForm && (
                    <form
                      onSubmit={handlePriceDropSubmit}
                      noValidate
                      className="mt-3 rounded-2xl border border-black/20 bg-white p-3.5 shadow-2xs"
                    >
                      <label
                        htmlFor="price-drop-email-input"
                        className="block font-mono-tech text-[11px] font-bold tracking-wider text-[#09090B] uppercase"
                      >
                        Instant Archive Price-Drop Alert
                      </label>
                      <p className="mt-0.5 text-xs text-[#3F3F46]">
                        Get an instant email alert if {product.title} drops below{' '}
                        {formatINR(activePrice)}.
                      </p>

                      <div className="mt-2.5 flex flex-col gap-2 sm:flex-row">
                        <input
                          id="price-drop-email-input"
                          type="email"
                          value={alertEmail}
                          onChange={(e) => {
                            setAlertEmail(e.target.value);
                            if (alertError) setAlertError('');
                          }}
                          placeholder="Enter your email address..."
                          className="flex-1 rounded-xl border border-black/20 bg-[#F4F5F7] px-3.5 py-2 font-mono-tech text-xs text-[#09090B] placeholder-[#71717A] focus:border-[#09090B] focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-black bg-[#09090B] px-4 py-2 font-mono-tech text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-white hover:text-[#09090B] whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <BellRing className="h-3.5 w-3.5" />
                          <span>ACTIVATE ALERT</span>
                        </button>
                      </div>

                      {alertError && (
                        <p
                          role="alert"
                          className="mt-2 font-mono-tech text-[11px] font-semibold text-[#09090B]"
                        >
                          {alertError}
                        </p>
                      )}
                    </form>
                  )}
                </div>

                {/* Required Compatibility / Checkout Warning Callout */}
                {product.compatibilityWarning && (
                  <div className="mt-3 rounded-xl border border-black/20 bg-white px-3.5 py-2.5 font-mono-tech text-xs font-bold text-[#09090B]">
                    ⚠ {product.compatibilityWarning}
                  </div>
                )}

                {/* Bundle What's Inside Exact Breakdown */}
                {product.whatsInside && product.whatsInside.length > 0 && (
                  <div className="mt-3 rounded-xl border border-black/15 bg-white p-3.5">
                    <p className="font-mono-tech text-[10px] font-bold tracking-widest text-[#09090B] uppercase">
                      WHAT&apos;S INSIDE THE SET:
                    </p>
                    <ul className="mt-1.5 space-y-1 font-mono-tech text-xs text-[#18181B]">
                      {product.whatsInside.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="font-bold text-[#09090B]">+</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="mt-3 text-sm leading-relaxed text-[#18181B]">
                  {product.description}
                </p>

                {/* Short Bullets */}
                {product.shortBullets && product.shortBullets.length > 0 && (
                  <ul className="mt-3 space-y-1.5 rounded-xl border border-black/15 bg-white p-3.5 text-xs text-[#18181B]">
                    {product.shortBullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <span className="font-mono-tech font-bold text-[#09090B]">▸</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Care Note & COD Policy Note */}
                {(product.careNote || product.codPolicyNote) && (
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 font-mono-tech text-[11px]">
                    {product.careNote && (
                      <div className="rounded-xl border border-black/15 bg-white p-2.5">
                        <span className="block text-[10px] font-bold text-[#52525B] uppercase">
                          CARE NOTE
                        </span>
                        <span className="mt-0.5 block text-[#18181B]">
                          {product.careNote}
                        </span>
                      </div>
                    )}
                    {product.codPolicyNote && (
                      <div className="rounded-xl border border-black/15 bg-white p-2.5">
                        <span className="block text-[10px] font-bold text-[#52525B] uppercase">
                          COD &amp; DISPATCH POLICY
                        </span>
                        <span className="mt-0.5 block text-[#18181B]">
                          {product.codPolicyNote}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Option / Variant Selector */}
                <div className="mt-4">
                  <label className="block font-mono-tech text-xs font-bold tracking-wider text-[#27272A] uppercase">
                    {product.optionName}:{' '}
                    <span className="text-[#09090B]">{selectedVariant.label}</span>
                  </label>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.variants.map((variant) => {
                      const isSelected = selectedVariant.id === variant.id;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedVariant(variant)}
                          className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-mono-tech text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            isSelected
                              ? 'border-[#09090B] bg-white text-[#09090B] font-bold shadow-xs'
                              : 'border-black/15 bg-white/55 text-[#27272A] hover:bg-white hover:text-[#09090B]'
                          }`}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                          <span>{variant.label}</span>
                          {variant.priceDelta ? (
                            <span className="opacity-75">
                              ({variant.priceDelta > 0 ? '+' : ''}
                              {formatINR(variant.priceDelta)})
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Hardware Specifications + Legal Country of Origin */}
                <div className="mt-4 rounded-2xl border border-black/15 bg-white p-4">
                  <p className="mb-2 font-mono-tech text-[11px] font-bold tracking-widest text-[#52525B] uppercase">
                    HARDWARE SPECIFICATIONS &amp; LEGAL DISCLOSURE
                  </p>
                  <dl className="space-y-1.5 text-xs">
                    {product.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="flex items-baseline justify-between gap-4 border-b border-black/10 pb-1.5 last:border-none last:pb-0"
                      >
                        <dt className="text-[#52525B]">{spec.label}</dt>
                        <dd className="text-right font-mono-tech font-medium text-[#09090B]">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                    {product.countryOfOrigin && (
                      <div className="flex items-baseline justify-between gap-4 border-t border-black/10 pt-1.5">
                        <dt className="text-[#52525B]">Origin</dt>
                        <dd className="text-right font-mono-tech font-medium text-[#09090B]">
                          {product.countryOfOrigin}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              {/* Action Buttons: Quantity + ADD TO BAG + Wishlist + BUY IT NOW */}
              <div className="mt-6 space-y-3 pt-2">
                <div className="flex items-center gap-2.5">
                  {/* Quantity Stepper */}
                  <div className="inline-flex items-center rounded-full border border-black/20 bg-white px-2 py-1">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="h-8 w-8 rounded-full font-mono-tech text-sm text-[#09090B] hover:bg-black/10 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-mono-tech text-xs font-bold text-[#09090B]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="h-8 w-8 rounded-full font-mono-tech text-sm text-[#09090B] hover:bg-black/10 cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart(product, selectedVariant, quantity);
                      onClose();
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-black bg-[#09090B] px-5 py-3.5 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-white hover:text-[#09090B] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>ADD TO BAG · {formatINR(activePrice * quantity)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product)}
                    aria-label={
                      isWishlisted
                        ? `Remove ${product.title} from wishlist`
                        : `Save ${product.title} to wishlist`
                    }
                    aria-pressed={isWishlisted}
                    className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors cursor-pointer ${
                      isWishlisted
                        ? 'border-black bg-[#09090B] text-white'
                        : 'border-black/20 bg-white text-[#09090B] hover:bg-[#09090B] hover:text-white'
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isWishlisted ? 'fill-white text-white' : ''
                      }`}
                    />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onBuyNow(product, selectedVariant, quantity);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-black/20 bg-white px-6 py-3 text-xs font-bold tracking-wider text-[#09090B] uppercase shadow-2xs transition-colors hover:bg-[#09090B] hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Zap className="h-4 w-4" />
                  <span>BUY IT NOW — EXPRESS CHECKOUT</span>
                </button>

                <div className="flex items-center justify-center gap-2 pt-1 font-mono-tech text-[11px] text-[#3F3F46]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#09090B]" />
                  <span>
                    Razorpay Verified · Free Express Shipping above ₹999
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recently Viewed Section at the Bottom of the Product Quick-View Modal */}
          <div className="mt-8 border-t border-black/15 pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#09090B]" />
                <h3 className="font-display text-sm font-extrabold tracking-wider text-[#09090B] uppercase">
                  RECENTLY VIEWED
                </h3>
              </div>
              <span className="font-mono-tech text-[11px] font-semibold text-[#3F3F46] uppercase">
                SESSION BROWSING HISTORY ({recentlyViewedProducts.length})
              </span>
            </div>

            {recentlyViewedProducts.length === 0 ? (
              <p className="mt-3 rounded-2xl border border-black/15 bg-white px-4 py-3 font-mono-tech text-xs text-[#3F3F46]">
                Items you inspect during this session will appear here for
                rapid comparison.
              </p>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {recentlyViewedProducts.slice(0, 3).map((recentItem) => (
                  <button
                    key={recentItem.id}
                    type="button"
                    onClick={() => onSelectProduct(recentItem)}
                    aria-label={`View recently viewed ${recentItem.title}`}
                    className="group flex items-center gap-3 rounded-2xl border border-black/15 bg-white p-3 text-left transition-colors hover:border-[#09090B] cursor-pointer"
                  >
                    <StudioImage
                      src={recentItem.images[0]}
                      alt={recentItem.title}
                      vignette={false}
                      className="h-14 w-14 shrink-0 rounded-xl border border-black/10 bg-[#0E0E0E] object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono-tech text-[10px] text-[#52525B] uppercase">
                        {recentItem.categoryLabel}
                      </p>
                      <p className="truncate font-display text-xs font-bold text-[#09090B] uppercase">
                        {recentItem.title}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="font-mono-tech text-xs font-bold text-[#09090B]">
                          {formatINR(recentItem.price)}
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-[#52525B] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#09090B]" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

