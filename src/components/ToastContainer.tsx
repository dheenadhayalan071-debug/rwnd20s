import React from 'react';
import { CheckCircle2, Heart, BellRing, X } from 'lucide-react';
import { motion, AnimatePresence } from '../utils/motion';

export interface ToastMessage {
  id: string;
  title: string;
  subtitle?: string;
  type: 'price-drop' | 'wishlist' | 'success';
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      className="fixed right-4 bottom-4 z-[60] flex w-full max-w-sm flex-col gap-2.5 pointer-events-none sm:right-6 sm:bottom-6"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            role="status"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            className="pointer-events-auto flex items-start gap-3.5 rounded-2xl border border-black/20 bg-white p-4 text-[#09090B] shadow-[0_16px_45px_rgba(9,9,11,0.22)]"
          >
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/15 bg-[#E4E7EC] text-[#09090B]">
              {toast.type === 'price-drop' ? (
                <BellRing className="h-4 w-4" />
              ) : toast.type === 'wishlist' ? (
                <Heart className="h-4 w-4 fill-[#09090B] text-[#09090B]" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-mono-tech text-xs font-bold tracking-wider text-[#09090B] uppercase">
                {toast.title}
              </p>
              {toast.subtitle && (
                <p className="mt-0.5 text-xs leading-relaxed text-[#27272A]">
                  {toast.subtitle}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="rounded-full p-1 text-[#52525B] transition-colors hover:bg-black/10 hover:text-[#09090B] cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

