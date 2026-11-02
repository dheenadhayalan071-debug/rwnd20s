import React, { useState } from 'react';
import {
  Truck,
  ShieldCheck,
  Sparkles,
  Plus,
  Minus,
} from 'lucide-react';
import { type CategoryHandle } from '../utils/catalogLogic';
import { Starburst } from './ChromeVectors';
import { BrandWordmark, BrandLockup } from './BrandLogo';
import { RetroStatusFooter } from './RetroStatusFooter';

interface TrustAndAboutSectionProps {
  onSelectCategory: (category: CategoryHandle) => void;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'cod-rules',
    question: '+ Cash on Delivery (COD) Rules',
    answer:
      'All Drop 01 accessories (3-Piece Y2K Cyber Set, Cyber Signet Ring, Heavy Chain + Pendant, Chain Bracelet, Y2K Cyber Studs, and Pink Chrome Wired Earphones) ship with ₹0-advance Cash on Delivery across India—pay the full amount at your doorstep via cash or UPI. For the Phase 2 Y2K Watch (₹1,999 Prepaid / ₹2,199 COD), COD orders require a ₹150 non-refundable UPI advance before dispatch to cover return transit costs if an order is refused.',
  },
  {
    id: 'shipping-timelines',
    question: '+ Pan-India Shipping Timelines',
    answer:
      'Orders above ₹999 unlock Free Express Shipping across India. In-stock Drop 01 hardware dispatches within 24–48 hours from our Madurai, Tamil Nadu fulfilment studio. Metro cities deliver in 3–5 working days; Rest of India delivers in 5–7 working days via BlueDart, Delhivery, or Xpressbees with live tracking.',
  },
  {
    id: 'unboxing-policy',
    question: '+ 48-Hour Unboxing Replacement Policy',
    answer:
      'If you receive a damaged, defective, or incorrect piece, report it within 48 hours of delivery with a continuous, unedited unboxing video showing the sealed shipping label for a free 1-for-1 replacement or 100% refund. Due to personal hygiene standards, non-defective jewellery and unsealed earphones are final sale. Approved prepaid refunds return to your original payment method in 5–7 business days; COD refunds process via UPI or bank transfer in 3–5 business days.',
  },
  {
    id: 'type-c-compatibility',
    question: '+ Type-C Earphone Compatibility',
    answer:
      'Our Pink Chrome Wired Earphones (₹999, includes carry case) feature a direct USB Type-C plug with a built-in digital audio chip. They are compatible with USB-C Android smartphones, iPhone 15 / 16 series, and USB-C iPads or laptops. They are NOT compatible with iPhone 14 and older (Lightning port) or devices that only use a 3.5mm audio jack.',
  },
];

export const TrustAndAboutSection: React.FC<TrustAndAboutSectionProps> = ({
  onSelectCategory,
}) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>('cod-rules');

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {/* Key Info Trust Bar + Editorial About Manifesto + 4 Sleek Collapsible FAQ Accordions */}
      <section
        id="about"
        className="metallic-chrome-bg border-b border-black/15 py-16 lg:py-24 text-[#09090B]"
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          {/* Rounded 3-Column Bordered Key Info Trust Bar (White Accent Surface) */}
          <div className="grid grid-cols-1 divide-y divide-black/10 overflow-hidden rounded-3xl border border-black/15 bg-white shadow-xs md:grid-cols-3 md:divide-x md:divide-y-0">
            <div className="flex items-center gap-4 p-6 sm:p-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-black/15 bg-[#E8EBF0] text-[#09090B]">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold tracking-wide text-[#09090B] uppercase">
                  Express Pan-India Dispatch
                </h3>
                <p className="mt-0.5 text-xs text-[#3F3F46]">
                  Free shipping above ₹999 · 24–48h dispatch.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 sm:p-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-black/15 bg-[#E8EBF0] text-[#09090B]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold tracking-wide text-[#09090B] uppercase">
                  Cash on Delivery Available
                </h3>
                <p className="mt-0.5 text-xs text-[#3F3F46]">
                  ₹0 advance on all rings, chains, bracelets &amp; sets.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 sm:p-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-black/15 bg-[#E8EBF0] text-[#09090B]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold tracking-wide text-[#09090B] uppercase">
                  48-Hour Unboxing Guarantee
                </h3>
                <p className="mt-0.5 text-xs text-[#3F3F46]">
                  Instant replacement or refund on verified transit damage.
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Manifesto: ABOUT RWND20S. */}
          <div className="relative mt-16 overflow-hidden rounded-3xl border border-black/20 bg-white shadow-sm">
            <div className="retro-window-bar flex items-center justify-between border-b border-black/10 px-5 py-2.5 font-mono-tech text-[10px] font-bold tracking-[0.2em] text-[#09090B] uppercase">
              <span className="flex items-center gap-2 text-[#09090B]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#09090B]" />
                [ ⏪ RWND20S.SYS // BRAND MANIFESTO ]
              </span>
              <span>METALLIC CHROME · BLACK &amp; WHITE EDITION</span>
            </div>

            <div className="relative p-8 sm:p-12 lg:p-16">
              <Starburst
                size={38}
                className="absolute top-8 right-8 hidden sm:block"
              />

              <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7">
                  <p className="font-mono-tech text-xs font-semibold tracking-widest text-[#3F3F46] uppercase">
                    04 · ENGINEERED FOR THE MILLENNIUM REWIND
                  </p>
                  <div className="mt-2">
                    <BrandWordmark className="text-3xl sm:text-4xl" />
                  </div>
                  <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#09090B] uppercase sm:text-4xl text-balance">
                    HEAVY METAL HARDWARE. ZERO FAST-FASHION TRINKETS.
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#18181B]">
                    Born from an obsession with late-90s and early-2000s
                    industrial object design,{' '}
                    <strong className="text-[#09090B]">rwnd20s.</strong> builds
                    heavy 316L stainless steel signet rings, pendant chains,
                    link bracelets, pink chrome Type-C wired earphones, and
                    brushed steel analog-digital chronographs.
                  </p>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#3F3F46]">
                    Every piece is produced in numbered batches—sweatproof,
                    tarnish-resistant, and weighted for everyday wear.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:col-span-5">
                  <div className="rounded-2xl border border-black/15 bg-[#E8EBF0] p-5">
                    <span className="font-mono-tech text-2xl font-bold text-[#09090B]">
                      316L
                    </span>
                    <p className="mt-1 font-mono-tech text-xs text-[#3F3F46] uppercase">
                      Surgical-Grade Stainless Steel
                    </p>
                  </div>
                  <div className="rounded-2xl border border-black/15 bg-[#E8EBF0] p-5">
                    <span className="font-mono-tech text-2xl font-bold text-[#09090B]">
                      TYPE-C
                    </span>
                    <p className="mt-1 font-mono-tech text-xs text-[#3F3F46] uppercase">
                      Pink Chrome Wired Earphones + Case
                    </p>
                  </div>
                  <div className="rounded-2xl border border-black/15 bg-[#E8EBF0] p-5">
                    <span className="font-mono-tech text-2xl font-bold text-[#09090B]">
                      SAVE ₹1,695
                    </span>
                    <p className="mt-1 font-mono-tech text-xs text-[#3F3F46] uppercase">
                      3-Piece Y2K Cyber Set Bundle
                    </p>
                  </div>
                  <div className="rounded-2xl border border-black/15 bg-[#E8EBF0] p-5">
                    <span className="font-mono-tech text-2xl font-bold text-[#09090B]">
                      ₹999+
                    </span>
                    <p className="mt-1 font-mono-tech text-xs text-[#3F3F46] uppercase">
                      Free Express Shipping Across India
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Sleek Collapsible FAQ Accordions */}
          <div id="faq-section" className="mt-14">
            <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono-tech text-xs font-semibold tracking-widest text-[#3F3F46] uppercase">
                  05 · DISPATCH, COD &amp; COMPATIBILITY FAQ
                </p>
                <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-[#09090B] uppercase sm:text-3xl">
                  FREQUENTLY ASKED QUESTIONS
                </h3>
              </div>
              <p className="font-mono-tech text-xs font-semibold text-[#27272A]">
                FULFILMENT &amp; DISPATCH STUDIO: MADURAI, TAMIL NADU
              </p>
            </div>

            <div className="divide-y divide-black/10 overflow-hidden rounded-3xl border border-black/15 bg-white shadow-xs">
              {FAQ_ITEMS.map((item) => {
                const isOpen = openFaqId === item.id;
                return (
                  <div key={item.id} className="transition-colors hover:bg-black/[0.02]">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => toggleFaq(item.id)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                    >
                      <span className="font-display text-sm sm:text-base font-bold tracking-wide text-[#09090B] uppercase">
                        {item.question}
                      </span>
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/15 bg-[#E8EBF0] text-[#09090B]">
                        {isOpen ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 pt-1 text-sm leading-relaxed text-[#27272A]">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Metallic Chrome Footer */}
      <footer className="metallic-chrome-bg pt-16 text-[#09090B]">
        <div className="mx-auto max-w-[1280px] px-4 pb-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 border-b border-black/15 pb-12 lg:grid-cols-12">
            {/* Brand & Studio Location Column */}
            <div className="lg:col-span-5">
              <a
                href="#home"
                aria-label="rwnd20s. Home"
                className="inline-flex items-center"
              >
                <BrandLockup size="footer" />
              </a>
              <p className="mt-3 max-w-sm text-sm text-[#27272A]">
                Heavy 316L stainless steel hardware, pink chrome Type-C wired
                earphones, and analog-digital chronographs crafted in limited
                numbered batches.
              </p>

              <div className="mt-5 inline-flex items-center gap-2.5 rounded-2xl border border-black/15 bg-white px-4 py-3 font-mono-tech text-xs font-bold text-[#09090B] shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-[#09090B]" />
                <span>HQ &amp; DISPATCH: MADURAI, TAMIL NADU</span>
              </div>
            </div>

            {/* Archive Categories & FAQ Links */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
              <div>
                <h3 className="font-mono-tech text-xs font-bold tracking-wider text-[#09090B] uppercase">
                  DROP 01 HARDWARE
                </h3>
                <ul className="mt-4 space-y-2.5 text-xs text-[#27272A]">
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectCategory('cyber-bundle')}
                      className="hover:text-[#09090B] hover:underline cursor-pointer"
                    >
                      3-Piece Y2K Cyber Set
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectCategory('chrome-earphones')}
                      className="hover:text-[#09090B] hover:underline cursor-pointer"
                    >
                      Pink Chrome Wired Earphones
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectCategory('y2k-rings')}
                      className="hover:text-[#09090B] hover:underline cursor-pointer"
                    >
                      Cyber Signet Ring
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectCategory('chains')}
                      className="hover:text-[#09090B] hover:underline cursor-pointer"
                    >
                      Heavy Chain + Pendant
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectCategory('bracelets')}
                      className="hover:text-[#09090B] hover:underline cursor-pointer"
                    >
                      Chain Bracelet
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-mono-tech text-xs font-bold tracking-wider text-[#09090B] uppercase">
                  SUPPORT &amp; FAQ
                </h3>
                <ul className="mt-4 space-y-2.5 text-xs text-[#27272A]">
                  <li>
                    <a
                      href="#faq-section"
                      onClick={() => setOpenFaqId('cod-rules')}
                      className="hover:text-[#09090B] hover:underline"
                    >
                      Cash on Delivery Rules
                    </a>
                  </li>
                  <li>
                    <a
                      href="#faq-section"
                      onClick={() => setOpenFaqId('shipping-timelines')}
                      className="hover:text-[#09090B] hover:underline"
                    >
                      Pan-India Shipping
                    </a>
                  </li>
                  <li>
                    <a
                      href="#faq-section"
                      onClick={() => setOpenFaqId('unboxing-policy')}
                      className="hover:text-[#09090B] hover:underline"
                    >
                      48-Hour Unboxing Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#faq-section"
                      onClick={() => setOpenFaqId('type-c-compatibility')}
                      className="hover:text-[#09090B] hover:underline"
                    >
                      Type-C Compatibility
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-mono-tech text-xs font-bold tracking-wider text-[#09090B] uppercase">
                  STUDIO &amp; DISPATCH
                </h3>
                <ul className="mt-4 space-y-2.5 text-xs text-[#27272A]">
                  <li className="font-mono-tech font-bold text-[#09090B]">
                    Madurai, Tamil Nadu
                  </li>
                  <li>Free Shipping Above ₹999</li>
                  <li>Cash on Delivery (₹0 Advance)</li>
                  <li>Razorpay UPI / Cards Verified</li>
                  <li>24–48h Express Pan-India Dispatch</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 font-mono-tech text-xs text-[#3F3F46] sm:flex-row">
            <p>© {new Date().getFullYear()} rwnd20s. All rights reserved.</p>
            <p>METALLIC CHROME HARDWARE ARCHIVE · MADURAI, TAMIL NADU</p>
          </div>
        </div>

        {/* Retro Status DOS-Style Terminal Output Footer */}
        <RetroStatusFooter />
      </footer>
    </>
  );
};

