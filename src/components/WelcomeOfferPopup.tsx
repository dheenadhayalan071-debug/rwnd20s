import React, { useState } from 'react';
import { motion, AnimatePresence } from '../utils/motion';
import { X, Sparkles, CheckCircle2, Mail, Ticket } from 'lucide-react';
import {
  type WelcomeOfferState,
  validatePriceDropEmail,
  WELCOME_INSTANT_CODE,
  WELCOME_NEXT_CODE,
} from '../utils/catalogLogic';

interface WelcomeOfferPopupProps {
  isOpen: boolean;
  welcomeOffer: WelcomeOfferState | null;
  onClose: () => void;
  onUnlockOffer: (email: string) => void;
}

export const WelcomeOfferPopup: React.FC<WelcomeOfferPopupProps> = ({
  isOpen,
  welcomeOffer,
  onClose,
  onUnlockOffer,
}) => {
  const [emailInput, setEmailInput] = useState(welcomeOffer?.email || '');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validatePriceDropEmail(emailInput);
    if (!validation.valid) {
      setErrorMessage(
        validation.error || 'Please enter a valid email address.'
      );
      return;
    }
    setErrorMessage('');
    onUnlockOffer(validation.normalizedEmail);
  };

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-offer-title"
        data-testid="welcome-offer-popup"
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/45 backdrop-blur-sm"
        />

        {/* Metallic Chrome Modal with White Accents & Black Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 14 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="metallic-chrome-bg relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-black/20 p-6 sm:p-8 text-[#09090B] shadow-[0_24px_70px_rgba(9,9,11,0.35)]"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close welcome offer popup"
            className="absolute top-4 right-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/15 bg-white text-[#09090B] transition-colors hover:bg-black hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Top White Accent Pill */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-white px-3.5 py-1 font-mono-tech text-[11px] font-bold tracking-wider text-[#09090B] uppercase shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-[#09090B]" />
            <span>ARCHIVE ENTRY PASS // DUAL REWARD</span>
          </div>

          <h2
            id="welcome-offer-title"
            className="mt-4 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#09090B] uppercase"
          >
            UNLOCK 5% NOW + 10% NEXT DROP
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-[#27272A]">
            Enter your email to join the{' '}
            <strong className="text-[#09090B]">rwnd20s.</strong> collector list.
            Receive an instant <strong className="text-[#09090B]">5% OFF</strong>{' '}
            your current order plus a{' '}
            <strong className="text-[#09090B]">10% OFF</strong> voucher for your
            next purchase.
          </p>

          {/* Dual Offer Breakdown Cards (White Accent Surface) */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-black/15 bg-white p-3.5 shadow-xs">
              <span className="font-mono-tech text-[10px] font-bold tracking-widest text-[#52525B] uppercase">
                CURRENT ORDER
              </span>
              <p className="mt-1 font-display text-2xl font-extrabold text-[#09090B]">
                5% OFF
              </p>
              <p className="mt-0.5 font-mono-tech text-[11px] text-[#3F3F46]">
                Auto-applied at checkout
              </p>
            </div>

            <div className="rounded-2xl border border-black/15 bg-white p-3.5 shadow-xs">
              <span className="font-mono-tech text-[10px] font-bold tracking-widest text-[#52525B] uppercase">
                NEXT PURCHASE
              </span>
              <p className="mt-1 font-display text-2xl font-extrabold text-[#09090B]">
                10% OFF
              </p>
              <p className="mt-0.5 font-mono-tech text-[11px] text-[#3F3F46]">
                Reserved member voucher
              </p>
            </div>
          </div>

          {welcomeOffer ? (
            <div
              data-testid="welcome-offer-unlocked"
              className="mt-6 space-y-3 rounded-2xl border border-black/20 bg-white p-4 shadow-xs"
            >
              <div className="flex items-center gap-2 font-mono-tech text-xs font-bold text-[#09090B]">
                <CheckCircle2 className="h-4 w-4 text-[#09090B]" />
                <span>OFFER UNLOCKED FOR {welcomeOffer.email.toUpperCase()}</span>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 font-mono-tech text-xs">
                <div className="flex items-center justify-between rounded-xl border border-black/15 bg-[#EEF0F4] px-3 py-2">
                  <span className="text-[#3F3F46]">5% NOW:</span>
                  <span className="font-bold text-[#09090B]">
                    {WELCOME_INSTANT_CODE}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-black/15 bg-[#EEF0F4] px-3 py-2">
                  <span className="text-[#3F3F46]">10% NEXT:</span>
                  <span className="font-bold text-[#09090B]">
                    {WELCOME_NEXT_CODE}
                  </span>
                </div>
              </div>

              <p className="font-mono-tech text-[11px] text-[#3F3F46]">
                Your 5% instant discount is active in your shopping bag. Keep{' '}
                <strong className="text-[#09090B]">{WELCOME_NEXT_CODE}</strong>{' '}
                for 10% off your next purchase.
              </p>

              <button
                type="button"
                data-testid="welcome-apply-shop-btn"
                onClick={onClose}
                className="mt-2 w-full rounded-full border border-black bg-[#09090B] px-6 py-3 font-mono-tech text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-white hover:text-[#09090B] cursor-pointer"
              >
                CONTINUE TO ARCHIVE →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-3">
              <div>
                <label
                  htmlFor="welcome-offer-email"
                  className="block font-mono-tech text-[11px] font-bold tracking-wider text-[#09090B] uppercase"
                >
                  Email Address
                </label>
                <div className="relative mt-1.5">
                  <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#52525B]" />
                  <input
                    id="welcome-offer-email"
                    data-testid="welcome-email-input"
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Enter your email for 5% + 10% off..."
                    className="w-full rounded-2xl border border-black/20 bg-white py-3 pr-4 pl-10 font-mono-tech text-xs text-[#09090B] placeholder-[#71717A] focus:border-[#09090B] focus:outline-none"
                  />
                </div>
                {errorMessage && (
                  <p
                    role="alert"
                    className="mt-1.5 font-mono-tech text-[11px] font-semibold text-[#09090B]"
                  >
                    {errorMessage}
                  </p>
                )}
              </div>

              <button
                type="submit"
                data-testid="welcome-submit-btn"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-black bg-white px-6 py-3.5 font-mono-tech text-xs font-bold tracking-widest text-[#09090B] uppercase shadow-sm transition-colors hover:bg-[#09090B] hover:text-white cursor-pointer"
              >
                <Ticket className="h-4 w-4" />
                <span>CLAIM 5% OFF NOW + 10% NEXT PURCHASE</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-1 text-center font-mono-tech text-[11px] text-[#3F3F46] underline hover:text-[#09090B] cursor-pointer"
              >
                No thanks, I&apos;ll pay full price
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
