export type CategoryHandle =
  | 'all'
  | 'everyday-drop'
  | 'premium-drop'
  | 'cyber-bundle'
  | 'watches'
  | 'chrome-earphones'
  | 'y2k-rings'
  | 'chains'
  | 'bracelets'
  | 'earrings';

export type SortOption = 'featured' | 'price-asc' | 'price-desc';

export interface ProductVariant {
  id: string;
  label: string;
  priceDelta?: number;
  inStock: boolean;
}

export interface ProductSpecItem {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string;
  handle?: string;
  title: string;
  subtitle: string;
  category: Exclude<CategoryHandle, 'all' | 'everyday-drop' | 'premium-drop'>;
  categoryLabel: string;
  dropCollection?: 'everyday-drop' | 'premium-drop';
  phase?: 1 | 2;
  phaseStatus?: string;
  stockCount?: number;
  price: number;
  compareAtPrice: number;
  codPrice?: number;
  codAdvanceRequired?: number;
  specBadge: string;
  description: string;
  shortBullets?: string[];
  whatsInside?: string[];
  careNote?: string;
  compatibilityWarning?: string;
  codPolicyNote?: string;
  tags?: string[];
  productType?: 'Jewellery' | 'Audio' | 'Watch';
  vendor?: string;
  seoTitle?: string;
  seoDescription?: string;
  imageAlt?: string;
  netQuantity?: string;
  countryOfOrigin?: string;
  specs: ProductSpecItem[];
  optionName: string;
  variants: ProductVariant[];
  images: string[];
  featuredRank: number;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
  unitPrice: number;
}

export interface FilterState {
  category: CategoryHandle;
  searchQuery: string;
  sortBy: SortOption;
}

export const FREE_SHIPPING_THRESHOLD = 999;
export const STANDARD_SHIPPING_FEE = 99;

export function formatINR(amount: number): string {
  const rounded = Math.max(0, Math.round(amount));
  return `₹${rounded.toLocaleString('en-IN')}`;
}

export function filterAndSortProducts(
  products: Product[],
  filter: FilterState
): Product[] {
  const normalizedQuery = filter.searchQuery.trim().toLowerCase();

  const filtered = products.filter((item) => {
    let matchesCategory = false;
    if (filter.category === 'all') {
      matchesCategory = true;
    } else if (
      filter.category === 'everyday-drop' ||
      filter.category === 'premium-drop'
    ) {
      matchesCategory =
        item.dropCollection === filter.category ||
        Boolean(item.tags?.includes(filter.category));
    } else {
      matchesCategory = item.category === filter.category;
    }

    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;

    const searchableText = [
      item.title,
      item.subtitle,
      item.categoryLabel,
      item.specBadge,
      item.sku,
      item.handle || '',
      item.description,
      ...(item.tags || []),
      ...(item.shortBullets || []),
      ...(item.whatsInside || []),
      ...item.specs.map((s) => `${s.label} ${s.value}`),
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });

  return [...filtered].sort((a, b) => {
    if (filter.sortBy === 'price-asc') {
      return a.price - b.price;
    }
    if (filter.sortBy === 'price-desc') {
      return b.price - a.price;
    }
    return a.featuredRank - b.featuredRank;
  });
}

export function addToCartState(
  cart: CartItem[],
  product: Product,
  variant: ProductVariant,
  quantity = 1
): CartItem[] {
  const safeQty = Math.max(1, Math.floor(quantity));
  const cartItemId = `${product.id}::${variant.id}`;
  const unitPrice = product.price + (variant.priceDelta ?? 0);

  const existingIndex = cart.findIndex((item) => item.cartItemId === cartItemId);
  if (existingIndex > -1) {
    return cart.map((item, idx) =>
      idx === existingIndex
        ? { ...item, quantity: item.quantity + safeQty }
        : item
    );
  }

  return [
    ...cart,
    {
      cartItemId,
      product,
      selectedVariant: variant,
      quantity: safeQty,
      unitPrice,
    },
  ];
}

export function updateCartItemQuantity(
  cart: CartItem[],
  cartItemId: string,
  delta: number
): CartItem[] {
  return cart
    .map((item) => {
      if (item.cartItemId !== cartItemId) return item;
      const nextQty = item.quantity + delta;
      return { ...item, quantity: nextQty };
    })
    .filter((item) => item.quantity > 0);
}

export function removeCartItem(
  cart: CartItem[],
  cartItemId: string
): CartItem[] {
  return cart.filter((item) => item.cartItemId !== cartItemId);
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  welcomeDiscountPercent: number;
  welcomeDiscountAmount: number;
  discountedSubtotal: number;
  freeShippingThreshold: number;
  amountRemainingForFreeShipping: number;
  hasUnlockedFreeShipping: boolean;
  shippingProgressPercent: number;
  shippingFee: number;
  grandTotal: number;
}

export const WELCOME_OFFER_STORAGE_KEY = 'rwnd20s_welcome_offer_v1';
export const WELCOME_INSTANT_DISCOUNT_PERCENT = 5;
export const WELCOME_NEXT_PURCHASE_DISCOUNT_PERCENT = 10;
export const WELCOME_INSTANT_CODE = 'RWND5NOW';
export const WELCOME_NEXT_CODE = 'RWND10NEXT';

export interface WelcomeOfferState {
  email: string;
  unlockedAt: string;
  instantDiscountPercent: number;
  nextPurchaseDiscountPercent: number;
  instantCode: string;
  nextPurchaseCode: string;
}

export function createWelcomeOfferState(email: string): WelcomeOfferState {
  return {
    email: email.trim().toLowerCase(),
    unlockedAt: new Date().toISOString(),
    instantDiscountPercent: WELCOME_INSTANT_DISCOUNT_PERCENT,
    nextPurchaseDiscountPercent: WELCOME_NEXT_PURCHASE_DISCOUNT_PERCENT,
    instantCode: WELCOME_INSTANT_CODE,
    nextPurchaseCode: WELCOME_NEXT_CODE,
  };
}

export function parseWelcomeOfferStorage(
  raw: string | null
): WelcomeOfferState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.email === 'string' &&
      parsed.email.includes('@')
    ) {
      return {
        email: parsed.email,
        unlockedAt:
          typeof parsed.unlockedAt === 'string'
            ? parsed.unlockedAt
            : new Date().toISOString(),
        instantDiscountPercent: WELCOME_INSTANT_DISCOUNT_PERCENT,
        nextPurchaseDiscountPercent: WELCOME_NEXT_PURCHASE_DISCOUNT_PERCENT,
        instantCode: WELCOME_INSTANT_CODE,
        nextPurchaseCode: WELCOME_NEXT_CODE,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function calculateCartTotals(
  cart: CartItem[],
  applyWelcomeDiscount = false
): CartSummary {
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );

  const welcomeDiscountPercent =
    applyWelcomeDiscount && subtotal > 0 ? WELCOME_INSTANT_DISCOUNT_PERCENT : 0;
  const welcomeDiscountAmount =
    welcomeDiscountPercent > 0
      ? Math.round((subtotal * welcomeDiscountPercent) / 100)
      : 0;
  const discountedSubtotal = Math.max(0, subtotal - welcomeDiscountAmount);

  const amountRemainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal
  );
  const hasUnlockedFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingProgressPercent =
    subtotal <= 0
      ? 0
      : Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const shippingFee =
    subtotal === 0 || hasUnlockedFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const grandTotal = discountedSubtotal + shippingFee;

  return {
    itemCount,
    subtotal,
    welcomeDiscountPercent,
    welcomeDiscountAmount,
    discountedSubtotal,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    amountRemainingForFreeShipping,
    hasUnlockedFreeShipping,
    shippingProgressPercent,
    shippingFee,
    grandTotal,
  };
}

export interface CodCheckoutBreakdown {
  paymentMode: 'prepaid' | 'cod';
  hasPhase2Watch: boolean;
  codSurcharge: number;
  upiAdvanceRequired: number;
  payableOnDelivery: number;
  finalOrderTotal: number;
}

export function calculateCodCheckoutBreakdown(
  cart: CartItem[],
  paymentMode: 'prepaid' | 'cod',
  applyWelcomeDiscount = false
): CodCheckoutBreakdown {
  const baseTotals = calculateCartTotals(cart, applyWelcomeDiscount);
  let hasPhase2Watch = false;
  let codSurcharge = 0;
  let upiAdvanceRequired = 0;

  for (const item of cart) {
    if (item.product.phase === 2 || item.product.sku === 'W-01') {
      hasPhase2Watch = true;
      if (paymentMode === 'cod') {
        const diff =
          item.product.codPrice && item.product.codPrice > item.product.price
            ? item.product.codPrice - item.product.price
            : 200;
        // Avoid double-counting if user already picked the COD variant delta
        const alreadyInVariant = (item.selectedVariant.priceDelta ?? 0) >= diff;
        if (!alreadyInVariant) {
          codSurcharge += diff * item.quantity;
        }
        upiAdvanceRequired +=
          (item.product.codAdvanceRequired ?? 150) * item.quantity;
      }
    }
  }

  const finalOrderTotal = baseTotals.grandTotal + codSurcharge;
  const payableOnDelivery =
    paymentMode === 'cod'
      ? Math.max(0, finalOrderTotal - upiAdvanceRequired)
      : 0;

  return {
    paymentMode,
    hasPhase2Watch,
    codSurcharge,
    upiAdvanceRequired,
    payableOnDelivery,
    finalOrderTotal,
  };
}

export const WISHLIST_STORAGE_KEY = 'rwnd20s_wishlist_v1';
export const PRICE_DROP_STORAGE_KEY = 'rwnd20s_price_alerts_v1';

export function parseWishlistStorage(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((id): id is string => typeof id === 'string');
    }
    return [];
  } catch {
    return [];
  }
}

export function toggleWishlistId(
  wishlistIds: string[],
  productId: string
): { nextIds: string[]; added: boolean } {
  const exists = wishlistIds.includes(productId);
  if (exists) {
    return {
      nextIds: wishlistIds.filter((id) => id !== productId),
      added: false,
    };
  }
  return {
    nextIds: [...wishlistIds, productId],
    added: true,
  };
}

export function removeWishlistId(
  wishlistIds: string[],
  productId: string
): string[] {
  return wishlistIds.filter((id) => id !== productId);
}

export function validatePriceDropEmail(email: string): {
  valid: boolean;
  normalizedEmail: string;
  error?: string;
} {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) {
    return {
      valid: false,
      normalizedEmail: '',
      error: 'Please enter an email address for price drop alerts.',
    };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return {
      valid: false,
      normalizedEmail: trimmed,
      error: 'Please enter a valid email address (e.g. name@domain.com).',
    };
  }
  return {
    valid: true,
    normalizedEmail: trimmed,
  };
}

export const RECENTLY_VIEWED_STORAGE_KEY = 'rwnd20s_recently_viewed_v1';
export const MAX_RECENTLY_VIEWED = 6;

export function parseRecentlyViewedStorage(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((id): id is string => typeof id === 'string');
    }
    return [];
  } catch {
    return [];
  }
}

export function recordRecentlyViewedId(
  currentIds: string[],
  productId: string,
  maxItems = MAX_RECENTLY_VIEWED
): string[] {
  if (!productId) return currentIds;
  const deduped = currentIds.filter((id) => id !== productId);
  return [productId, ...deduped].slice(0, maxItems);
}

export function getRecentlyViewedProducts(
  products: Product[],
  recentlyViewedIds: string[],
  excludeProductId?: string
): Product[] {
  const productMap = new Map(products.map((p) => [p.id, p]));
  const result: Product[] = [];

  for (const id of recentlyViewedIds) {
    if (excludeProductId && id === excludeProductId) continue;
    const found = productMap.get(id);
    if (found) {
      result.push(found);
    }
  }

  return result;
}

export type ShortcutAction = 'bag' | 'wishlist' | 'search' | 'escape' | null;

export function resolveKeyboardShortcut(input: {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  isEditableTarget?: boolean;
}): ShortcutAction {
  if (input.ctrlKey || input.metaKey || input.altKey) {
    return null;
  }

  if (input.key === 'Escape') {
    return 'escape';
  }

  if (input.isEditableTarget) {
    return null;
  }

  const normalized = input.key.toLowerCase();
  if (normalized === 'b') return 'bag';
  if (normalized === 'w') return 'wishlist';
  if (normalized === 's') return 'search';

  return null;
}

export const CUSTOM_IMAGES_STORAGE_KEY = 'rwnd20s_custom_images_v1';

export function validateCustomImageUrl(url: string): {
  valid: boolean;
  trimmedUrl: string;
  error?: string;
} {
  const trimmed = url.trim();
  if (!trimmed) {
    return {
      valid: false,
      trimmedUrl: '',
      error: 'Please paste a valid image URL (https://... or data:image/...).',
    };
  }
  const isHttp =
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('/');

  if (!isHttp) {
    return {
      valid: false,
      trimmedUrl: trimmed,
      error: 'URL must start with https://, http://, or data:image/.',
    };
  }

  return {
    valid: true,
    trimmedUrl: trimmed,
  };
}

export function applyCustomProductImages(
  products: Product[],
  customImagesMap: Record<string, string>
): Product[] {
  return products.map((product) => {
    const customUrl = customImagesMap[product.id];
    if (!customUrl) return product;
    return {
      ...product,
      images: [customUrl, ...product.images.slice(1)],
    };
  });
}

export interface DropCountdownParts {
  hours: string;
  minutes: string;
  seconds: string;
  formatted: string;
}

export function formatDropCountdown(remainingMs: number): DropCountdownParts {
  const clampedSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const hrs = Math.floor(clampedSeconds / 3600);
  const mins = Math.floor((clampedSeconds % 3600) / 60);
  const secs = clampedSeconds % 60;

  const hours = String(hrs).padStart(2, '0');
  const minutes = String(mins).padStart(2, '0');
  const seconds = String(secs).padStart(2, '0');

  return {
    hours,
    minutes,
    seconds,
    formatted: `${hours}:${minutes}:${seconds}`,
  };
}

export function formatSystemUptime(elapsedSeconds: number): string {
  const safe = Math.max(0, Math.floor(elapsedSeconds));
  const days = Math.floor(safe / 86400);
  const hours = String(Math.floor((safe % 86400) / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((safe % 3600) / 60)).padStart(2, '0');
  const seconds = String(safe % 60).padStart(2, '0');
  return `${days}D ${hours}H ${minutes}M ${seconds}S`;
}

