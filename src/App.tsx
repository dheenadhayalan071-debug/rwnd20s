/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from './utils/motion';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Heart,
  ArrowUpRight,
  TicketPercent,
  Store,
} from 'lucide-react';
import {
  type CategoryHandle,
  type Product,
  type ProductVariant,
  type CartItem,
  type SortOption,
  type WelcomeOfferState,
  filterAndSortProducts,
  addToCartState,
  updateCartItemQuantity,
  removeCartItem,
  calculateCartTotals,
  WISHLIST_STORAGE_KEY,
  PRICE_DROP_STORAGE_KEY,
  RECENTLY_VIEWED_STORAGE_KEY,
  CUSTOM_IMAGES_STORAGE_KEY,
  WELCOME_OFFER_STORAGE_KEY,
  parseWishlistStorage,
  toggleWishlistId,
  removeWishlistId,
  parseRecentlyViewedStorage,
  recordRecentlyViewedId,
  getRecentlyViewedProducts,
  resolveKeyboardShortcut,
  applyCustomProductImages,
  createWelcomeOfferState,
  parseWelcomeOfferStorage,
  formatINR,
} from './utils/catalogLogic';
import {
  type ShopifyConnectionStatus,
  LOCAL_ARCHIVE_PRODUCTS,
  fetchLiveOrFallbackCatalog,
  fetchShopifyConnectionStatus,
} from './services/shopify';
import { HeroSection } from './components/HeroSection';
import { BentoCollections } from './components/BentoCollections';
import { ProductArchiveSection } from './components/ProductArchiveSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { CartDrawer, type DrawerTab } from './components/CartDrawer';
import { TrustAndAboutSection } from './components/TrustAndAboutSection';
import { ToastContainer, type ToastMessage } from './components/ToastContainer';
import { BrandLockup } from './components/BrandLogo';
import { ArchiveLoader } from './components/ArchiveLoader';
import { WelcomeOfferPopup } from './components/WelcomeOfferPopup';
import { ShopifyConnectModal } from './components/ShopifyConnectModal';

type NavSection = 'home' | 'collections' | 'shop' | 'testimonials' | 'about';

export default function App() {
  const [baseProducts, setBaseProducts] = useState<Product[]>(
    LOCAL_ARCHIVE_PRODUCTS
  );
  const [activeNav, setActiveNav] = useState<NavSection>('home');
  const [activeCategory, setActiveCategory] = useState<CategoryHandle>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<DrawerTab>('bag');
  const [openCartInCheckoutMode, setOpenCartInCheckoutMode] = useState(false);

  // Welcome Offer Email Popup State (5% off current order + 10% off next purchase)
  const [welcomeOffer, setWelcomeOffer] = useState<WelcomeOfferState | null>(
    () => {
      try {
        return parseWelcomeOfferStorage(
          localStorage.getItem(WELCOME_OFFER_STORAGE_KEY)
        );
      } catch {
        return null;
      }
    }
  );
  const [isWelcomePopupOpen, setIsWelcomePopupOpen] = useState<boolean>(() => {
    try {
      const existing = parseWelcomeOfferStorage(
        localStorage.getItem(WELCOME_OFFER_STORAGE_KEY)
      );
      return !existing;
    } catch {
      return true;
    }
  });

  // Persistent Custom Image URL Overrides synced with localStorage
  const [customImagesMap, setCustomImagesMap] = useState<
    Record<string, string>
  >(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_IMAGES_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Record<string, string>) : {};
    } catch {
      return {};
    }
  });

  // Persistent Wishlist State synced with localStorage
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      return parseWishlistStorage(localStorage.getItem(WISHLIST_STORAGE_KEY));
    } catch {
      return [];
    }
  });

  // Persistent Price Drop Subscriptions synced with localStorage
  const [priceDropAlerts, setPriceDropAlerts] = useState<
    Record<string, string>
  >(() => {
    try {
      const raw = localStorage.getItem(PRICE_DROP_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Record<string, string>) : {};
    } catch {
      return {};
    }
  });

  // Session Recently Viewed History synced with sessionStorage
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      return parseRecentlyViewedStorage(
        sessionStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY)
      );
    } catch {
      return [];
    }
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(
    null
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopifyModalOpen, setIsShopifyModalOpen] = useState(false);
  const [isCheckingShopify, setIsCheckingShopify] = useState(false);
  const [shopifyStatus, setShopifyStatus] = useState<ShopifyConnectionStatus>({
    connected: false,
    mode: 'local-archive',
    storeDomain: null,
    shopName: null,
    currencyCode: 'INR',
    productCount: LOCAL_ARCHIVE_PRODUCTS.length,
    storefrontConnected: false,
    adminSyncAvailable: false,
    message:
      'Running on the built-in 7-drop RWND20s Archive Catalog. Configure SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in AI Studio Secrets to connect your live Shopify store.',
  });

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const handleRefreshShopifyStatus = useCallback(async () => {
    setIsCheckingShopify(true);
    const [status, liveCatalog] = await Promise.all([
      fetchShopifyConnectionStatus(),
      fetchLiveOrFallbackCatalog(),
    ]);
    setShopifyStatus(status);
    if (liveCatalog.length > 0) {
      setBaseProducts(liveCatalog);
    }
    setIsCheckingShopify(false);
  }, []);

  // Auto-fetch live products & status from Shopify proxy on mount
  useEffect(() => {
    let active = true;
    Promise.all([
      fetchShopifyConnectionStatus(),
      fetchLiveOrFallbackCatalog(),
    ]).then(([status, liveCatalog]) => {
      if (!active) return;
      setShopifyStatus(status);
      if (liveCatalog.length > 0) {
        setBaseProducts(liveCatalog);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      if (welcomeOffer) {
        localStorage.setItem(
          WELCOME_OFFER_STORAGE_KEY,
          JSON.stringify(welcomeOffer)
        );
      }
    } catch {
      // Ignore storage quota errors
    }
  }, [welcomeOffer]);

  useEffect(() => {
    try {
      localStorage.setItem(
        CUSTOM_IMAGES_STORAGE_KEY,
        JSON.stringify(customImagesMap)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [customImagesMap]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch {
      // Ignore storage quota errors in restricted contexts
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem(
        PRICE_DROP_STORAGE_KEY,
        JSON.stringify(priceDropAlerts)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [priceDropAlerts]);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        RECENTLY_VIEWED_STORAGE_KEY,
        JSON.stringify(recentlyViewedIds)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [recentlyViewedIds]);

  const products = useMemo(
    () => applyCustomProductImages(baseProducts, customImagesMap),
    [baseProducts, customImagesMap]
  );

  const quickViewProduct = useMemo(
    () => products.find((p) => p.id === quickViewProductId) || null,
    [products, quickViewProductId]
  );

  const pushToast = useCallback(
    (
      title: string,
      subtitle: string,
      type: ToastMessage['type'] = 'success'
    ) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, title, subtitle, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const scrollToSection = useCallback((sectionId: NavSection) => {
    setActiveNav(sectionId);
    setIsMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleTriggerSearch = useCallback(() => {
    scrollToSection('shop');
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 200);
  }, [scrollToSection]);

  const handleOpenQuickView = useCallback((product: Product) => {
    setRecentlyViewedIds((prev) => recordRecentlyViewedId(prev, product.id));
    setQuickViewProductId(product.id);
  }, []);

  const handleClaimWelcomeOffer = useCallback(
    (email: string) => {
      const offer = createWelcomeOfferState(email);
      setWelcomeOffer(offer);
      pushToast(
        '5% + 10% ARCHIVE PASS UNLOCKED',
        `5% OFF applied (${offer.instantCode}) + 10% next order (${offer.nextOrderCode}) sent to ${offer.email}.`,
        'success'
      );
    },
    [pushToast]
  );

  // Global Keyboard Shortcuts: 'b' for bag, 'w' for wishlist, 's' for search, 'Escape' to close overlays
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase();
      const isEditableTarget = Boolean(
        target?.isContentEditable ||
          tagName === 'input' ||
          tagName === 'textarea' ||
          tagName === 'select'
      );

      const action = resolveKeyboardShortcut({
        key: e.key,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        altKey: e.altKey,
        isEditableTarget,
      });

      if (!action) return;

      if (action === 'escape') {
        if (isWelcomePopupOpen) {
          setIsWelcomePopupOpen(false);
        } else if (quickViewProductId) {
          setQuickViewProductId(null);
        } else if (isCartOpen) {
          setIsCartOpen(false);
        } else if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
        return;
      }

      e.preventDefault();
      if (action === 'bag') {
        setQuickViewProductId(null);
        setOpenCartInCheckoutMode(false);
        setDrawerTab('bag');
        setIsCartOpen(true);
      } else if (action === 'wishlist') {
        setQuickViewProductId(null);
        setOpenCartInCheckoutMode(false);
        setDrawerTab('wishlist');
        setIsCartOpen(true);
      } else if (action === 'search') {
        setQuickViewProductId(null);
        setIsCartOpen(false);
        handleTriggerSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isWelcomePopupOpen,
    quickViewProductId,
    isCartOpen,
    isMobileMenuOpen,
    handleTriggerSearch,
  ]);

  const heroProducts = useMemo(() => {
    const cyberSet =
      products.find((p) => p.sku === 'BUN-01') || products[0];
    const iem =
      products.find((p) => p.sku === 'EAR-01') || products[1];
    const watch =
      products.find((p) => p.sku === 'W-01') || products[2];
    return [cyberSet, iem, watch];
  }, [products]);

  const filteredProducts = useMemo(
    () =>
      filterAndSortProducts(products, {
        category: activeCategory,
        searchQuery,
        sortBy,
      }),
    [products, activeCategory, searchQuery, sortBy]
  );

  const wishlistProducts = useMemo(
    () => products.filter((p) => wishlistIds.includes(p.id)),
    [products, wishlistIds]
  );

  const modalRecentlyViewedProducts = useMemo(
    () =>
      getRecentlyViewedProducts(
        products,
        recentlyViewedIds,
        quickViewProduct?.id
      ),
    [products, recentlyViewedIds, quickViewProduct]
  );

  const cartSummary = useMemo(
    () => calculateCartTotals(cart, Boolean(welcomeOffer)),
    [cart, welcomeOffer]
  );

  const handleSelectCategoryAndScroll = (category: CategoryHandle) => {
    setActiveCategory(category);
    scrollToSection('shop');
  };

  const handleQuickAdd = (product: Product) => {
    const defaultVariant = product.variants[0];
    if (!defaultVariant) return;
    setCart((prev) => addToCartState(prev, product, defaultVariant, 1));
    setOpenCartInCheckoutMode(false);
    setDrawerTab('bag');
    setIsCartOpen(true);
  };

  const handleAddToCartFromModal = (
    product: Product,
    variant: ProductVariant,
    quantity: number
  ) => {
    setCart((prev) => addToCartState(prev, product, variant, quantity));
    setOpenCartInCheckoutMode(false);
    setDrawerTab('bag');
    setIsCartOpen(true);
  };

  const handleBuyNowFromModal = (
    product: Product,
    variant: ProductVariant,
    quantity: number
  ) => {
    setCart((prev) => addToCartState(prev, product, variant, quantity));
    setQuickViewProductId(null);
    setOpenCartInCheckoutMode(true);
    setDrawerTab('bag');
    setIsCartOpen(true);
  };

  const handleToggleWishlist = (product: Product) => {
    const { nextIds, added } = toggleWishlistId(wishlistIds, product.id);
    setWishlistIds(nextIds);
    if (added) {
      pushToast(
        'SAVED TO WISHLIST',
        `${product.title} saved to your local archive.`,
        'wishlist'
      );
    } else {
      pushToast(
        'REMOVED FROM WISHLIST',
        `${product.title} removed from saved items.`,
        'wishlist'
      );
    }
  };

  const handleRemoveFromWishlist = (product: Product) => {
    setWishlistIds((prev) => removeWishlistId(prev, product.id));
    pushToast(
      'REMOVED FROM WISHLIST',
      `${product.title} removed from saved items.`,
      'wishlist'
    );
  };

  const handleMoveWishlistToBag = (product: Product) => {
    const defaultVariant = product.variants[0];
    if (!defaultVariant) return;
    setCart((prev) => addToCartState(prev, product, defaultVariant, 1));
    setWishlistIds((prev) => removeWishlistId(prev, product.id));
    setDrawerTab('bag');
    pushToast(
      'MOVED TO HARDWARE BAG',
      `${product.title} (${defaultVariant.label}) added to bag.`,
      'success'
    );
  };

  const handleSubscribePriceDrop = (product: Product, email: string) => {
    setPriceDropAlerts((prev) => ({
      ...prev,
      [product.id]: email,
    }));
    pushToast(
      'PRICE DROP ALERT ACTIVE',
      `We'll notify ${email} when ${product.title} drops below ${formatINR(
        product.price
      )}.`,
      'price-drop'
    );
  };

  const handleUpdateCustomImage = (product: Product, url: string | null) => {
    setCustomImagesMap((prev) => {
      const next = { ...prev };
      if (!url) {
        delete next[product.id];
      } else {
        next[product.id] = url;
      }
      return next;
    });
    pushToast(
      url ? 'CUSTOM PHOTO APPLIED' : 'DEFAULT PHOTO RESTORED',
      url
        ? `Updated studio visual for ${product.title}.`
        : `Restored archive studio photography for ${product.title}.`,
      'success'
    );
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => updateCartItemQuantity(prev, cartItemId, delta));
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart((prev) => removeCartItem(prev, cartItemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const navItems: { id: NavSection; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'collections', label: 'Collections' },
    { id: 'shop', label: 'Shop' },
    { id: 'testimonials', label: 'Cardholders' },
    { id: 'about', label: 'About' },
  ];

  return (
    <div className="metallic-chrome-bg min-h-screen text-[#09090B]">
      {/* Subtle High-Frequency CRT Brightness Flicker Overlay */}
      <div
        aria-hidden="true"
        data-testid="crt-flicker-overlay"
        className="crt-flicker-overlay fixed inset-0 z-[55]"
      />

      {/* Full-Screen Initial Loading Animation */}
      <ArchiveLoader />

      {/* Welcome Offer Popup (5% OFF Current Order + 10% OFF Next Purchase) */}
      <WelcomeOfferPopup
        isOpen={isWelcomePopupOpen}
        welcomeOffer={welcomeOffer}
        onUnlockOffer={handleClaimWelcomeOffer}
        onClose={() => setIsWelcomePopupOpen(false)}
      />

      {/* Shopify Storefront & Admin Bridge Modal */}
      <ShopifyConnectModal
        isOpen={isShopifyModalOpen}
        status={shopifyStatus}
        isCheckingStatus={isCheckingShopify}
        onClose={() => setIsShopifyModalOpen(false)}
        onRefreshStatusAndCatalog={handleRefreshShopifyStatus}
        onNotify={(title, subtitle) => pushToast(title, subtitle, 'success')}
      />

      {/* 1. Clean Minimal Top Announcement Bar */}
      <div className="w-full border-b border-[#09090B]/15 bg-white/85 px-4 py-2 text-center backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-3">
          <p className="font-mono-tech text-[11px] font-bold tracking-widest text-[#09090B] uppercase">
            Free shipping on orders above ₹999 &nbsp;&nbsp;+&nbsp;&nbsp; Limited
            drops only
          </p>
          <button
            type="button"
            onClick={() => setIsWelcomePopupOpen(true)}
            className="inline-flex items-center gap-1 rounded-full border border-[#09090B]/30 bg-white px-2.5 py-0.5 font-mono-tech text-[10px] font-bold tracking-wider text-[#09090B] uppercase shadow-xs transition-colors hover:border-[#09090B] cursor-pointer"
          >
            <TicketPercent className="h-3 w-3" />
            <span>
              {welcomeOffer
                ? '5% + 10% PASS ACTIVE'
                : 'GET 5% NOW + 10% NEXT ORDER'}
            </span>
          </button>
          <button
            type="button"
            data-testid="open-shopify-modal-btn"
            onClick={() => setIsShopifyModalOpen(true)}
            className="inline-flex items-center gap-1 rounded-full border border-[#09090B] bg-[#09090B] px-2.5 py-0.5 font-mono-tech text-[10px] font-bold tracking-wider text-white uppercase shadow-xs transition-colors hover:bg-white hover:text-[#09090B] cursor-pointer"
          >
            <Store className="h-3 w-3" />
            <span>
              {shopifyStatus.connected
                ? `SHOPIFY LIVE · ${shopifyStatus.shopName || shopifyStatus.storeDomain}`
                : 'SHOPIFY SYNC'}
            </span>
          </button>
        </div>
      </div>

      {/* 1. Clean Minimal Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-[#09090B]/15 bg-[#DCDFE5]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Left: Official rwnd20s. Emblem & Liquid Chrome Wordmark */}
          <a
            href="#home"
            aria-label="rwnd20s. Home"
            onClick={(e) => {
              e.preventDefault();
              setActiveCategory('all');
              setSearchQuery('');
              scrollToSection('home');
            }}
            className="inline-flex items-center whitespace-nowrap shrink-0 transition-opacity hover:opacity-90"
          >
            <BrandLockup size="header" />
          </a>

          {/* Center: Hidden on mobile/tablet (hidden lg:flex) */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-8"
          >
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className={`relative py-1 text-sm font-bold transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-[#09090B]'
                      : 'text-[#3F3F46] hover:text-[#09090B]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="header-active-underline"
                      className="absolute right-0 -bottom-1 left-0 h-0.5 bg-[#09090B]"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right: ONLY 3 clean icons on mobile (Search, Bag with numeric badge, Hamburger Menu) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleTriggerSearch}
              aria-label="Search hardware archive"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white bg-white text-[#09090B] shadow-xs transition-colors hover:border-[#09090B] cursor-pointer"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Desktop-only Wishlist Pill (hidden on mobile to keep mobile header strictly 3 icons) */}
            <button
              type="button"
              onClick={() => {
                setOpenCartInCheckoutMode(false);
                setDrawerTab('wishlist');
                setIsCartOpen(true);
              }}
              aria-label={`Open wishlist (${wishlistIds.length} saved items)`}
              className="hidden lg:inline-flex items-center gap-2 rounded-full border border-white bg-white px-3.5 py-2 font-mono-tech text-xs font-bold text-[#09090B] shadow-xs transition-colors hover:border-[#09090B] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Heart
                className={`h-4 w-4 ${
                  wishlistIds.length > 0
                    ? 'fill-[#09090B] text-[#09090B]'
                    : 'text-[#09090B]'
                }`}
              />
              <span>WISHLIST</span>
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#09090B] px-1.5 font-mono-tech text-[11px] font-bold text-white">
                {wishlistIds.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOpenCartInCheckoutMode(false);
                setDrawerTab('bag');
                setIsCartOpen(true);
              }}
              aria-label={`Open shopping bag (${cartSummary.itemCount} items)`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white bg-white px-3 py-2 font-mono-tech text-xs font-bold text-[#09090B] shadow-xs transition-colors hover:border-[#09090B] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4 text-[#09090B]" />
              <span className="hidden sm:inline">BAG</span>
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#09090B] px-1.5 font-mono-tech text-[11px] font-bold text-white">
                {cartSummary.itemCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle mobile navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white bg-white text-[#09090B] shadow-xs lg:hidden cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Metallic Chrome Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="metallic-chrome-bg fixed inset-0 z-50 flex flex-col justify-between bg-[#DCDFE5] p-6 text-[#09090B] lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-[#09090B]/15 pb-4">
              <BrandLockup size="drawer" />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close mobile navigation menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white bg-white text-[#09090B] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="my-auto flex flex-col space-y-4">
              {navItems.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="group flex items-center justify-between border-b border-[#09090B]/15 py-4 text-left cursor-pointer"
                >
                  <div>
                    <span className="block font-mono-tech text-xs font-bold text-[#52525B]">
                      0{idx + 1} // SECTION
                    </span>
                    <span className="font-display text-3xl font-extrabold tracking-tight text-[#09090B] uppercase">
                      {item.label}
                    </span>
                  </div>
                  <ArrowUpRight className="h-6 w-6 text-[#52525B] group-hover:text-[#09090B]" />
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setDrawerTab('wishlist');
                  setIsCartOpen(true);
                }}
                className="flex items-center justify-between rounded-2xl border border-white bg-white px-5 py-4 text-left shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-[#09090B]" />
                  <span className="font-display text-lg font-bold text-[#09090B] uppercase">
                    SAVED WISHLIST
                  </span>
                </div>
                <span className="rounded-full bg-[#09090B] px-2.5 py-0.5 font-mono-tech text-xs font-bold text-white">
                  {wishlistIds.length}
                </span>
              </button>
            </nav>

            <div className="border-t border-[#09090B]/15 pt-4 font-mono-tech text-xs font-bold text-[#3F3F46]">
              FREE EXPRESS SHIPPING ABOVE ₹999 · 316L ARCHIVE HARDWARE
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main>
        {/* 2. D1 Milano-Style Split Stack Hero */}
        <HeroSection
          heroProducts={heroProducts}
          onExploreCollection={() => scrollToSection('shop')}
          onOpenQuickView={handleOpenQuickView}
          onQuickAdd={handleQuickAdd}
        />

        {/* 3. Featured Collections: 1-Column Wide Banners on Mobile -> 2+3 Bento on Desktop */}
        <BentoCollections
          products={products}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategoryAndScroll}
        />

        {/* 4. Drop 01 Archive: 1-Column Editorial Feed on Mobile */}
        <ProductArchiveSection
          allProductsCount={products.length}
          filteredProducts={filteredProducts}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          sortBy={sortBy}
          wishlistIds={wishlistIds}
          onSelectCategory={(cat) => setActiveCategory(cat)}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          onQuickAdd={handleQuickAdd}
          onOpenQuickView={handleOpenQuickView}
          onToggleWishlist={handleToggleWishlist}
          searchInputRef={searchInputRef}
        />

        {/* 5. Testimonials Page / Section with Collector Cardholders */}
        <TestimonialsSection />

        {/* 6. Key Info Bar, Manifesto & Retro Status Footer */}
        <TrustAndAboutSection
          onSelectCategory={handleSelectCategoryAndScroll}
        />
      </main>

      {/* 7. Product Quick-View & Spec Modal with Custom Image URL Swapper */}
      <ProductQuickViewModal
        product={quickViewProduct}
        isWishlisted={
          quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false
        }
        subscribedEmail={
          quickViewProduct ? priceDropAlerts[quickViewProduct.id] : undefined
        }
        customImageUrl={
          quickViewProduct ? customImagesMap[quickViewProduct.id] : undefined
        }
        recentlyViewedProducts={modalRecentlyViewedProducts}
        onClose={() => setQuickViewProductId(null)}
        onSelectProduct={handleOpenQuickView}
        onAddToCart={handleAddToCartFromModal}
        onBuyNow={handleBuyNowFromModal}
        onToggleWishlist={handleToggleWishlist}
        onSubscribePriceDrop={handleSubscribePriceDrop}
        onUpdateCustomImage={handleUpdateCustomImage}
      />

      {/* Slide-Out Cart & Wishlist Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        activeTab={drawerTab}
        onTabChange={setDrawerTab}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        wishlistProducts={wishlistProducts}
        welcomeOffer={welcomeOffer}
        onOpenWelcomePopup={() => {
          setIsCartOpen(false);
          setIsWelcomePopupOpen(true);
        }}
        onOpenShopifyModal={() => {
          setIsCartOpen(false);
          setIsShopifyModalOpen(true);
        }}
        shopifyConnected={shopifyStatus.connected}
        shopifyStoreDomain={shopifyStatus.storeDomain}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onMoveWishlistToBag={handleMoveWishlistToBag}
        onOpenQuickView={handleOpenQuickView}
        initialShowCheckoutForm={openCartInCheckoutMode}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
