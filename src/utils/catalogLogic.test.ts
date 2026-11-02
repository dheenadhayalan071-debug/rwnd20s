import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatINR,
  filterAndSortProducts,
  addToCartState,
  updateCartItemQuantity,
  calculateCartTotals,
  toggleWishlistId,
  removeWishlistId,
  parseWishlistStorage,
  validatePriceDropEmail,
  parseRecentlyViewedStorage,
  recordRecentlyViewedId,
  getRecentlyViewedProducts,
  resolveKeyboardShortcut,
  validateCustomImageUrl,
  applyCustomProductImages,
  type Product,
} from './catalogLogic';

const mockProducts: Product[] = [
  {
    id: 'p1',
    sku: 'RW-WT-01',
    title: 'CHRONO-01 OBSIDIAN DIAL',
    subtitle: 'Brushed 316L Chronograph',
    category: 'watches',
    categoryLabel: 'WATCHES',
    price: 3499,
    compareAtPrice: 4999,
    specBadge: '316L STEEL',
    description: 'Japanese quartz chronograph movement.',
    specs: [{ label: 'Case', value: '40mm 316L Stainless Steel' }],
    optionName: 'Strap Finish',
    variants: [{ id: 'v1', label: 'Brushed Steel', inStock: true }],
    images: ['data:image/svg+xml;utf8,<svg></svg>'],
    featuredRank: 1,
  },
  {
    id: 'p2',
    sku: 'RW-RG-01',
    title: 'NOVA STAR SIGNET RING',
    subtitle: 'Heavy Cast Y2K Signet',
    category: 'y2k-rings',
    categoryLabel: 'Y2K RINGS',
    price: 699,
    compareAtPrice: 1199,
    specBadge: 'LIMITED DROP',
    description: 'Deep-cast gothic star signet ring.',
    specs: [{ label: 'Material', value: '316L Surgical Steel' }],
    optionName: 'Ring Size',
    variants: [
      { id: 'r8', label: 'US 8', inStock: true },
      { id: 'r9', label: 'US 9', inStock: true },
    ],
    images: ['data:image/svg+xml;utf8,<svg></svg>'],
    featuredRank: 2,
  },
  {
    id: 'p3',
    sku: 'RW-IEM-01',
    title: 'AERO-X1 LIQUID CHROME IEM',
    subtitle: '10mm Beryllium Dynamic Monitor',
    category: 'chrome-earphones',
    categoryLabel: 'CHROME EARPHONES',
    price: 1899,
    compareAtPrice: 2799,
    specBadge: 'DUAL-DRIVER IEM',
    description: 'CNC zinc-alloy acoustic shell with detachable 2-pin cable.',
    specs: [{ label: 'Driver', value: '10mm Beryllium Dynamic' }],
    optionName: 'Connector Termination',
    variants: [
      { id: 'c-35', label: '3.5mm Gold Jack', priceDelta: 0, inStock: true },
      { id: 'c-dac', label: 'Type-C Hi-Res DAC', priceDelta: 300, inStock: true },
    ],
    images: ['data:image/svg+xml;utf8,<svg></svg>'],
    featuredRank: 3,
  },
];

test('formatINR formats Indian Rupees accurately', () => {
  assert.equal(formatINR(699), '₹699');
  assert.equal(formatINR(3499), '₹3,499');
});

test('filterAndSortProducts filters by category, search query, and sorts by price', () => {
  const byCategory = filterAndSortProducts(mockProducts, {
    category: 'chrome-earphones',
    searchQuery: '',
    sortBy: 'featured',
  });
  assert.equal(byCategory.length, 1);
  assert.equal(byCategory[0].id, 'p3');

  const byQuery = filterAndSortProducts(mockProducts, {
    category: 'all',
    searchQuery: 'beryllium',
    sortBy: 'featured',
  });
  assert.equal(byQuery.length, 1);
  assert.equal(byQuery[0].id, 'p3');

  const priceAsc = filterAndSortProducts(mockProducts, {
    category: 'all',
    searchQuery: '',
    sortBy: 'price-asc',
  });
  assert.deepEqual(
    priceAsc.map((p) => p.id),
    ['p2', 'p3', 'p1']
  );

  const priceDesc = filterAndSortProducts(mockProducts, {
    category: 'all',
    searchQuery: '',
    sortBy: 'price-desc',
  });
  assert.deepEqual(
    priceDesc.map((p) => p.id),
    ['p1', 'p3', 'p2']
  );
});

test('calculateCartTotals computes ₹999 free shipping progress and unlocks threshold', () => {
  // Add a ₹699 ring (below ₹999 threshold)
  let cart = addToCartState([], mockProducts[1], mockProducts[1].variants[0], 1);
  let totals = calculateCartTotals(cart);

  assert.equal(totals.itemCount, 1);
  assert.equal(totals.subtotal, 699);
  assert.equal(totals.hasUnlockedFreeShipping, false);
  assert.equal(totals.amountRemainingForFreeShipping, 300);
  assert.equal(totals.shippingFee, 99);
  assert.equal(totals.grandTotal, 798);

  // Increment ring quantity to 2 (₹1,398 >= ₹999)
  cart = updateCartItemQuantity(cart, cart[0].cartItemId, 1);
  totals = calculateCartTotals(cart);

  assert.equal(totals.itemCount, 2);
  assert.equal(totals.subtotal, 1398);
  assert.equal(totals.hasUnlockedFreeShipping, true);
  assert.equal(totals.amountRemainingForFreeShipping, 0);
  assert.equal(totals.shippingProgressPercent, 100);
  assert.equal(totals.shippingFee, 0);
  assert.equal(totals.grandTotal, 1398);
});

test('wishlist toggle, remove, and storage parsing work deterministically', () => {
  const initial = parseWishlistStorage('["p1"]');
  assert.deepEqual(initial, ['p1']);
  assert.deepEqual(parseWishlistStorage('invalid-json'), []);

  const addRes = toggleWishlistId(initial, 'p2');
  assert.equal(addRes.added, true);
  assert.deepEqual(addRes.nextIds, ['p1', 'p2']);

  const removeToggleRes = toggleWishlistId(addRes.nextIds, 'p1');
  assert.equal(removeToggleRes.added, false);
  assert.deepEqual(removeToggleRes.nextIds, ['p2']);

  assert.deepEqual(removeWishlistId(['p1', 'p2'], 'p2'), ['p1']);
});

test('validatePriceDropEmail validates email format and rejects empty or invalid strings', () => {
  assert.equal(validatePriceDropEmail('').valid, false);
  assert.equal(validatePriceDropEmail('not-an-email').valid, false);
  const ok = validatePriceDropEmail('  DropHunter@RWND20S.com ');
  assert.equal(ok.valid, true);
  assert.equal(ok.normalizedEmail, 'drophunter@rwnd20s.com');
});

test('recently viewed tracking deduplicates, preserves recency order, and excludes current product', () => {
  assert.deepEqual(parseRecentlyViewedStorage('["p1","p2"]'), ['p1', 'p2']);
  assert.deepEqual(parseRecentlyViewedStorage('bad'), []);

  let history = recordRecentlyViewedId([], 'p1');
  history = recordRecentlyViewedId(history, 'p2');
  history = recordRecentlyViewedId(history, 'p3');
  history = recordRecentlyViewedId(history, 'p1'); // p1 moved to front
  assert.deepEqual(history, ['p1', 'p3', 'p2']);

  const itemsForModalP1 = getRecentlyViewedProducts(mockProducts, history, 'p1');
  assert.deepEqual(
    itemsForModalP1.map((item) => item.id),
    ['p3', 'p2']
  );
});

test('resolveKeyboardShortcut maps b, w, s, and Escape while ignoring editable targets and modifiers', () => {
  assert.equal(resolveKeyboardShortcut({ key: 'b' }), 'bag');
  assert.equal(resolveKeyboardShortcut({ key: 'W' }), 'wishlist');
  assert.equal(resolveKeyboardShortcut({ key: 's' }), 'search');
  assert.equal(resolveKeyboardShortcut({ key: 'Escape', isEditableTarget: true }), 'escape');
  assert.equal(resolveKeyboardShortcut({ key: 'b', isEditableTarget: true }), null);
  assert.equal(resolveKeyboardShortcut({ key: 's', ctrlKey: true }), null);
  assert.equal(resolveKeyboardShortcut({ key: 'x' }), null);
});

test('validateCustomImageUrl and applyCustomProductImages override primary product photography', () => {
  assert.equal(validateCustomImageUrl('').valid, false);
  assert.equal(validateCustomImageUrl('ftp://invalid').valid, false);
  const okUrl = validateCustomImageUrl(' https://cdn.shopify.com/s/files/watch-upscaled.jpg ');
  assert.equal(okUrl.valid, true);
  assert.equal(okUrl.trimmedUrl, 'https://cdn.shopify.com/s/files/watch-upscaled.jpg');

  const updated = applyCustomProductImages(mockProducts, {
    p1: okUrl.trimmedUrl,
  });
  assert.equal(updated[0].images[0], 'https://cdn.shopify.com/s/files/watch-upscaled.jpg');
  assert.equal(updated[1].images[0], mockProducts[1].images[0]);
});

test('calculateCodCheckoutBreakdown enforces ₹0 advance on accessories and ₹150 UPI advance on Phase 2 Watch', async () => {
  const { calculateCodCheckoutBreakdown } = await import('./catalogLogic');

  const ringCart = addToCartState([], mockProducts[1], mockProducts[1].variants[0], 1);
  const ringCod = calculateCodCheckoutBreakdown(ringCart, 'cod');
  assert.equal(ringCod.hasPhase2Watch, false);
  assert.equal(ringCod.upiAdvanceRequired, 0);
  assert.equal(ringCod.codSurcharge, 0);

  const phase2Watch: Product = {
    ...mockProducts[0],
    sku: 'W-01',
    phase: 2,
    price: 1999,
    codPrice: 2199,
    codAdvanceRequired: 150,
  };
  const watchCart = addToCartState([], phase2Watch, phase2Watch.variants[0], 1);
  const watchPrepaid = calculateCodCheckoutBreakdown(watchCart, 'prepaid');
  assert.equal(watchPrepaid.finalOrderTotal, 1999);
  assert.equal(watchPrepaid.upiAdvanceRequired, 0);

  const watchCod = calculateCodCheckoutBreakdown(watchCart, 'cod');
  assert.equal(watchCod.hasPhase2Watch, true);
  assert.equal(watchCod.codSurcharge, 200);
  assert.equal(watchCod.upiAdvanceRequired, 150);
  assert.equal(watchCod.finalOrderTotal, 2199);
  assert.equal(watchCod.payableOnDelivery, 2049);
});

test('formatDropCountdown and formatSystemUptime format terminal clock and DOS uptime accurately', async () => {
  const { formatDropCountdown, formatSystemUptime } = await import('./catalogLogic');

  const countdown = formatDropCountdown((14 * 3600 + 8 * 60 + 5) * 1000);
  assert.equal(countdown.hours, '14');
  assert.equal(countdown.minutes, '08');
  assert.equal(countdown.seconds, '05');
  assert.equal(countdown.formatted, '14:08:05');

  const zeroCountdown = formatDropCountdown(-500);
  assert.equal(zeroCountdown.formatted, '00:00:00');

  assert.equal(formatSystemUptime(90061), '1D 01H 01M 01S');
});

test('welcome offer grants 5% instant discount on cart and 10% next purchase voucher', async () => {
  const {
    createWelcomeOfferState,
    parseWelcomeOfferStorage,
  } = await import('./catalogLogic');

  const offer = createWelcomeOfferState('  Collector@RWND20s.com ');
  assert.equal(offer.email, 'collector@rwnd20s.com');
  assert.equal(offer.instantDiscountPercent, 5);
  assert.equal(offer.nextPurchaseDiscountPercent, 10);
  assert.equal(offer.instantCode, 'RWND5NOW');
  assert.equal(offer.nextPurchaseCode, 'RWND10NEXT');

  const parsed = parseWelcomeOfferStorage(JSON.stringify(offer));
  assert.equal(parsed?.email, 'collector@rwnd20s.com');
  assert.equal(parseWelcomeOfferStorage('bad-json'), null);

  // ₹1,899 item with 5% welcome discount -> ₹95 off -> ₹1,804 grand total (free shipping unlocked)
  const cart = addToCartState([], mockProducts[2], mockProducts[2].variants[0], 1);
  const totalsWithOffer = calculateCartTotals(cart, true);
  assert.equal(totalsWithOffer.subtotal, 1899);
  assert.equal(totalsWithOffer.welcomeDiscountPercent, 5);
  assert.equal(totalsWithOffer.welcomeDiscountAmount, 95);
  assert.equal(totalsWithOffer.discountedSubtotal, 1804);
  assert.equal(totalsWithOffer.grandTotal, 1804);
});

test('LOCAL_ARCHIVE_PRODUCTS has doubled stash prices (compareAtPrice) while preserving actual MRP (price)', async () => {
  const { LOCAL_ARCHIVE_PRODUCTS } = await import('../services/shopify');

  const expectedPrices: Record<string, { price: number; compareAtPrice: number }> = {
    'rwnd-bun-01': { price: 1199, compareAtPrice: 2894 },
    'rwnd-ring-01': { price: 349, compareAtPrice: 998 },
    'rwnd-chain-01': { price: 549, compareAtPrice: 1598 },
    'rwnd-bracelet-01': { price: 549, compareAtPrice: 1598 },
    'rwnd-iem-01': { price: 999, compareAtPrice: 2998 },
    'rwnd-earrings-01': { price: 299, compareAtPrice: 898 },
    'rwnd-watch-01': { price: 1999, compareAtPrice: 4998 },
  };

  for (const product of LOCAL_ARCHIVE_PRODUCTS) {
    const exp = expectedPrices[product.id];
    assert.ok(exp, `Expected product ${product.id} in catalog`);
    assert.equal(product.price, exp.price, `${product.id} MRP should remain ${exp.price}`);
    assert.equal(
      product.compareAtPrice,
      exp.compareAtPrice,
      `${product.id} stash price should be doubled to ${exp.compareAtPrice}`
    );
  }
});

test('Shopify integration helpers normalize domains, generate official Products CSV with doubled stash prices, and build cart permalinks', async () => {
  const { LOCAL_ARCHIVE_PRODUCTS } = await import('../services/shopify');
  const {
    normalizeShopifyDomain,
    generateShopifyProductsCsv,
    buildShopifyCartPermalink,
  } = await import('./shopifyCatalogCsv');

  assert.equal(
    normalizeShopifyDomain(' https://RWND20S.myshopify.com/products '),
    'rwnd20s.myshopify.com'
  );
  assert.equal(normalizeShopifyDomain('MY_SHOPIFY_STORE_DOMAIN'), '');

  const csv = generateShopifyProductsCsv(LOCAL_ARCHIVE_PRODUCTS);
  assert.ok(csv.includes('Variant Price,Variant Compare At Price'));
  assert.ok(csv.includes('y2k-cyber-set'));
  assert.ok(csv.includes('1199.00,2894.00'));
  assert.ok(csv.includes('349.00,998.00'));
  assert.ok(csv.includes('1999.00,4998.00'));

  const permalink = buildShopifyCartPermalink(
    'rwnd20s.myshopify.com',
    [
      { variantId: 'gid://shopify/ProductVariant/4411223344', quantity: 1 },
      { variantId: '9988776655', quantity: 2 },
    ],
    'RWND5NOW'
  );
  assert.equal(
    permalink,
    'https://rwnd20s.myshopify.com/cart/4411223344:1,9988776655:2?discount=RWND5NOW'
  );
});
