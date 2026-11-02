import React, { useState } from 'react';
import { motion, AnimatePresence } from '../utils/motion';
import {
  X,
  Trash2,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  CheckCircle2,
  Sparkles,
  Lock,
  Heart,
  Plus,
  Eye,
  TicketPercent,
} from 'lucide-react';
import {
  type CartItem,
  type Product,
  type WelcomeOfferState,
  calculateCartTotals,
  calculateCodCheckoutBreakdown,
  formatINR,
} from '../utils/catalogLogic';
import {
  createShopifyCheckout,
  isShopifyConfigured,
} from '../services/shopify';

export type DrawerTab = 'bag' | 'wishlist';

interface CartDrawerProps {
  isOpen: boolean;
  activeTab: DrawerTab;
  onTabChange: (tab: DrawerTab) => void;
  onClose: () => void;
  cart: CartItem[];
  wishlistProducts: Product[];
  welcomeOffer?: WelcomeOfferState | null;
  onOpenWelcomePopup?: () => void;
  onOpenShopifyModal?: () => void;
  shopifyConnected?: boolean;
  shopifyStoreDomain?: string | null;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onRemoveFromWishlist: (product: Product) => void;
  onMoveWishlistToBag: (product: Product) => void;
  onOpenQuickView: (product: Product) => void;
  initialShowCheckoutForm?: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  activeTab,
  onTabChange,
  onClose,
  cart,
  wishlistProducts,
  welcomeOffer = null,
  onOpenWelcomePopup,
  onOpenShopifyModal,
  shopifyConnected = false,
  shopifyStoreDomain = null,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onRemoveFromWishlist,
  onMoveWishlistToBag,
  onOpenQuickView,
  initialShowCheckoutForm = false,
}) => {
  const [step, setStep] = useState<'bag' | 'checkout' | 'confirmed'>(
    initialShowCheckoutForm ? 'checkout' : 'bag'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderReference, setOrderReference] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>(
    'razorpay'
  );
  const [formError, setFormError] = useState('');
  const [confirmedTotal, setConfirmedTotal] = useState(0);

  React.useEffect(() => {
    if (isOpen) {
      setStep(
        activeTab === 'bag' && initialShowCheckoutForm && cart.length > 0
          ? 'checkout'
          : 'bag'
      );
      setFormError('');
    }
  }, [isOpen, initialShowCheckoutForm, cart.length, activeTab]);

  const hasWelcomeDiscount = Boolean(welcomeOffer);
  const summary = calculateCartTotals(cart, hasWelcomeDiscount);
  const codBreakdown = calculateCodCheckoutBreakdown(
    cart,
    paymentMethod === 'cod' ? 'cod' : 'prepaid',
    hasWelcomeDiscount
  );

  const handleProceedToCheckout = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    const result = await createShopifyCheckout(cart, {
      welcomeDiscountCode: welcomeOffer?.instantCode || null,
      customerEmail: welcomeOffer?.email || null,
      paymentMethod: paymentMethod === 'cod' ? 'cod' : 'prepaid',
    });
    setIsSubmitting(false);

    if (result.mode === 'shopify-live' && result.checkoutUrl) {
      window.location.assign(result.checkoutUrl);
      return;
    }

    setOrderReference(result.referenceId);
    setStep('checkout');
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !customerName.trim() ||
      !shippingAddress.trim() ||
      !pinCode.trim()
    ) {
      setFormError('Please fill in all shipping delivery fields.');
      return;
    }

    setFormError('');
    setConfirmedTotal(codBreakdown.finalOrderTotal);
    if (!orderReference) {
      setOrderReference(`RWND-${Math.floor(100000 + Math.random() * 900000)}`);
    }
    onClearCart();
    setStep('confirmed');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Bag and Wishlist Drawer"
        className="fixed inset-0 z-50 flex justify-end"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#09090B]/55 backdrop-blur-sm"
        />

        {/* Slide-Out Panel */}
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="metallic-chrome-bg relative z-10 flex h-full w-full max-w-md flex-col border-l border-white bg-[#DCDFE5] text-[#09090B] shadow-2xl"
        >
          {/* Drawer Header with Bag / Wishlist Segmented Switcher */}
          <div className="border-b border-[#09090B]/15 bg-white/60 px-6 py-4 backdrop-blur-md">
            <div className="flex items-center justify-between gap-3">
              <div
                role="tablist"
                aria-label="Drawer view switcher"
                className="flex items-center gap-2"
              >
                <button
                  role="tab"
                  type="button"
                  aria-selected={activeTab === 'bag'}
                  onClick={() => {
                    onTabChange('bag');
                    setStep('bag');
                  }}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono-tech text-xs font-bold tracking-wider uppercase transition-colors duration-75 whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'bag'
                      ? 'border-[#09090B] bg-white text-[#09090B] shadow-sm'
                      : 'border-[#09090B]/20 bg-white/50 text-[#3F3F46] hover:border-[#09090B] hover:text-[#09090B]'
                  }`}
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>BAG ({summary.itemCount})</span>
                </button>

                <button
                  role="tab"
                  type="button"
                  aria-selected={activeTab === 'wishlist'}
                  onClick={() => onTabChange('wishlist')}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono-tech text-xs font-bold tracking-wider uppercase transition-colors duration-75 whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'wishlist'
                      ? 'border-[#09090B] bg-white text-[#09090B] shadow-sm'
                      : 'border-[#09090B]/20 bg-white/50 text-[#3F3F46] hover:border-[#09090B] hover:text-[#09090B]'
                  }`}
                >
                  <Heart
                    className={`h-3.5 w-3.5 ${
                      activeTab === 'wishlist'
                        ? 'fill-[#09090B] text-[#09090B]'
                        : ''
                    }`}
                  />
                  <span>WISHLIST ({wishlistProducts.length})</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close drawer"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#09090B]/20 bg-white text-[#09090B] transition-colors hover:border-[#09090B] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Live Dynamic ₹999 Free Shipping Progress Bar (shown on Bag tab) */}
          {activeTab === 'bag' && step !== 'confirmed' && (
            <div className="border-b border-[#09090B]/15 bg-white/75 px-6 py-3.5">
              <div className="flex items-center justify-between text-xs">
                {summary.hasUnlockedFreeShipping ? (
                  <p className="font-mono-tech font-bold text-[#09090B]">
                    ✦ You&apos;ve unlocked FREE Express Shipping!
                  </p>
                ) : (
                  <p className="font-mono-tech text-[#27272A]">
                    Add{' '}
                    <span className="font-bold text-[#09090B]">
                      {formatINR(summary.amountRemainingForFreeShipping)}
                    </span>{' '}
                    more to unlock FREE Shipping
                  </p>
                )}
                <span className="font-mono-tech text-[11px] font-bold text-[#52525B]">
                  {summary.shippingProgressPercent}%
                </span>
              </div>

              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#09090B]/15">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${summary.shippingProgressPercent}%` }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="h-full rounded-full bg-[#09090B]"
                />
              </div>
            </div>
          )}

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {activeTab === 'wishlist' ? (
              wishlistProducts.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white bg-white shadow-sm">
                    <Heart className="h-6 w-6 text-[#09090B]" />
                  </div>
                  <p className="mt-4 font-display text-lg font-bold text-[#09090B] uppercase">
                    YOUR WISHLIST IS EMPTY
                  </p>
                  <p className="mt-1 max-w-xs text-xs text-[#3F3F46]">
                    Tap the heart icon on any chronograph, pink chrome Type-C
                    wired earphones, ring, or chain to save it for later.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 rounded-full border border-[#09090B] bg-white px-6 py-2.5 text-xs font-bold tracking-wider text-[#09090B] uppercase transition-colors hover:bg-[#F4F4F5] cursor-pointer"
                  >
                    BROWSE HARDWARE ARCHIVE
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#09090B]/15 pb-2.5 font-mono-tech text-[11px] font-bold text-[#3F3F46]">
                    <span>SAVED TO LOCAL ARCHIVE</span>
                    <span>{wishlistProducts.length} ARTIFACTS</span>
                  </div>

                  <ul className="space-y-3.5">
                    {wishlistProducts.map((product) => (
                      <li
                        key={product.id}
                        className="flex flex-col gap-3 rounded-2xl border border-white bg-white/85 p-3.5 shadow-sm"
                      >
                        <div className="flex gap-3.5">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            onClick={() => {
                              onClose();
                              onOpenQuickView(product);
                            }}
                            referrerPolicy="no-referrer"
                            className="h-20 w-20 shrink-0 cursor-pointer rounded-xl border border-[#09090B]/15 bg-[#D4D8E0] object-contain p-1.5"
                          />

                          <div className="flex min-w-0 flex-1 flex-col justify-between">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="font-mono-tech text-[10px] font-bold text-[#52525B] uppercase">
                                  {product.categoryLabel}
                                </span>
                                <h3 className="font-display text-xs font-bold tracking-wide text-[#09090B] uppercase">
                                  {product.title}
                                </h3>
                              </div>

                              <button
                                type="button"
                                onClick={() => onRemoveFromWishlist(product)}
                                aria-label={`Remove ${product.title} from wishlist`}
                                className="text-[#52525B] transition-colors hover:text-[#09090B] cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="mt-2 flex items-baseline gap-2">
                              <span className="font-mono-tech text-sm font-bold text-[#09090B]">
                                {formatINR(product.price)}
                              </span>
                              <span className="font-mono-tech text-[11px] text-[#52525B] line-through">
                                {formatINR(product.compareAtPrice)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 border-t border-[#09090B]/10 pt-3">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenQuickView(product);
                            }}
                            aria-label={`Inspect ${product.title}`}
                            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#09090B]/20 bg-white px-3.5 py-2 font-mono-tech text-[11px] font-bold text-[#09090B] uppercase transition-colors hover:border-[#09090B] whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>SPEC</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onMoveWishlistToBag(product)}
                            aria-label={`Move ${product.title} to bag`}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#09090B] bg-white px-4 py-2 font-mono-tech text-[11px] font-bold tracking-wider text-[#09090B] uppercase shadow-sm transition-colors hover:bg-[#F4F4F5] whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>MOVE TO BAG</span>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ) : step === 'confirmed' ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white bg-white shadow-sm">
                  <CheckCircle2 className="h-8 w-8 text-[#09090B]" />
                </div>
                <p className="mt-4 font-mono-tech text-xs font-bold tracking-widest text-[#52525B] uppercase">
                  ORDER #{orderReference} · VERIFIED
                </p>
                <h3 className="mt-2 font-display text-2xl font-extrabold text-[#09090B] uppercase">
                  DISPATCHING FROM ARCHIVE
                </h3>
                <p className="mt-2 max-w-xs text-sm text-[#27272A]">
                  Thank you, {customerName}. Your monochrome hardware drop is
                  confirmed and preparing for express dispatch.
                </p>

                <div className="mt-6 w-full rounded-2xl border border-white bg-white/90 p-4 text-left font-mono-tech text-xs shadow-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-[#52525B]">ORDER REF</span>
                    <span className="font-bold text-[#09090B]">
                      {orderReference}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#52525B]">PAYMENT</span>
                    <span className="font-bold text-[#09090B] uppercase">
                      {paymentMethod === 'razorpay'
                        ? 'RAZORPAY SECURE'
                        : 'CASH ON DELIVERY'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#52525B]">DELIVERY PIN</span>
                    <span className="font-bold text-[#09090B]">{pinCode}</span>
                  </div>
                  {welcomeOffer && (
                    <div className="flex justify-between py-1">
                      <span className="text-[#52525B]">NEXT ORDER CODE</span>
                      <span className="font-bold text-[#09090B]">
                        {welcomeOffer.nextOrderCode} (10% OFF)
                      </span>
                    </div>
                  )}
                  <div className="mt-2 flex justify-between border-t border-[#09090B]/15 pt-2 font-bold">
                    <span className="text-[#27272A]">TOTAL PAID</span>
                    <span className="text-[#09090B]">
                      {formatINR(confirmedTotal)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStep('bag');
                    onClose();
                  }}
                  className="mt-6 w-full rounded-full border border-[#09090B] bg-white py-3.5 text-xs font-bold tracking-wider text-[#09090B] uppercase shadow-sm transition-colors hover:bg-[#F4F4F5] cursor-pointer"
                >
                  CONTINUE EXPLORING ARCHIVE
                </button>
              </div>
            ) : step === 'checkout' ? (
              <form
                id="checkout-handoff-form"
                onSubmit={handleCompleteOrder}
                className="space-y-4"
              >
                <div className="rounded-2xl border border-white bg-white/85 p-3.5 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-tech text-[11px] font-bold text-[#27272A]">
                      {shopifyConnected || isShopifyConfigured
                        ? `SHOPIFY CHECKOUT · ${shopifyStoreDomain || 'CONNECTED'}`
                        : 'RAZORPAY / SHOPIFY EXPRESS HANDOFF'}
                    </span>
                    <Lock className="h-3.5 w-3.5 text-[#09090B]" />
                  </div>
                  <p className="mt-1 text-xs text-[#3F3F46]">
                    Complete delivery verification below to finalize your order.
                  </p>
                  {onOpenShopifyModal && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenShopifyModal();
                      }}
                      className="mt-2 inline-flex items-center gap-1 font-mono-tech text-[10px] font-bold text-[#09090B] underline cursor-pointer"
                    >
                      {shopifyConnected
                        ? 'Manage Shopify Store Sync →'
                        : 'Connect your Shopify Store / Export CSV →'}
                    </button>
                  )}
                </div>

                {formError && (
                  <p
                    role="alert"
                    className="rounded-xl border border-[#09090B] bg-white px-3.5 py-2 text-xs font-bold text-[#09090B]"
                  >
                    {formError}
                  </p>
                )}

                <div>
                  <label
                    htmlFor="checkout-name"
                    className="block font-mono-tech text-[11px] font-bold text-[#27272A] uppercase"
                  >
                    Full Name
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Aarav Mehta"
                    className="mt-1.5 w-full rounded-xl border border-[#09090B]/25 bg-white px-3.5 py-2.5 text-sm text-[#09090B] placeholder-[#71717A] focus:border-[#09090B] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-address"
                    className="block font-mono-tech text-[11px] font-bold text-[#27272A] uppercase"
                  >
                    Street Address &amp; City
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Madurai, Tamil Nadu"
                    className="mt-1.5 w-full rounded-xl border border-[#09090B]/25 bg-white px-3.5 py-2.5 text-sm text-[#09090B] placeholder-[#71717A] focus:border-[#09090B] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-pin"
                    className="block font-mono-tech text-[11px] font-bold text-[#27272A] uppercase"
                  >
                    Postal PIN Code
                  </label>
                  <input
                    id="checkout-pin"
                    type="text"
                    required
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="625001"
                    className="mt-1.5 w-full rounded-xl border border-[#09090B]/25 bg-white px-3.5 py-2.5 font-mono-tech text-sm text-[#09090B] placeholder-[#71717A] focus:border-[#09090B] focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <span className="block font-mono-tech text-[11px] font-bold text-[#27272A] uppercase">
                    Payment Method
                  </span>
                  <div className="mt-2 grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('razorpay')}
                      className={`rounded-xl border px-3 py-2.5 text-left font-mono-tech text-xs transition-all cursor-pointer ${
                        paymentMethod === 'razorpay'
                          ? 'border-[#09090B] bg-white text-[#09090B] font-bold shadow-sm'
                          : 'border-[#09090B]/20 bg-white/50 text-[#3F3F46]'
                      }`}
                    >
                      Prepaid (UPI / Cards)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`rounded-xl border px-3 py-2.5 text-left font-mono-tech text-xs transition-all cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'border-[#09090B] bg-white text-[#09090B] font-bold shadow-sm'
                          : 'border-[#09090B]/20 bg-white/50 text-[#3F3F46]'
                      }`}
                    >
                      Cash on Delivery (COD)
                    </button>
                  </div>

                  {/* COD Policy Notice (Accessories ₹0 advance vs Watch ₹150 UPI advance) */}
                  {paymentMethod === 'cod' && (
                    <div className="mt-3 rounded-xl border border-white bg-white/90 p-3 font-mono-tech text-[11px] text-[#27272A] shadow-sm">
                      {codBreakdown.hasPhase2Watch ? (
                        <div className="space-y-1">
                          <p className="font-bold text-[#09090B]">
                            ⚠ PHASE 2 WATCH COD ADVANCE REQUIRED:{' '}
                            {formatINR(codBreakdown.upiAdvanceRequired)} VIA UPI
                          </p>
                          <p className="text-[#3F3F46]">
                            ₹150 advance is non-refundable. It covers part of
                            the delivery cost if an order is refused or
                            returned.
                          </p>
                        </div>
                      ) : (
                        <p>
                          ✓ Accessories COD Policy: ₹0 advance required. Pay{' '}
                          <span className="font-bold text-[#09090B]">
                            {formatINR(codBreakdown.finalOrderTotal)}
                          </span>{' '}
                          in cash/UPI upon doorstep delivery.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </form>
            ) : cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white bg-white shadow-sm">
                  <Sparkles className="h-6 w-6 text-[#09090B]" />
                </div>
                <p className="mt-4 font-display text-lg font-bold text-[#09090B] uppercase">
                  YOUR HARDWARE BAG IS EMPTY
                </p>
                <p className="mt-1 max-w-xs text-xs text-[#3F3F46]">
                  Explore Drop 01 watches, pink chrome Type-C wired earphones,
                  heavy 316L rings, chains, and bracelets.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 rounded-full border border-[#09090B] bg-white px-6 py-2.5 text-xs font-bold tracking-wider text-[#09090B] uppercase transition-colors hover:bg-[#F4F4F5] cursor-pointer"
                >
                  EXPLORE ARCHIVE
                </button>
              </div>
            ) : (
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li
                    key={item.cartItemId}
                    className="flex gap-4 rounded-2xl border border-white bg-white/85 p-3.5 shadow-sm"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      referrerPolicy="no-referrer"
                      className="h-20 w-20 shrink-0 rounded-xl border border-[#09090B]/15 bg-[#D4D8E0] object-contain p-1.5"
                    />

                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-display text-xs font-bold tracking-wide text-[#09090B] uppercase">
                            {item.product.title}
                          </h3>
                          <p className="mt-0.5 font-mono-tech text-[11px] text-[#52525B]">
                            {item.selectedVariant.label}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.cartItemId)}
                          aria-label={`Remove ${item.product.title} from bag`}
                          className="text-[#52525B] transition-colors hover:text-[#09090B] cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-[#09090B]/20 bg-white px-1.5 py-0.5">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${item.product.title}`}
                            onClick={() =>
                              onUpdateQuantity(item.cartItemId, -1)
                            }
                            className="h-6 w-6 rounded-full font-mono-tech text-xs font-bold text-[#09090B] hover:bg-[#09090B]/10 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-mono-tech text-xs font-bold text-[#09090B]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase quantity of ${item.product.title}`}
                            onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                            className="h-6 w-6 rounded-full font-mono-tech text-xs font-bold text-[#09090B] hover:bg-[#09090B]/10 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-mono-tech text-sm font-bold text-[#09090B]">
                          {formatINR(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Drawer Footer (shown on Bag tab when items exist) */}
          {activeTab === 'bag' && cart.length > 0 && step !== 'confirmed' && (
            <div className="border-t border-[#09090B]/15 bg-white/85 px-6 py-5 backdrop-blur-md">
              {/* Welcome Offer Banner inside Bag */}
              {welcomeOffer ? (
                <div className="mb-3 rounded-xl border border-[#09090B]/20 bg-white px-3.5 py-2.5 font-mono-tech text-[11px] text-[#09090B]">
                  <div className="flex items-center justify-between font-bold">
                    <span className="inline-flex items-center gap-1.5">
                      <TicketPercent className="h-3.5 w-3.5" />
                      <span>5% WELCOME PASS APPLIED ({welcomeOffer.instantCode})</span>
                    </span>
                    <span>-{formatINR(summary.welcomeDiscountAmount)}</span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-[#52525B]">
                    + 10% OFF next purchase reserved ({welcomeOffer.nextOrderCode})
                  </p>
                </div>
              ) : (
                onOpenWelcomePopup && (
                  <button
                    type="button"
                    onClick={onOpenWelcomePopup}
                    className="mb-3 flex w-full items-center justify-between rounded-xl border border-[#09090B]/25 bg-white px-3.5 py-2 font-mono-tech text-[11px] font-bold text-[#09090B] transition-colors hover:border-[#09090B] cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <TicketPercent className="h-3.5 w-3.5" />
                      <span>UNLOCK 5% OFF NOW + 10% NEXT ORDER</span>
                    </span>
                    <span className="underline">CLAIM →</span>
                  </button>
                )
              )}

              <div className="space-y-1.5 font-mono-tech text-xs">
                <div className="flex justify-between text-[#3F3F46]">
                  <span>SUBTOTAL (MRP INCL. TAX)</span>
                  <span>{formatINR(summary.subtotal)}</span>
                </div>
                {summary.welcomeDiscountAmount > 0 && (
                  <div className="flex justify-between font-bold text-[#09090B]">
                    <span>WELCOME OFFER (5% OFF)</span>
                    <span>-{formatINR(summary.welcomeDiscountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#3F3F46]">
                  <span>EXPRESS SHIPPING</span>
                  <span className="font-bold text-[#09090B]">
                    {summary.shippingFee === 0
                      ? 'FREE'
                      : formatINR(summary.shippingFee)}
                  </span>
                </div>
                {step === 'checkout' &&
                  paymentMethod === 'cod' &&
                  codBreakdown.codSurcharge > 0 && (
                    <div className="flex justify-between text-[#27272A]">
                      <span>PHASE 2 WATCH COD RATE</span>
                      <span>+{formatINR(codBreakdown.codSurcharge)}</span>
                    </div>
                  )}
                {step === 'checkout' &&
                  paymentMethod === 'cod' &&
                  codBreakdown.upiAdvanceRequired > 0 && (
                    <div className="flex justify-between font-bold text-[#09090B]">
                      <span>NON-REFUNDABLE UPI ADVANCE</span>
                      <span>{formatINR(codBreakdown.upiAdvanceRequired)}</span>
                    </div>
                  )}
                <div className="flex justify-between border-t border-[#09090B]/15 pt-2 text-sm font-bold text-[#09090B]">
                  <span>
                    {step === 'checkout' &&
                    paymentMethod === 'cod' &&
                    codBreakdown.upiAdvanceRequired > 0
                      ? 'TOTAL (BALANCE ON DELIVERY: ' +
                        formatINR(codBreakdown.payableOnDelivery) +
                        ')'
                      : 'ESTIMATED TOTAL'}
                  </span>
                  <span>
                    {formatINR(
                      step === 'checkout'
                        ? codBreakdown.finalOrderTotal
                        : summary.grandTotal
                    )}
                  </span>
                </div>
              </div>

              {step === 'bag' ? (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleProceedToCheckout}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-[#09090B] bg-white px-6 py-3.5 text-xs font-bold tracking-wider text-[#09090B] uppercase shadow-sm transition-colors hover:bg-[#F4F4F5] cursor-pointer"
                >
                  <span>
                    {isSubmitting
                      ? 'PREPARING CHECKOUT...'
                      : 'PROCEED TO CHECKOUT →'}
                  </span>
                </button>
              ) : (
                <div className="mt-4 flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStep('bag')}
                    className="rounded-full border border-[#09090B]/25 bg-white px-4 py-3 text-xs font-bold text-[#09090B] uppercase hover:border-[#09090B] cursor-pointer"
                  >
                    BACK
                  </button>
                  <button
                    type="submit"
                    form="checkout-handoff-form"
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#09090B] bg-white px-5 py-3 text-xs font-bold tracking-wider text-[#09090B] uppercase shadow-sm transition-colors hover:bg-[#F4F4F5] cursor-pointer"
                  >
                    <span>
                      COMPLETE ORDER · {formatINR(codBreakdown.finalOrderTotal)}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="mt-3 flex items-center justify-center gap-1.5 font-mono-tech text-[11px] text-[#3F3F46]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#09090B]" />
                <span>256-Bit SSL · COD &amp; Prepaid Across India</span>
              </div>
            </div>
          )}
        </motion.aside>
      </div>
    </AnimatePresence>
  );
};
