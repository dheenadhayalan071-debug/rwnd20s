import React, { useState } from 'react';
import { motion, AnimatePresence } from '../utils/motion';
import {
  X,
  Store,
  RefreshCw,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  TicketPercent,
} from 'lucide-react';
import {
  type ShopifyConnectionStatus,
  LOCAL_ARCHIVE_PRODUCTS,
  syncCatalogToShopify,
} from '../services/shopify';
import { generateShopifyProductsCsv } from '../utils/shopifyCatalogCsv';
import {
  WELCOME_INSTANT_CODE,
  WELCOME_NEXT_CODE,
  formatINR,
} from '../utils/catalogLogic';

interface ShopifyConnectModalProps {
  isOpen: boolean;
  status: ShopifyConnectionStatus;
  isCheckingStatus: boolean;
  onClose: () => void;
  onRefreshStatusAndCatalog: () => Promise<void>;
  onNotify: (title: string, subtitle: string) => void;
}

export const ShopifyConnectModal: React.FC<ShopifyConnectModalProps> = ({
  isOpen,
  status,
  isCheckingStatus,
  onClose,
  onRefreshStatusAndCatalog,
  onNotify,
}) => {
  const [isSyncingCatalog, setIsSyncingCatalog] = useState(false);
  const [syncResultMessage, setSyncResultMessage] = useState<string | null>(
    null
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyText = (key: string, value: string) => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 1800);
  };

  const handleDownloadCsv = () => {
    const csv = generateShopifyProductsCsv(LOCAL_ARCHIVE_PRODUCTS);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'rwnd20s-shopify-products.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onNotify(
      'SHOPIFY CSV DOWNLOADED',
      'Import rwnd20s-shopify-products.csv in Shopify Admin → Products → Import (includes all 7 drops & doubled stash prices).'
    );
  };

  const handlePushCatalogToShopify = async () => {
    setIsSyncingCatalog(true);
    setSyncResultMessage(null);
    const result = await syncCatalogToShopify();
    setIsSyncingCatalog(false);
    setSyncResultMessage(result.message);
    onNotify(
      result.success ? 'SHOPIFY CATALOG SYNCED' : 'SHOPIFY SYNC NOTICE',
      result.message
    );
    if (result.success) {
      await onRefreshStatusAndCatalog();
    }
  };

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shopify-connect-modal-title"
        data-testid="shopify-connect-modal"
        className="fixed inset-0 z-[75] flex items-center justify-center p-4 sm:p-6"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#09090B]/55 backdrop-blur-sm"
        />

        {/* Metallic Chrome Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="metallic-chrome-bg relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#09090B]/20 p-6 sm:p-8 text-[#09090B] shadow-[0_24px_70px_rgba(9,9,11,0.35)]"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Shopify connection modal"
            className="absolute top-4 right-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#09090B]/15 bg-white text-[#09090B] transition-colors hover:bg-[#09090B] hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#09090B]/15 bg-white px-3.5 py-1 font-mono-tech text-[11px] font-bold tracking-wider text-[#09090B] uppercase shadow-xs">
            <Store className="h-3.5 w-3.5 text-[#09090B]" />
            <span>SHOPIFY STOREFRONT &amp; ADMIN BRIDGE</span>
          </div>

          <h2
            id="shopify-connect-modal-title"
            className="mt-3 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#09090B] uppercase"
          >
            CONNECT WITH YOUR SHOPIFY STORE
          </h2>

          <p className="mt-1.5 text-sm leading-relaxed text-[#27272A]">
            Sync the 7 <strong className="text-[#09090B]">rwnd20s.</strong>{' '}
            hardware drops (with doubled Stash Prices and exact MRPs), live
            inventory, and automatic{' '}
            <strong className="text-[#09090B]">5% + 10% Welcome Pass</strong>{' '}
            checkout handoff with your Shopify store.
          </p>

          {/* Live Connection Status Card */}
          <div
            data-testid="shopify-status-card"
            className="mt-5 rounded-2xl border border-[#09090B]/20 bg-white p-4 shadow-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {status.connected ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#09090B]" />
                ) : (
                  <AlertCircle className="h-5 w-5 shrink-0 text-[#09090B]" />
                )}
                <div>
                  <span className="block font-mono-tech text-[10px] font-bold tracking-widest text-[#52525B] uppercase">
                    CURRENT BRIDGE STATUS
                  </span>
                  <p className="font-display text-sm font-extrabold text-[#09090B] uppercase">
                    {status.connected
                      ? `LIVE SHOPIFY CONNECTED · ${status.shopName || status.storeDomain}`
                      : 'LOCAL ARCHIVE PREVIEW · READY FOR SHOPIFY CREDENTIALS'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                data-testid="verify-shopify-btn"
                disabled={isCheckingStatus}
                onClick={onRefreshStatusAndCatalog}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#09090B] bg-[#09090B] px-4 py-2 font-mono-tech text-[11px] font-bold tracking-wider text-white uppercase transition-colors hover:bg-white hover:text-[#09090B] cursor-pointer"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${
                    isCheckingStatus ? 'animate-spin' : ''
                  }`}
                />
                <span>
                  {isCheckingStatus ? 'CHECKING...' : 'VERIFY & REFRESH'}
                </span>
              </button>
            </div>

            <p className="mt-2.5 border-t border-[#09090B]/10 pt-2.5 font-mono-tech text-xs text-[#27272A]">
              {status.message}
            </p>

            <div className="mt-3 grid grid-cols-3 gap-2 font-mono-tech text-[11px]">
              <div className="rounded-xl border border-[#09090B]/10 bg-[#EEF0F4] px-3 py-2">
                <span className="block text-[10px] text-[#52525B]">
                  STORE DOMAIN
                </span>
                <span className="font-bold text-[#09090B]">
                  {status.storeDomain || 'Not Set'}
                </span>
              </div>
              <div className="rounded-xl border border-[#09090B]/10 bg-[#EEF0F4] px-3 py-2">
                <span className="block text-[10px] text-[#52525B]">
                  STOREFRONT API
                </span>
                <span className="font-bold text-[#09090B]">
                  {status.storefrontConnected ? 'ACTIVE' : 'STANDBY'}
                </span>
              </div>
              <div className="rounded-xl border border-[#09090B]/10 bg-[#EEF0F4] px-3 py-2">
                <span className="block text-[10px] text-[#52525B]">
                  ACTIVE DROPS
                </span>
                <span className="font-bold text-[#09090B]">
                  {status.productCount} PRODUCTS ({status.currencyCode})
                </span>
              </div>
            </div>
          </div>

          {/* 1-Click Catalog Sync & CSV Export Actions */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              data-testid="download-shopify-csv-btn"
              onClick={handleDownloadCsv}
              className="flex flex-col justify-between rounded-2xl border border-[#09090B] bg-white p-4 text-left shadow-xs transition-colors hover:bg-[#09090B] hover:text-white group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono-tech text-[10px] font-bold tracking-widest text-[#52525B] group-hover:text-white/80 uppercase">
                  OPTION A · INSTANT CSV IMPORT
                </span>
                <Download className="h-4 w-4 text-[#09090B] group-hover:text-white" />
              </div>
              <p className="mt-2 font-display text-sm font-extrabold uppercase">
                DOWNLOAD SHOPIFY PRODUCTS CSV
              </p>
              <p className="mt-1 font-mono-tech text-[11px] text-[#3F3F46] group-hover:text-white/80">
                Exports all 7 RWND20s drops, variants, MRPs &amp; doubled Stash
                Prices for 1-click upload in{' '}
                <strong>Shopify Admin → Products → Import</strong>.
              </p>
            </button>

            <button
              type="button"
              data-testid="sync-shopify-catalog-btn"
              disabled={isSyncingCatalog}
              onClick={handlePushCatalogToShopify}
              className="flex flex-col justify-between rounded-2xl border border-[#09090B] bg-white p-4 text-left shadow-xs transition-colors hover:bg-[#09090B] hover:text-white group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono-tech text-[10px] font-bold tracking-widest text-[#52525B] group-hover:text-white/80 uppercase">
                  OPTION B · DIRECT ADMIN API PUSH
                </span>
                <UploadCloud className="h-4 w-4 text-[#09090B] group-hover:text-white" />
              </div>
              <p className="mt-2 font-display text-sm font-extrabold uppercase">
                {isSyncingCatalog
                  ? 'PUSHING 7 DROPS TO SHOPIFY...'
                  : 'PUSH 7 DROPS VIA ADMIN API'}
              </p>
              <p className="mt-1 font-mono-tech text-[11px] text-[#3F3F46] group-hover:text-white/80">
                Automatically creates all 7 products + doubled Stash Prices in
                your Shopify store via <code>/api/shopify/sync-catalog</code>.
              </p>
            </button>
          </div>

          {syncResultMessage && (
            <div
              role="status"
              data-testid="shopify-sync-result"
              className="mt-3 rounded-2xl border border-[#09090B]/20 bg-white px-4 py-3 font-mono-tech text-xs text-[#09090B]"
            >
              {syncResultMessage}
            </div>
          )}

          {/* Catalog Price & Doubled Stash Price Matrix Ready for Shopify */}
          <div className="mt-5 rounded-2xl border border-[#09090B]/15 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#09090B]/10 pb-2.5">
              <span className="font-mono-tech text-[11px] font-bold tracking-wider text-[#09090B] uppercase">
                PRE-CONFIGURED SHOPIFY CATALOG (MRP vs. DOUBLED STASH PRICE)
              </span>
              <span className="font-mono-tech text-[10px] font-bold text-[#52525B]">
                7 HARDWARE SKUS
              </span>
            </div>

            <div className="mt-2.5 divide-y divide-[#09090B]/10 font-mono-tech text-xs">
              {LOCAL_ARCHIVE_PRODUCTS.map((p) => (
                <div
                  key={p.sku}
                  className="flex items-center justify-between py-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#EEF0F4] px-1.5 py-0.5 text-[10px] font-bold text-[#09090B]">
                      {p.sku}
                    </span>
                    <span className="font-bold text-[#09090B]">{p.title}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-[#09090B]">
                      MRP {formatINR(p.price)}
                    </span>
                    <span className="text-[11px] text-[#52525B] line-through">
                      Stash {formatINR(p.compareAtPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Environment Variables & Welcome Offer Discount Setup Guide */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#09090B]/15 bg-white p-4 shadow-xs">
              <span className="font-mono-tech text-[10px] font-bold tracking-widest text-[#52525B] uppercase">
                STEP 1 · AI STUDIO ENVIRONMENT SECRETS
              </span>
              <p className="mt-1 text-xs text-[#27272A]">
                Add these keys in the AI Studio Environment / Secrets panel
                (server proxy <code>/api/shopify/*</code> reads them
                automatically):
              </p>
              <div className="mt-2.5 space-y-1.5 font-mono-tech text-[11px]">
                {[
                  'SHOPIFY_STORE_DOMAIN',
                  'SHOPIFY_STOREFRONT_ACCESS_TOKEN',
                  'SHOPIFY_ADMIN_ACCESS_TOKEN',
                ].map((envKey) => (
                  <div
                    key={envKey}
                    className="flex items-center justify-between rounded-lg border border-[#09090B]/10 bg-[#EEF0F4] px-2.5 py-1.5"
                  >
                    <code className="font-bold text-[#09090B]">{envKey}</code>
                    <button
                      type="button"
                      onClick={() => handleCopyText(envKey, envKey)}
                      aria-label={`Copy ${envKey}`}
                      className="inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[10px] font-bold text-[#09090B] border border-[#09090B]/15 cursor-pointer"
                    >
                      {copiedKey === envKey ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>COPY</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#09090B]/15 bg-white p-4 shadow-xs">
              <div className="flex items-center gap-1.5">
                <TicketPercent className="h-3.5 w-3.5 text-[#09090B]" />
                <span className="font-mono-tech text-[10px] font-bold tracking-widest text-[#52525B] uppercase">
                  STEP 2 · SHOPIFY DISCOUNT CODES
                </span>
              </div>
              <p className="mt-1 text-xs text-[#27272A]">
                Create these two discount codes in{' '}
                <strong className="text-[#09090B]">
                  Shopify Admin → Discounts
                </strong>{' '}
                so the entry popup auto-applies at checkout:
              </p>
              <div className="mt-2.5 space-y-2 font-mono-tech text-[11px]">
                <div className="flex items-center justify-between rounded-lg border border-[#09090B]/10 bg-[#EEF0F4] px-2.5 py-2">
                  <div>
                    <span className="font-bold text-[#09090B]">
                      {WELCOME_INSTANT_CODE}
                    </span>
                    <span className="ml-2 text-[#3F3F46]">
                      (5% OFF Current Order)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyText(WELCOME_INSTANT_CODE, WELCOME_INSTANT_CODE)
                    }
                    className="rounded bg-white px-2 py-0.5 text-[10px] font-bold text-[#09090B] border border-[#09090B]/15 cursor-pointer"
                  >
                    {copiedKey === WELCOME_INSTANT_CODE ? 'COPIED' : 'COPY'}
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-[#09090B]/10 bg-[#EEF0F4] px-2.5 py-2">
                  <div>
                    <span className="font-bold text-[#09090B]">
                      {WELCOME_NEXT_CODE}
                    </span>
                    <span className="ml-2 text-[#3F3F46]">
                      (10% OFF Next Purchase)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyText(WELCOME_NEXT_CODE, WELCOME_NEXT_CODE)
                    }
                    className="rounded bg-white px-2 py-0.5 text-[10px] font-bold text-[#09090B] border border-[#09090B]/15 cursor-pointer"
                  >
                    {copiedKey === WELCOME_NEXT_CODE ? 'COPIED' : 'COPY'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
