import React from 'react';
import { motion } from '../utils/motion';

interface StarburstProps {
  className?: string;
  size?: number;
  delay?: number;
}

export const Starburst: React.FC<StarburstProps> = ({
  className = '',
  size = 36,
  delay = 0,
}) => {
  const uid = React.useId();
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
      initial={{ rotate: 0, scale: 0.92, opacity: 0.75 }}
      animate={{
        rotate: [0, 12, -8, 0],
        scale: [0.92, 1.08, 0.95, 0.92],
        opacity: [0.7, 1, 0.75, 0.7],
      }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      <defs>
        <linearGradient id={`starGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#D4D4D8" />
          <stop offset="70%" stopColor="#52525B" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>
      <path
        d="M32 0 C32 24 24 32 0 32 C24 32 32 40 32 64 C32 40 40 32 64 32 C40 32 32 24 32 0 Z"
        fill={`url(#starGrad-${uid})`}
      />
      <circle cx="32" cy="32" r="2.5" fill="#FFFFFF" />
    </motion.svg>
  );
};

interface OrbitalRingProps {
  className?: string;
}

export const OrbitalRing: React.FC<OrbitalRingProps> = ({ className = '' }) => {
  const uid = React.useId();
  return (
    <svg
      viewBox="0 0 520 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`orbitGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.65" />
          <stop offset="70%" stopColor="#D4D4D8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#71717A" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <ellipse
        cx="260"
        cy="130"
        rx="240"
        ry="76"
        transform="rotate(-14 260 130)"
        stroke={`url(#orbitGrad-${uid})`}
        strokeWidth="1.5"
      />
      <ellipse
        cx="260"
        cy="130"
        rx="212"
        ry="58"
        transform="rotate(-14 260 130)"
        stroke="#FFFFFF"
        strokeOpacity="0.14"
        strokeWidth="1"
        strokeDasharray="4 6"
      />
    </svg>
  );
};
