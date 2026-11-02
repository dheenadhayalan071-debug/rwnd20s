import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import { formatSystemUptime } from '../utils/catalogLogic';

const LIMITED_DROPS_TICKER = [
  'LIMITED DROP 01 // 3-PIECE Y2K CYBER SET — ₹1,199 (STASH ₹2,894 · SAVE ₹1,695)',
  'LIMITED DROP // PINK CHROME WIRED EARPHONES (TYPE-C) — ₹999 (STASH ₹2,998)',
  'BESTSELLER // CYBER SIGNET RING — ₹349 (STASH ₹998 · 316L STAINLESS STEEL)',
  'CORE ARCHIVE // HEAVY CHAIN + PENDANT — ₹549 (STASH ₹1,598)',
  'CORE ARCHIVE // INDUSTRIAL CHAIN BRACELET — ₹549 (STASH ₹1,598 · ₹0 COD ADVANCE)',
  'PHASE 2 // Y2K ANALOG-DIGITAL WATCH — ₹1,999 PREPAID (STASH ₹4,998)',
];

export const RetroStatusFooter: React.FC = () => {
  const [uptimeSeconds, setUptimeSeconds] = useState<number>(172842);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const tickerItems = [...LIMITED_DROPS_TICKER, ...LIMITED_DROPS_TICKER];

  return (
    <div
      data-testid="retro-status-footer"
      className="retro-scanlines border-t border-black/15 bg-gradient-to-r from-[#D4D8E0] via-[#E6E9EF] to-[#D4D8E0] px-4 py-4 font-mono-tech text-[11px] text-[#09090B]"
    >
      <div className="mx-auto max-w-[1280px] space-y-3">
        {/* Top DOS-Style Terminal Output Line with Blinking 90s Command-Line Block Cursor */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/15 pb-2.5">
          <div className="flex items-center gap-2 font-bold text-[#09090B]">
            <Terminal className="h-3.5 w-3.5 text-[#09090B]" />
            <span>
              C:\RWND20S\ARCHIVE.EXE&gt; STATUS --NODE=MADURAI_TN
            </span>
            <span
              data-testid="terminal-block-cursor"
              aria-hidden="true"
              className="terminal-block-cursor ml-1"
            >
              █
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[10px] font-semibold tracking-wider uppercase">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-white px-2.5 py-0.5 text-[#09090B] shadow-xs">
              <span className="h-2 w-2 rounded-full bg-[#09090B] animate-pulse" />
              SERVER STATUS: ONLINE (200 OK)
            </span>
            <span className="text-[#18181B]">
              SYSTEM UPTIME: {formatSystemUptime(uptimeSeconds)}
            </span>
            <span className="hidden sm:inline text-[#3F3F46]">
              LOC: MADURAI, TAMIL NADU
            </span>
          </div>
        </div>

        {/* Continuous Scrolling Ticker of Recent Limited Drops */}
        <div className="flex items-center gap-3 overflow-hidden py-0.5">
          <span className="shrink-0 rounded border border-black/20 bg-white px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-[#09090B] uppercase shadow-xs">
            LIMITED DROPS
          </span>
          <div className="relative flex-1 overflow-hidden whitespace-nowrap">
            <div className="retro-ticker-track items-center gap-8 text-[11px] font-medium tracking-wider text-[#09090B]">
              {tickerItems.map((item, idx) => (
                <span key={idx} className="inline-flex items-center gap-2.5 pr-6">
                  <span className="font-bold text-[#09090B]">✦</span>
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

