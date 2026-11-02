import React, { useState } from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: 'div' | 'button' | 'article';
  ariaLabel?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  onClick,
  as = 'div',
  ariaLabel,
}) => {
  const [coords, setCoords] = useState<{ x: number; y: number }>({
    x: 200,
    y: 120,
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const Component = as;

  return (
    <Component
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-2xl border border-white/15 bg-[#0E0E0E]/90 backdrop-blur-md transition-colors duration-200 hover:border-white/40 ${
        onClick ? 'cursor-pointer text-left' : ''
      } ${className}`}
    >
      {/* Dynamic cursor-tracking specular radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(380px circle at ${coords.x}px ${coords.y}px, rgba(255,255,255,0.13), transparent 65%)`,
        }}
      />
      <div className="relative z-10 h-full w-full">{children}</div>
    </Component>
  );
};
