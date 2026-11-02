import React from 'react';

interface BrandWordmarkProps {
  className?: string;
  alt?: string;
}

/**
 * Renders "rwnd20s." as a crisp black typographic wordmark on the metallic chrome canvas.
 */
export const BrandWordmark: React.FC<BrandWordmarkProps> = ({
  className = '',
}) => {
  return (
    <span
      className={`font-display font-black tracking-tighter text-xl text-[#09090B] select-none ${className}`}
    >
      rwnd20s.
    </span>
  );
};

interface BrandEmblemProps {
  className?: string;
  alt?: string;
}

export const BrandEmblem: React.FC<BrandEmblemProps> = ({
  className = '',
}) => {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-black/20 bg-white font-display text-xs font-black tracking-tighter text-[#09090B] select-none ${className}`}
    >
      rw.
    </span>
  );
};

interface BrandLockupProps {
  size?: 'header' | 'drawer' | 'footer';
  showEmblem?: boolean;
  className?: string;
}

export const BrandLockup: React.FC<BrandLockupProps> = ({
  size = 'header',
  className = '',
}) => {
  const sizeClass =
    size === 'footer'
      ? 'text-2xl sm:text-3xl'
      : size === 'drawer'
      ? 'text-xl'
      : 'text-xl';

  return (
    <span
      className={`font-display font-black tracking-tighter text-[#09090B] select-none ${sizeClass} ${className}`}
    >
      rwnd20s.
    </span>
  );
};

