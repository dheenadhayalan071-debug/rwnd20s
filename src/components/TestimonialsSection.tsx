import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Star, Plus, UserCheck } from 'lucide-react';

export interface CardholderSlot {
  id: string;
  slotCode: string;
  status: 'verified' | 'placeholder';
  holderName: string;
  city: string;
  hardwareOwned: string;
  quote: string;
  rating: number;
  batchTag: string;
}

const INITIAL_CARDHOLDERS: CardholderSlot[] = [
  {
    id: 'ch-01',
    slotCode: 'CARDHOLDER // SLOT #001',
    status: 'verified',
    holderName: 'CARDHOLDER 01 · R. KARTHIK',
    city: 'Chennai, TN',
    hardwareOwned: '3-Piece Y2K Cyber Set',
    quote:
      'Solid 316L steel weight on the Cyber Signet Ring and Heavy Chain. Zero tarnish after three weeks of daily wear.',
    rating: 5,
    batchTag: 'DROP 01 VERIFIED HOLDER',
  },
  {
    id: 'ch-02',
    slotCode: 'CARDHOLDER // SLOT #002',
    status: 'verified',
    holderName: 'CARDHOLDER 02 · A. SHARMA',
    city: 'Bengaluru, KA',
    hardwareOwned: 'Pink Chrome Wired Earphones (Type-C)',
    quote:
      'Plugged straight into my Type-C phone with zero adapter clutter. The metallic pink chrome shell and carry case look straight out of 2001.',
    rating: 5,
    batchTag: 'DROP 01 VERIFIED HOLDER',
  },
  {
    id: 'ch-03',
    slotCode: 'CARDHOLDER // SLOT #003',
    status: 'verified',
    holderName: 'CARDHOLDER 03 · D. VIKRAM',
    city: 'Madurai, TN',
    hardwareOwned: 'Chain Bracelet + Cyber Signet Ring',
    quote:
      'Fast dispatch from Madurai with ₹0-advance COD. The industrial curb link bracelet stacks cleanly next to my analog watch.',
    rating: 5,
    batchTag: 'DROP 01 VERIFIED HOLDER',
  },
  {
    id: 'ch-04',
    slotCode: 'CARDHOLDER // SLOT #004',
    status: 'placeholder',
    holderName: 'RESERVED CARDHOLDER SLOT #004',
    city: 'Awaiting Collector Verification',
    hardwareOwned: 'Drop 01 Archive Hardware',
    quote:
      'Cardholder testimonial slot reserved for upcoming Drop 01 archive owners. Submit your order receipt or review below to claim this cardholder.',
    rating: 5,
    batchTag: 'OPEN CARDHOLDER SLOT',
  },
  {
    id: 'ch-05',
    slotCode: 'CARDHOLDER // SLOT #005',
    status: 'placeholder',
    holderName: 'RESERVED CARDHOLDER SLOT #005',
    city: 'Awaiting Collector Verification',
    hardwareOwned: '3-Piece Y2K Cyber Set / Watch',
    quote:
      'Cardholder testimonial slot reserved for Phase 1 & Phase 2 archive collectors. Verified unboxing reviews are minted directly into this grid.',
    rating: 5,
    batchTag: 'OPEN CARDHOLDER SLOT',
  },
  {
    id: 'ch-06',
    slotCode: 'CARDHOLDER // SLOT #006',
    status: 'placeholder',
    holderName: 'RESERVED CARDHOLDER SLOT #006',
    city: 'Awaiting Collector Verification',
    hardwareOwned: 'Full Monochrome Hardware Stack',
    quote:
      'Cardholder slot prepared for verified rwnd20s. hardware owners across India. Includes member ID badge and 10% next-drop priority.',
    rating: 5,
    batchTag: 'OPEN CARDHOLDER SLOT',
  },
];

export const TestimonialsSection: React.FC = () => {
  const [cardholders, setCardholders] =
    useState<CardholderSlot[]>(INITIAL_CARDHOLDERS);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [holderName, setHolderName] = useState('');
  const [holderCity, setHolderCity] = useState('');
  const [hardwareOwned, setHardwareOwned] = useState('3-Piece Y2K Cyber Set');
  const [reviewText, setReviewText] = useState('');
  const [formError, setFormError] = useState('');

  const handleClaimCardholder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holderName.trim() || !reviewText.trim()) {
      setFormError(
        'Please enter your name and hardware review to populate a cardholder slot.'
      );
      return;
    }

    setFormError('');
    const nextSlotNumber = String(cardholders.length + 1).padStart(3, '0');
    const newEntry: CardholderSlot = {
      id: `ch-${Date.now()}`,
      slotCode: `CARDHOLDER // SLOT #${nextSlotNumber}`,
      status: 'verified',
      holderName: `CARDHOLDER ${nextSlotNumber} · ${holderName
        .trim()
        .toUpperCase()}`,
      city: holderCity.trim() || 'India',
      hardwareOwned,
      quote: reviewText.trim(),
      rating: 5,
      batchTag: 'NEWLY REGISTERED CARDHOLDER',
    };

    // Replace the first placeholder slot if one exists, otherwise prepend
    const firstPlaceholderIndex = cardholders.findIndex(
      (c) => c.status === 'placeholder'
    );
    if (firstPlaceholderIndex > -1) {
      setCardholders((prev) =>
        prev.map((item, idx) =>
          idx === firstPlaceholderIndex
            ? {
                ...newEntry,
                slotCode: item.slotCode,
              }
            : item
        )
      );
    } else {
      setCardholders((prev) => [newEntry, ...prev]);
    }

    setHolderName('');
    setHolderCity('');
    setReviewText('');
    setShowClaimForm(false);
  };

  return (
    <section
      id="testimonials"
      data-testid="testimonials-section"
      className="metallic-chrome-bg border-b border-black/15 py-14 lg:py-24 text-[#09090B]"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-black/15 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono-tech text-xs font-semibold tracking-widest text-[#3F3F46] uppercase">
              03 · ARCHIVE COLLECTOR LEDGER &amp; CARDHOLDERS
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-[#09090B] uppercase sm:text-4xl">
              TESTIMONIALS &amp; ARCHIVE CARDHOLDERS
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowClaimForm((prev) => !prev);
              setFormError('');
            }}
            aria-expanded={showClaimForm}
            className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white px-5 py-2.5 font-mono-tech text-xs font-bold tracking-wider text-[#09090B] uppercase shadow-xs transition-colors hover:bg-[#09090B] hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>
              {showClaimForm
                ? 'CLOSE CARDHOLDER FORM'
                : 'ADD CARDHOLDER TESTIMONIAL'}
            </span>
          </button>
        </div>

        {/* Optional Interactive Cardholder Submission Form */}
        {showClaimForm && (
          <form
            onSubmit={handleClaimCardholder}
            noValidate
            className="mt-6 rounded-3xl border border-black/20 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono-tech text-xs font-bold tracking-wider text-[#09090B] uppercase">
                REGISTER YOUR COLLECTOR CARDHOLDER SLOT
              </p>
              <span className="font-mono-tech text-[11px] text-[#52525B]">
                DROP 01 VERIFIED ARCHIVE
              </span>
            </div>

            {formError && (
              <p
                role="alert"
                className="mt-2 font-mono-tech text-xs font-semibold text-[#09090B]"
              >
                {formError}
              </p>
            )}

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="cardholder-name"
                  className="block font-mono-tech text-[11px] font-bold text-[#09090B] uppercase"
                >
                  Cardholder Name
                </label>
                <input
                  id="cardholder-name"
                  type="text"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  placeholder="e.g. S. Pranav"
                  className="mt-1 w-full rounded-xl border border-black/20 bg-[#F4F5F7] px-3.5 py-2 text-xs text-[#09090B] placeholder-[#71717A] focus:border-[#09090B] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="cardholder-city"
                  className="block font-mono-tech text-[11px] font-bold text-[#09090B] uppercase"
                >
                  City / Dispatch Node
                </label>
                <input
                  id="cardholder-city"
                  type="text"
                  value={holderCity}
                  onChange={(e) => setHolderCity(e.target.value)}
                  placeholder="e.g. Madurai, TN"
                  className="mt-1 w-full rounded-xl border border-black/20 bg-[#F4F5F7] px-3.5 py-2 text-xs text-[#09090B] placeholder-[#71717A] focus:border-[#09090B] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="cardholder-hardware"
                  className="block font-mono-tech text-[11px] font-bold text-[#09090B] uppercase"
                >
                  Hardware Piece
                </label>
                <select
                  id="cardholder-hardware"
                  value={hardwareOwned}
                  onChange={(e) => setHardwareOwned(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-black/20 bg-[#F4F5F7] px-3.5 py-2 font-mono-tech text-xs text-[#09090B] focus:border-[#09090B] focus:outline-none"
                >
                  <option value="3-Piece Y2K Cyber Set">
                    3-Piece Y2K Cyber Set
                  </option>
                  <option value="Cyber Signet Ring">Cyber Signet Ring</option>
                  <option value="Heavy Chain + Pendant">
                    Heavy Chain + Pendant
                  </option>
                  <option value="Chain Bracelet">Chain Bracelet</option>
                  <option value="Pink Chrome Wired Earphones (Type-C)">
                    Pink Chrome Wired Earphones (Type-C)
                  </option>
                  <option value="Y2K Cyber Studs">Y2K Cyber Studs</option>
                  <option value="Y2K Watch">Y2K Watch</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="cardholder-review"
                className="block font-mono-tech text-[11px] font-bold text-[#09090B] uppercase"
              >
                Collector Testimonial Note
              </label>
              <textarea
                id="cardholder-review"
                rows={2}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with the 316L steel weight, finish, or dispatch..."
                className="mt-1 w-full rounded-xl border border-black/20 bg-[#F4F5F7] px-3.5 py-2 text-xs text-[#09090B] placeholder-[#71717A] focus:border-[#09090B] focus:outline-none"
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="rounded-full border border-black bg-[#09090B] px-6 py-2.5 font-mono-tech text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-white hover:text-[#09090B] cursor-pointer"
              >
                MINT CARDHOLDER SLOT →
              </button>
            </div>
          </form>
        )}

        {/* 6-Slot Metallic & White Accent Cardholders Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cardholders.map((slot) => {
            const isPlaceholder = slot.status === 'placeholder';
            return (
              <article
                key={slot.id}
                data-testid="testimonial-cardholder"
                className={`flex flex-col justify-between rounded-3xl border p-6 transition-all ${
                  isPlaceholder
                    ? 'border-dashed border-black/30 bg-white/75'
                    : 'border-black/20 bg-white shadow-[0_12px_32px_rgba(9,9,11,0.06)]'
                }`}
              >
                <div>
                  {/* Top Metallic ID Cardholder Bar */}
                  <div className="flex items-center justify-between gap-2 border-b border-black/10 pb-3">
                    <span className="inline-flex items-center gap-1.5 font-mono-tech text-[10px] font-bold tracking-widest text-[#09090B] uppercase">
                      <CreditCard className="h-3.5 w-3.5 text-[#09090B]" />
                      <span>{slot.slotCode}</span>
                    </span>

                    <span
                      className={`rounded-full border px-2.5 py-0.5 font-mono-tech text-[10px] font-bold uppercase ${
                        isPlaceholder
                          ? 'border-black/20 bg-[#E4E7EC] text-[#27272A]'
                          : 'border-black/20 bg-[#09090B] text-white'
                      }`}
                    >
                      {slot.batchTag}
                    </span>
                  </div>

                  {/* Star Rating Row */}
                  <div className="mt-4 flex items-center gap-1">
                    {Array.from({ length: slot.rating }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-3.5 w-3.5 ${
                          isPlaceholder
                            ? 'text-[#71717A]'
                            : 'fill-[#09090B] text-[#09090B]'
                        }`}
                      />
                    ))}
                    <span className="ml-1.5 font-mono-tech text-[11px] font-semibold text-[#3F3F46]">
                      5.0 // ARCHIVE SPEC
                    </span>
                  </div>

                  {/* Quote */}
                  <p className="mt-3 text-sm leading-relaxed text-[#18181B]">
                    &ldquo;{slot.quote}&rdquo;
                  </p>
                </div>

                {/* Cardholder Identity Footer */}
                <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4">
                  <div>
                    <h3 className="font-display text-xs font-extrabold tracking-wide text-[#09090B] uppercase">
                      {slot.holderName}
                    </h3>
                    <p className="mt-0.5 font-mono-tech text-[11px] text-[#3F3F46]">
                      {slot.hardwareOwned} · {slot.city}
                    </p>
                  </div>

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/15 bg-[#E8EBF0] text-[#09090B]">
                    {isPlaceholder ? (
                      <CreditCard className="h-4 w-4" />
                    ) : (
                      <UserCheck className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Cardholder Summary Strip */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-black/15 bg-white px-5 py-3.5 font-mono-tech text-xs text-[#09090B] shadow-xs">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-4 w-4 text-[#09090B]" />
            <span>
              VERIFIED ARCHIVE CARDHOLDERS · 100% 316L STAINLESS STEEL &amp;
              TYPE-C HARDWARE
            </span>
          </div>
          <span className="text-[#3F3F46]">
            DISPATCHED FROM MADURAI, TAMIL NADU
          </span>
        </div>
      </div>
    </section>
  );
};
