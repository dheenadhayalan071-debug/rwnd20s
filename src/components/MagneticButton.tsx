import React, { useState } from 'react';
import { motion } from '../utils/motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
  className?: string;
  type?: 'button' | 'submit';
  ariaLabel?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  ariaLabel,
}) => {
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setOffset({
      x: (e.clientX - centerX) * 0.14,
      y: (e.clientY - centerY) * 0.18,
    });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-semibold tracking-wider uppercase whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 cursor-pointer';

  const variantClasses =
    variant === 'primary'
      ? 'bg-white text-[#060606] hover:bg-[#E4E4E7] shadow-[0_0_30px_rgba(255,255,255,0.18)]'
      : 'border border-white/20 bg-white/[0.03] text-white hover:border-white/50 hover:bg-white/[0.08]';

  return (
    <motion.button
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.5 }}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {children}
    </motion.button>
  );
};
