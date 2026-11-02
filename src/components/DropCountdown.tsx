import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { formatDropCountdown } from '../utils/catalogLogic';

const INITIAL_COUNTDOWN_MS = (14 * 3600 + 27 * 60 + 42) * 1000;

export const DropCountdown: React.FC = () => {
  const [remainingMs, setRemainingMs] = useState<number>(INITIAL_COUNTDOWN_MS);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemainingMs((prev) =>
        prev <= 1000 ? INITIAL_COUNTDOWN_MS : prev - 1000
      );
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const { hours, minutes, seconds } = formatDropCountdown(remainingMs);

  return (
    <div
      data-testid="drop-countdown"
      className="retro-window-bar inline-flex flex-wrap items-center gap-3 rounded-2xl border border-black/15 px-4 py-2.5 shadow-[0_8px_24px_rgba(9,9,11,0.08)]"
    >
      <div className="flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-[#09090B] animate-pulse" />
        <Clock className="h-3.5 w-3.5 text-[#09090B]" />
        <span className="font-mono-tech text-[11px] font-bold tracking-widest text-[#09090B] uppercase">
          NEXT LIMITED DROP IN
        </span>
      </div>

      <div
        aria-label={`Next limited drop countdown ${hours} hours ${minutes} minutes ${seconds} seconds`}
        className="flex items-center gap-1.5 font-mono-tech text-xs font-bold tracking-wider text-[#09090B]"
      >
        <span className="rounded border border-black/20 bg-white px-2 py-0.5 shadow-2xs">
          {hours}H
        </span>
        <span className="text-[#3F3F46]">:</span>
        <span className="rounded border border-black/20 bg-white px-2 py-0.5 shadow-2xs">
          {minutes}M
        </span>
        <span className="text-[#3F3F46]">:</span>
        <span className="rounded border border-black/20 bg-white px-2 py-0.5 text-[#09090B] shadow-2xs">
          {seconds}S
        </span>
      </div>
    </div>
  );
};

