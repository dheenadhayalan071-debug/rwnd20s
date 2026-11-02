import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from '../utils/motion';

interface ArchiveLoaderProps {
  onComplete?: () => void;
}

export const ArchiveLoader: React.FC<ArchiveLoaderProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        return false;
      }
    }
    return true;
  });

  useEffect(() => {
    if (!visible) {
      onComplete?.();
      return;
    }
    const timer = window.setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [visible, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          data-testid="archive-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={() => {
            setVisible(false);
            onComplete?.();
          }}
          className="retro-scanlines metallic-chrome-bg fixed inset-0 z-[100] flex flex-col items-center justify-center px-6 text-[#09090B] select-none"
        >
          {/* Spinning 3D Chrome-Style Logo */}
          <div className="relative flex h-32 w-32 items-center justify-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full studio-spotlight-intense"
            />

            <div className="chrome-3d-spin relative flex h-28 w-28 items-center justify-center rounded-full border border-black/25 bg-gradient-to-br from-white via-[#D4D8E0] to-[#9CA3AF] shadow-[0_16px_45px_rgba(9,9,11,0.2)]">
              <svg
                viewBox="0 0 120 120"
                className="h-20 w-20"
                fill="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="loader-chrome-grad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#09090B" />
                    <stop offset="45%" stopColor="#3F3F46" />
                    <stop offset="75%" stopColor="#09090B" />
                    <stop offset="100%" stopColor="#52525B" />
                  </linearGradient>
                </defs>
                {/* Outer 3D Chrome Orbital Ring */}
                <ellipse
                  cx="60"
                  cy="60"
                  rx="50"
                  ry="22"
                  transform="rotate(-24 60 60)"
                  stroke="url(#loader-chrome-grad)"
                  strokeWidth="3.5"
                />
                <ellipse
                  cx="60"
                  cy="60"
                  rx="50"
                  ry="22"
                  transform="rotate(24 60 60)"
                  stroke="url(#loader-chrome-grad)"
                  strokeWidth="1.75"
                  strokeDasharray="6 4"
                />
                {/* Central 4-Point Liquid Chrome Y2K Star */}
                <path
                  d="M60 10 L66 54 L110 60 L66 66 L60 110 L54 66 L10 60 L54 54 Z"
                  fill="url(#loader-chrome-grad)"
                />
                <circle cx="60" cy="60" r="5" fill="#FFFFFF" />
              </svg>
            </div>
          </div>

          {/* Brand Wordmark & Fixed-Width Terminal Status Message */}
          <div className="mt-7 text-center">
            <p className="font-display text-2xl font-black tracking-tighter text-[#09090B]">
              rwnd20s.
            </p>
            <p
              data-testid="archive-loader-status"
              className="mt-2.5 font-mono-tech text-xs font-semibold tracking-[0.22em] text-[#09090B]"
            >
              connecting to archive...
            </p>
            <p className="mt-1 font-mono-tech text-[10px] tracking-[0.18em] text-[#3F3F46] uppercase">
              NODE // MADURAI, TAMIL NADU
            </p>
          </div>

          {/* Terminal Progress Bar */}
          <div className="mt-5 h-1.5 w-52 overflow-hidden rounded-full border border-black/15 bg-white">
            <div className="h-full w-full origin-left animate-pulse rounded-full bg-[#09090B]" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

