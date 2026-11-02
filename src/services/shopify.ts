import {
  type CategoryHandle,
  type Product,
  type CartItem,
} from '../utils/catalogLogic';
import { buildHardwareStudioSet } from '../utils/studioSvgAssets';

const SHOPIFY_STORE_DOMAIN =
  (import.meta.env?.VITE_SHOPIFY_STORE_DOMAIN as string | undefined)
    ?.trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '') || '';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  (
    (import.meta.env?.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
      import.meta.env?.VITE_SHOPIFY_STOREFRONT_TOKEN) as string | undefined
  )?.trim() || '';

export const isShopifyConfigured = Boolean(
  SHOPIFY_STORE_DOMAIN &&
    SHOPIFY_STOREFRONT_ACCESS_TOKEN &&
    SHOPIFY_STORE_DOMAIN !== 'MY_SHOPIFY_STORE_DOMAIN'
);

/**
 * Official RWND20s Product Catalog (7 Curated Drops)
 */
export const LOCAL_ARCHIVE_PRODUCTS: Product[] = [
  {
    id: 'rwnd-bun-01',
    sku: 'BUN-01',
    handle: '/products/y2k-cyber-set',
    title: '3-PIECE Y2K CYBER SET',
    subtitle: 'Ring + Chain + Bracelet Included',
    category: 'cyber-bundle',
    categoryLabel: '3-PC CYBER SET',
    dropCollection: 'everyday-drop',
    phase: 1,
    phaseStatus: 'FREE SHIPPING ELIGIBLE',
    stockCount: 30,
    price: 1199,
    compareAtPrice: 2894,
    specBadge: '★ MOST POPULAR BUNDLE · SAVE ₹1,695',
    description:
      'Three signature pieces engineered to wear together as a complete set. Includes the Cyber Signet Ring, Heavy Chain + Pendant, and Chain Bracelet in solid 316L stainless steel.',
    whatsInside: [
      '1 × Cyber Signet Ring',
      '1 × Heavy Chain + Pendant',
      '1 × Chain Bracelet',
    ],
    shortBullets: [
      'Complete 3-piece hardware set — save ₹248 vs. buying individually',
      'Limited Phase 1 batch of 30 sets',
      'Ships in a custom zip pouch with care card',
      'Unlocks Free Express Shipping & ₹0-advance Cash on Delivery',
    ],
    careNote:
      'Keep dry and remove before showering, swimming, or applying cologne. Store in the zip pouch and wipe with a dry cloth.',
    codPolicyNote: 'Cash on Delivery available with ₹0 advance. Free shipping unlocked.',
    tags: [
      'y2k',
      'accessories',
      'everyday-drop',
      'phase-1',
      'cod-available',
      'bundle',
      'combo',
      'best-value',
      'cyber-set',
    ],
    productType: 'Jewellery',
    vendor: 'RWND20s',
    seoTitle: '3-Piece Y2K Cyber Set | RWND20s',
    seoDescription:
      'Ring, chain and bracelet in one set for ₹1,199. Save ₹248. Ships across India.',
    imageAlt:
      '3-Piece Y2K Cyber Set with ring, chain and bracelet on black background, RWND20s.',
    netQuantity: '3 N (1 Ring, 1 Chain + Pendant, 1 Bracelet)',
    countryOfOrigin: 'Imported (PRC) · Packaged & Quality Checked in India',
    specs: [
      { label: 'Included Hardware', value: 'Cyber Signet Ring + Heavy Chain + Chain Bracelet' },
      { label: 'Bundle Savings', value: '₹1,199 MRP incl. taxes (Stash Price ₹2,894 · Save ₹1,695)' },
      { label: 'Material', value: '316L Stainless Steel · Tarnish-Resistant Finish' },
      { label: 'Packaging', value: 'rwnd20s. Zip Pouch + Care Card' },
    ],
    optionName: 'Ring Size',
    variants: [
      { id: 'bun01-us8', label: 'Ring US 8 + 50cm Chain + Standard Bracelet', priceDelta: 0, inStock: true },
      { id: 'bun01-us9', label: 'Ring US 9 + 50cm Chain + Standard Bracelet', priceDelta: 0, inStock: true },
      { id: 'bun01-us10', label: 'Ring US 10 + 55cm Chain + Standard Bracelet', priceDelta: 0, inStock: true },
    ],
    images: buildHardwareStudioSet(
      'cyber-bundle',
      'BUN-01',
      '3-PIECE Y2K CYBER SET'
    ),
    featuredRank: 1,
  },
  {
    id: 'rwnd-ring-01',
    sku: 'R-01',
    handle: '/products/y2k-cyber-signet-ring',
    title: 'CYBER SIGNET RING',
    subtitle: 'Chunky 316L Stainless Steel Signet Ring',
    category: 'y2k-rings',
    categoryLabel: 'Y2K RINGS',
    dropCollection: 'everyday-drop',
    phase: 1,
    phaseStatus: 'IN STOCK · SHIPS IN 24H',
    stockCount: 40,
    price: 349,
    compareAtPrice: 998,
    specBadge: 'BESTSELLER',
    description:
      'A heavy-cast signet ring sculpted in a bold Y2K silhouette. Built to wear solo or stacked across fingers.',
    shortBullets: [
      'Chunky Y2K-inspired signet silhouette',
      'Solid stainless steel with polished liquid-silver finish',
      'MRP ₹349 (inclusive of all taxes)',
    ],
    careNote: 'Keep dry. Store in the included pouch and wipe with a dry cloth.',
    codPolicyNote: 'Cash on Delivery available with ₹0 advance.',
    tags: [
      'y2k',
      'accessories',
      'everyday-drop',
      'phase-1',
      'cod-available',
      'rings',
      'y2k-rings',
      'under-500',
    ],
    productType: 'Jewellery',
    vendor: 'RWND20s',
    seoTitle: 'Y2K Cyber Signet Ring | RWND20s',
    seoDescription:
      'Chunky Y2K signet ring. Ships across India with COD or prepaid. Bundle to save ₹248.',
    imageAlt: 'Y2K cyber signet ring on black background, RWND20s.',
    netQuantity: '1 N (1 Ring)',
    countryOfOrigin: 'Imported (PRC) · Distributed in India by RWND20s',
    specs: [
      { label: 'Design', value: 'Chunky Y2K Cyber Signet' },
      { label: 'Material', value: '316L Stainless Steel' },
      { label: 'Finish', value: 'High-Polish Liquid Silver' },
      { label: 'Care', value: 'Store in pouch · Wipe with dry cloth' },
    ],
    optionName: 'Ring Size',
    variants: [
      { id: 'r01-us7', label: 'US 7 (17.3mm)', inStock: true },
      { id: 'r01-us8', label: 'US 8 (18.1mm)', inStock: true },
      { id: 'r01-us9', label: 'US 9 (19.0mm)', inStock: true },
      { id: 'r01-us10', label: 'US 10 (19.8mm)', inStock: true },
    ],
    images: buildHardwareStudioSet(
      'ring-star',
      'R-01',
      'CYBER SIGNET RING'
    ),
    featuredRank: 2,
  },
  {
    id: 'rwnd-chain-01',
    sku: 'C-01',
    handle: '/products/y2k-heavy-chain-pendant',
    title: 'HEAVY CHAIN + PENDANT',
    subtitle: 'Heavy 316L Stainless Steel Chain & Y2K Pendant',
    category: 'chains',
    categoryLabel: 'CHAINS',
    dropCollection: 'everyday-drop',
    phase: 1,
    phaseStatus: 'IN STOCK · SHIPS IN 24H',
    stockCount: 35,
    price: 549,
    compareAtPrice: 1598,
    specBadge: 'BESTSELLER',
    description:
      'A heavy-gauge link chain paired with a sculpted Y2K pendant. Forged from 316L stainless steel for everyday durability and tactile weight.',
    shortBullets: [
      'Chain and pendant forged from 316L stainless steel',
      'Ships in a custom zip pouch with care card',
      'Pairs seamlessly with the Cyber Signet Ring & Chain Bracelet',
    ],
    careNote:
      'Keep dry and remove before showering or swimming. Store in zip pouch.',
    codPolicyNote: 'Cash on Delivery available with ₹0 advance.',
    tags: [
      'y2k',
      'accessories',
      'everyday-drop',
      'phase-1',
      'cod-available',
      'chains',
      'pendants',
      'y2k-chains',
      'under-600',
    ],
    productType: 'Jewellery',
    vendor: 'RWND20s',
    seoTitle: 'Y2K Heavy Chain Pendant | RWND20s',
    seoDescription:
      'Heavy Y2K chain and pendant in 316L stainless steel. Ships across India.',
    imageAlt:
      'Y2K heavy chain and pendant in 316L stainless steel on black background, RWND20s.',
    netQuantity: '1 N (1 Chain with Pendant)',
    countryOfOrigin: 'Imported (PRC) · Distributed in India by RWND20s',
    specs: [
      { label: 'Material', value: '316L Stainless Steel Chain & Pendant' },
      { label: 'Clasp', value: 'Reinforced Lobster Clasp' },
      { label: 'Packaging', value: 'Zip Pouch + Care Card' },
      { label: 'Bundle Option', value: 'Included in 3-Piece Y2K Cyber Set (Save ₹248)' },
    ],
    optionName: 'Chain Length',
    variants: [
      { id: 'c01-50cm', label: '50cm Standard Fit', inStock: true },
      { id: 'c01-55cm', label: '55cm Layered Fit', inStock: true },
    ],
    images: buildHardwareStudioSet(
      'chain-cross',
      'C-01',
      'HEAVY CHAIN + PENDANT'
    ),
    featuredRank: 3,
  },
  {
    id: 'rwnd-bracelet-01',
    sku: 'B-01',
    handle: '/products/y2k-chain-bracelet',
    title: 'CHAIN BRACELET',
    subtitle: 'Industrial 316L Stainless Steel Link Bracelet',
    category: 'bracelets',
    categoryLabel: 'BRACELETS',
    dropCollection: 'everyday-drop',
    phase: 1,
    phaseStatus: 'IN STOCK · SHIPS IN 24H',
    stockCount: 30,
    price: 549,
    compareAtPrice: 1598,
    specBadge: 'BESTSELLER',
    description:
      'Thick industrial link wrist chain crafted from 316L stainless steel. Engineered to stack with a watch or complete the 3-Piece Cyber Set.',
    shortBullets: [
      'Solid 316L surgical-grade stainless steel links',
      'Pairs with the Cyber Signet Ring and Heavy Chain',
      'Ships in a custom zip pouch with care card',
    ],
    careNote: 'Keep dry. Store in the pouch and wipe with a dry cloth.',
    codPolicyNote: 'Cash on Delivery available with ₹0 advance.',
    tags: [
      'y2k',
      'accessories',
      'everyday-drop',
      'phase-1',
      'cod-available',
      'bracelets',
      'y2k-bracelets',
      'under-600',
    ],
    productType: 'Jewellery',
    vendor: 'RWND20s',
    seoTitle: 'Y2K Chain Bracelet | RWND20s',
    seoDescription:
      'Y2K chain bracelet in 316L stainless steel. Pair it with the Cyber Set.',
    imageAlt:
      'Y2K chain bracelet in 316L stainless steel on black background, RWND20s.',
    netQuantity: '1 N (1 Bracelet)',
    countryOfOrigin: 'Imported (PRC) · Distributed in India by RWND20s',
    specs: [
      { label: 'Material', value: '316L Stainless Steel' },
      { label: 'Link Profile', value: 'Heavy Industrial Curb Link' },
      { label: 'Clasp', value: 'Custom Locking Lobster Clasp' },
      { label: 'Net Quantity', value: '1 N (1 Bracelet)' },
    ],
    optionName: 'Wrist Fit',
    variants: [
      { id: 'b01-std', label: 'Standard Fit (19cm)', inStock: true },
      { id: 'b01-relaxed', label: 'Relaxed Fit (21cm)', inStock: true },
    ],
    images: buildHardwareStudioSet(
      'bracelet-heavy',
      'B-01',
      'CHAIN BRACELET'
    ),
    featuredRank: 4,
  },
  {
    id: 'rwnd-iem-01',
    sku: 'EAR-01',
    handle: '/products/pink-chrome-earphones-type-c',
    title: 'PINK CHROME WIRED EARPHONES (TYPE-C)',
    subtitle: 'Metallic Pink Chrome Finish · Direct Type-C Plug + Carry Case',
    category: 'chrome-earphones',
    categoryLabel: 'CHROME EARPHONES',
    dropCollection: 'premium-drop',
    phase: 1,
    phaseStatus: 'FREE SHIPPING ELIGIBLE',
    stockCount: 16,
    price: 999,
    compareAtPrice: 2998,
    specBadge: 'ONLY 16 LEFT',
    description:
      'Type-C only. Not compatible with iPhone 14 and older, or with 3.5mm jack phones. Standard Type-C pink chrome wired earphones with an included carry case—plugs directly into USB-C Android phones and iPhone 15 or newer with no adapter required.',
    compatibilityWarning:
      'Type-C only. Not compatible with iPhone 14 and older, or with 3.5mm jack phones.',
    shortBullets: [
      'Direct USB Type-C plug (Wired, not wireless — no adapter needed)',
      'Metallic pink chrome finish with tangle-resistant cord',
      'Includes matching carry case in the box',
      'Unlocks Free Express Shipping immediately (₹999)',
    ],
    careNote:
      'Coil loosely inside the included carry case after use. Avoid sharp bends near the Type-C plug.',
    codPolicyNote: 'Cash on Delivery available with ₹0 advance. Free shipping unlocked at ₹999.',
    tags: [
      'earphones',
      'type-c-earphones',
      'premium-drop',
      'phase-1',
      'type-c-only',
    ],
    productType: 'Audio',
    vendor: 'RWND20s',
    seoTitle: 'Pink Chrome Wired Earphones (Type-C) | RWND20s',
    seoDescription:
      'Pink chrome Type-C wired earphones with carry case. Free shipping eligible.',
    imageAlt:
      'Pink chrome Type-C wired earphones with case on black background, RWND20s.',
    netQuantity: '1 Set (1 Pair Wired Earphones + 1 Carry Case)',
    countryOfOrigin: 'Imported (PRC) · Compatibility Tested in India',
    specs: [
      { label: 'Connector', value: 'Direct USB Type-C Plug (Wired)' },
      { label: 'Finish', value: 'Electroplated Pink Chrome Metallic' },
      { label: 'Included in Box', value: 'Wired Earphones + Carry Case' },
      { label: 'Device Compatibility', value: 'Type-C Android & iPhone 15 or Newer Only' },
    ],
    optionName: 'Edition',
    variants: [
      { id: 'ear01-launch', label: 'Pink Chrome Type-C + Carry Case', priceDelta: 0, inStock: true },
    ],
    images: buildHardwareStudioSet(
      'iem-chrome',
      'EAR-01',
      'PINK CHROME WIRED EARPHONES (TYPE-C)'
    ),
    featuredRank: 5,
  },
  {
    id: 'rwnd-earrings-01',
    sku: 'E-01',
    handle: '/products/y2k-earrings',
    title: 'Y2K CYBER STUDS',
    subtitle: 'Minimalist Silver Cyber Metallic Studs',
    category: 'earrings',
    categoryLabel: 'EARRINGS',
    dropCollection: 'everyday-drop',
    phase: 1,
    phaseStatus: 'IN STOCK · 25 LEFT',
    stockCount: 25,
    price: 299,
    compareAtPrice: 898,
    specBadge: 'BESTSELLER',
    description:
      'Sculpted Y2K metallic studs designed to pair with the 3-Piece Cyber Set. Keep dry and store in the included pouch. Note: Posts are fashion-alloy (not certified nickel-free)—avoid if you have sensitive ears.',
    shortBullets: [
      'Sculpted Y2K metallic silhouette (1 Pair)',
      'Ships in a protective storage pouch',
      'Sensitivity Note: Fashion-alloy posts (not certified nickel-free)',
      'Hygiene sealed — eligible for replacement on verified transit damage',
    ],
    careNote:
      'Keep dry and store in the pouch. Pair them with the 3-Piece Cyber Set.',
    codPolicyNote: 'Cash on Delivery available with ₹0 advance.',
    tags: [
      'y2k',
      'accessories',
      'everyday-drop',
      'phase-1',
      'cod-available',
      'earrings',
      'y2k-earrings',
      'under-300',
    ],
    productType: 'Jewellery',
    vendor: 'RWND20s',
    seoTitle: 'Y2K Cyber Studs | RWND20s',
    seoDescription:
      'Minimalist silver Y2K cyber studs. Ships across India with COD or prepaid.',
    imageAlt: 'Y2K cyber stud earrings on black background, RWND20s.',
    netQuantity: '1 Pair (2 N)',
    countryOfOrigin: 'Imported (PRC) · Distributed in India by RWND20s',
    specs: [
      { label: 'Style', value: 'Minimalist Silver Cyber Studs (Pair)' },
      { label: 'Post Material', value: 'Fashion Alloy Posts (Not Certified Nickel-Free)' },
      { label: 'Packaging', value: 'Sealed Hygiene Pouch' },
      { label: 'Care', value: 'Keep dry, store in the pouch' },
    ],
    optionName: 'Pair Edition',
    variants: [
      { id: 'e01-std', label: 'Silver Cyber Pair + Pouch', inStock: true },
    ],
    images: buildHardwareStudioSet(
      'earrings-y2k',
      'E-01',
      'Y2K CYBER STUDS'
    ),
    featuredRank: 6,
  },
  {
    id: 'rwnd-watch-01',
    sku: 'W-01',
    handle: '/products/y2k-watch',
    title: 'Y2K WATCH',
    subtitle: 'Analog-Digital Brushed Steel Chronograph',
    category: 'watches',
    categoryLabel: 'WATCHES',
    dropCollection: 'premium-drop',
    phase: 2,
    phaseStatus: 'PHASE 2 PRE-ORDER · 10 UNITS',
    stockCount: 10,
    price: 1999,
    compareAtPrice: 4998,
    codPrice: 2199,
    codAdvanceRequired: 150,
    specBadge: 'PHASE 2 PRE-ORDER',
    description:
      'Unbranded, Y2K-inspired brushed steel timepiece (not Casio, Fossil, or any third-party brand). Phase 2 release unlocks at 10 paid pre-orders. Prepaid ₹1,999 or COD ₹2,199 (requires ₹150 non-refundable UPI advance before dispatch).',
    compatibilityWarning:
      '₹150 advance is non-refundable. It covers part of the delivery cost if an order is refused or returned.',
    shortBullets: [
      'Unbranded Y2K-inspired analog-digital steel design',
      'Prepaid: ₹1,999 | COD: ₹2,199 (with ₹150 non-refundable UPI advance)',
      'Not water resistant — keep away from water and moisture',
      '48-hour 1-for-1 replacement with unboxing video proof',
    ],
    careNote:
      'Not water resistant. Wipe with a dry microfibre cloth.',
    codPolicyNote:
      '₹150 advance is non-refundable. It covers part of the delivery cost if an order is refused or returned.',
    tags: [
      'watch',
      'y2k-watch',
      'premium-drop',
      'phase-2',
      'prepaid-discount',
      'cod-advance',
    ],
    productType: 'Watch',
    vendor: 'RWND20s',
    seoTitle: 'Y2K Watch India | RWND20s',
    seoDescription:
      'Unbranded Y2K-inspired watch. Prepaid ₹1,999. Ships across India.',
    imageAlt: 'Unbranded Y2K-inspired watch on black background, RWND20s.',
    netQuantity: '1 N (1 Watch)',
    countryOfOrigin: 'Imported (PRC) · Distributed in India by RWND20s',
    specs: [
      { label: 'Design', value: 'Unbranded Y2K Analog-Digital Steel Case' },
      { label: 'Pricing', value: '₹1,999 Prepaid / ₹2,199 COD (₹150 UPI Advance)' },
      { label: 'Water Resistance', value: 'Not Water Resistant (Keep Dry)' },
      { label: 'Protection', value: '48-Hour 1-for-1 Replacement with Unboxing Video' },
    ],
    optionName: 'Checkout Tier',
    variants: [
      { id: 'w01-prepaid-analog', label: 'Prepaid Dispatch (₹1,999 · Free Shipping)', priceDelta: 0, inStock: true },
      { id: 'w01-cod-analog', label: 'COD Dispatch (₹2,199 · ₹150 UPI Advance)', priceDelta: 200, inStock: true },
    ],
    images: buildHardwareStudioSet(
      'watch-obsidian',
      'W-01',
      'Y2K WATCH'
    ),
    featuredRank: 7,
  },
];

export const SHOP_AND_PRODUCTS_STATUS_QUERY = `
  query GetShopAndProductCount {
    shop {
      name
      primaryDomain {
        url
        host
      }
      paymentSettings {
        currencyCode
      }
    }
    products(first: 25) {
      edges {
        node {
          id
        }
      }
    }
  }
`;

export async function shopifyGraphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T | null> {
  if (!isShopifyConfigured) {
    return null;
  }

  try {
    const response = await fetch(
      `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/api/2026-10/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token":
            import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
            SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        },
        body: JSON.stringify(
          variables && Object.keys(variables).length > 0
            ? { query, variables }
            : { query }
        ),
      }
    );

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    return (json?.data as T) ?? null;
  } catch {
    return null;
  }
}

export const COLLECTION_PRODUCTS_QUERY = `
  query GetCollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      id
      title
      products(first: 20) {
        edges {
          node {
            id
            title
            handle
            description
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const CART_CREATE_MUTATION = `
  mutation CreateBag($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const ALL_PRODUCTS_QUERY = `
  query GetAllProducts {
    products(first: 24) {
      edges {
        node {
          id
          title
          handle
          productType
          description
          tags
          images(first: 4) {
            edges {
              node {
                url
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                sku
                availableForSale
                price {
                  amount
                }
                compareAtPrice {
                  amount
                }
              }
            }
          }
        }
      }
    }
  }
`;

export interface ShopifyConnectionStatus {
  connected: boolean;
  mode:
    | 'shopify-live'
    | 'shopify-admin-connected'
    | 'domain-configured'
    | 'local-archive';
  storeDomain: string | null;
  shopName: string | null;
  currencyCode: string;
  productCount: number;
  remoteProductCount?: number;
  storefrontConnected: boolean;
  adminSyncAvailable: boolean;
  message: string;
}

export async function fetchShopifyConnectionStatus(): Promise<ShopifyConnectionStatus> {
  // 1. If frontend Storefront API credentials (VITE_SHOPIFY_STORE_DOMAIN + VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN) are set, verify live Storefront connection directly
  if (isShopifyConfigured) {
    const data = await shopifyGraphqlRequest<{
      shop?: {
        name?: string;
        primaryDomain?: { url?: string; host?: string };
        paymentSettings?: { currencyCode?: string };
      };
      products?: { edges?: { node: { id: string } }[] };
    }>(SHOP_AND_PRODUCTS_STATUS_QUERY);

    if (data?.shop) {
      const remoteCount = data.products?.edges?.length || 0;
      return {
        connected: true,
        mode: 'shopify-live',
        storeDomain: SHOPIFY_STORE_DOMAIN,
        shopName: data.shop.name || SHOPIFY_STORE_DOMAIN,
        currencyCode: data.shop.paymentSettings?.currencyCode || 'INR',
        productCount:
          remoteCount > 0 ? remoteCount : LOCAL_ARCHIVE_PRODUCTS.length,
        remoteProductCount: remoteCount,
        storefrontConnected: true,
        adminSyncAvailable: false,
        message:
          remoteCount > 0
            ? `Connected to ${data.shop.name} via Storefront API 2026-10 (${remoteCount} live products synced).`
            : `Connected to ${data.shop.name} via Storefront API 2026-10. Store has 0 published products—import the CSV or push drops to populate your catalog.`,
      };
    }
  }

  // 2. Check server-side Shopify status endpoint (/api/shopify/status)
  try {
    const resp = await fetch('/api/shopify/status');
    if (resp.ok) {
      const serverStatus = (await resp.json()) as ShopifyConnectionStatus;
      if (serverStatus.connected || !isShopifyConfigured) {
        return serverStatus;
      }
    }
  } catch {
    // Fallback if server endpoint is unreachable
  }

  return {
    connected: isShopifyConfigured,
    mode: isShopifyConfigured ? 'shopify-live' : 'local-archive',
    storeDomain: SHOPIFY_STORE_DOMAIN || null,
    shopName: SHOPIFY_STORE_DOMAIN || null,
    currencyCode: 'INR',
    productCount: LOCAL_ARCHIVE_PRODUCTS.length,
    storefrontConnected: isShopifyConfigured,
    adminSyncAvailable: false,
    message: isShopifyConfigured
      ? `Configured for ${SHOPIFY_STORE_DOMAIN} (API 2026-10).`
      : 'Running on the built-in 7-drop RWND20s Archive Catalog. Set VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN to connect your live Shopify store.',
  };
}

export interface ShopifySyncCatalogResponse {
  success: boolean;
  syncedCount?: number;
  syncedTitles?: string[];
  errors?: string[];
  message: string;
}

export async function syncCatalogToShopify(): Promise<ShopifySyncCatalogResponse> {
  try {
    const resp = await fetch('/api/shopify/sync-catalog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = (await resp.json()) as ShopifySyncCatalogResponse;
    return data;
  } catch {
    return {
      success: false,
      message:
        'Could not reach /api/shopify/sync-catalog. You can still download the Shopify Products CSV and import it in Shopify Admin → Products → Import.',
    };
  }
}

interface ShopifyProductNode {
  id: string;
  title: string;
  handle: string;
  productType?: string;
  description?: string;
  tags?: string[];
  images?: { edges?: { node: { url: string } }[] };
  variants?: {
    edges?: {
      node: {
        id: string;
        title: string;
        sku?: string;
        availableForSale: boolean;
        price?: { amount: string };
        compareAtPrice?: { amount: string };
      };
    }[];
  };
}

function mapShopifyNodesToProducts(
  edges: { node: ShopifyProductNode }[]
): Product[] {
  const categoryLabels: Record<
    Exclude<CategoryHandle, 'all' | 'everyday-drop' | 'premium-drop'>,
    string
  > = {
    'cyber-bundle': '3-PC CYBER SET',
    watches: 'WATCHES',
    'chrome-earphones': 'CHROME EARPHONES',
    'y2k-rings': 'Y2K RINGS',
    chains: 'CHAINS',
    bracelets: 'BRACELETS',
    earrings: 'EARRINGS',
  };

  return edges.map(({ node }, idx) => {
    const cleanHandle = `/products/${node.handle}`;
    const firstVar = node.variants?.edges?.[0]?.node;
    const matchedLocal = LOCAL_ARCHIVE_PRODUCTS.find(
      (local) =>
        local.handle.toLowerCase() === cleanHandle.toLowerCase() ||
        (firstVar?.sku &&
          firstVar.sku.toUpperCase().startsWith(local.sku.toUpperCase())) ||
        local.title.toLowerCase() === node.title.toLowerCase()
    );

    const basePrice = Math.round(
      Number(firstVar?.price?.amount || matchedLocal?.price || 549)
    );
    const compareAt = Math.round(
      Number(
        firstVar?.compareAtPrice?.amount ||
          matchedLocal?.compareAtPrice ||
          Math.round(basePrice * 2)
      )
    );
    const rawType = (
      node.productType ||
      node.handle ||
      matchedLocal?.category ||
      ''
    ).toLowerCase();

    let category: Exclude<
      CategoryHandle,
      'all' | 'everyday-drop' | 'premium-drop'
    > = matchedLocal?.category || 'y2k-rings';

    if (!matchedLocal) {
      if (rawType.includes('bundle') || rawType.includes('set')) {
        category = 'cyber-bundle';
      } else if (rawType.includes('watch')) {
        category = 'watches';
      } else if (rawType.includes('earphone') || rawType.includes('audio')) {
        category = 'chrome-earphones';
      } else if (rawType.includes('earring') || rawType.includes('stud')) {
        category = 'earrings';
      } else if (rawType.includes('chain') || rawType.includes('neck')) {
        category = 'chains';
      } else if (rawType.includes('bracelet') || rawType.includes('cuff')) {
        category = 'bracelets';
      }
    }

    const imgs =
      node.images?.edges?.map((e) => e.node.url).filter(Boolean) || [];

    const tags =
      node.tags && node.tags.length > 0
        ? node.tags
        : matchedLocal?.tags || [];
    const dropCollection = tags.includes('premium-drop')
      ? 'premium-drop'
      : matchedLocal?.dropCollection || 'everyday-drop';

    return {
      ...(matchedLocal || {}),
      id: node.id,
      sku: matchedLocal?.sku || firstVar?.sku || `RW-0${idx + 1}`,
      handle: cleanHandle,
      title: node.title.toUpperCase(),
      subtitle:
        matchedLocal?.subtitle || node.productType || 'RWND20s Y2K Hardware',
      category,
      categoryLabel: categoryLabels[category],
      dropCollection,
      phase: matchedLocal?.phase || 1,
      phaseStatus: matchedLocal?.phaseStatus || 'LIVE DROP',
      price: basePrice,
      compareAtPrice:
        compareAt > basePrice
          ? compareAt
          : matchedLocal?.compareAtPrice || Math.round(basePrice * 2),
      specBadge: matchedLocal?.specBadge || 'BESTSELLER',
      description:
        node.description ||
        matchedLocal?.description ||
        'Y2K hardware from the RWND20s archive. Ships across India with COD or prepaid.',
      tags,
      vendor: 'RWND20s',
      specs: matchedLocal?.specs || [
        { label: 'Brand', value: 'rwnd20s.' },
        { label: 'Edition', value: 'Drop 01 Archive' },
      ],
      optionName: matchedLocal?.optionName || 'Variant',
      variants:
        node.variants?.edges?.map((v) => ({
          id: v.node.id,
          label:
            v.node.title === 'Default Title' ? 'Standard Spec' : v.node.title,
          priceDelta: Math.max(
            0,
            Math.round(Number(v.node.price?.amount || basePrice)) - basePrice
          ),
          inStock: v.node.availableForSale,
        })) || [{ id: `${node.id}-v1`, label: 'Standard Spec', inStock: true }],
      images:
        imgs.length > 0
          ? imgs
          : matchedLocal?.images ||
            LOCAL_ARCHIVE_PRODUCTS[idx % LOCAL_ARCHIVE_PRODUCTS.length].images,
      featuredRank: matchedLocal?.featuredRank ?? idx + 1,
    };
  });
}

export async function fetchLiveOrFallbackCatalog(): Promise<Product[]> {
  // 1. Direct Frontend Shopify Storefront API 2026-10 query using VITE_SHOPIFY_STORE_DOMAIN & VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN
  if (isShopifyConfigured) {
    const data = await shopifyGraphqlRequest<{
      products?: { edges?: { node: ShopifyProductNode }[] };
    }>(ALL_PRODUCTS_QUERY);

    const edges = data?.products?.edges;
    if (edges && edges.length > 0) {
      return mapShopifyNodesToProducts(edges);
    }
  }

  // 2. Try server-side Shopify proxy endpoint (/api/shopify/products) if it has live Shopify Storefront products
  try {
    const apiResp = await fetch('/api/shopify/products');
    if (apiResp.ok) {
      const payload = (await apiResp.json()) as {
        source?: string;
        products?: Product[];
      };
      if (
        payload.source === 'shopify-storefront' &&
        Array.isArray(payload.products) &&
        payload.products.length > 0
      ) {
        return payload.products;
      }
    }
  } catch {
    // Fall back to local archive catalog below
  }

  return LOCAL_ARCHIVE_PRODUCTS;
}

export async function fetchProductsByCollectionHandle(
  handle: CategoryHandle
): Promise<Product[]> {
  const catalog = await fetchLiveOrFallbackCatalog();
  if (handle === 'all') {
    return catalog;
  }

  if (isShopifyConfigured) {
    await shopifyGraphqlRequest(COLLECTION_PRODUCTS_QUERY, { handle });
  }

  if (handle === 'everyday-drop' || handle === 'premium-drop') {
    return catalog.filter(
      (p) => p.dropCollection === handle || p.tags?.includes(handle)
    );
  }

  return catalog.filter((p) => p.category === handle);
}

export interface CheckoutResult {
  mode: 'shopify-live' | 'local-preview';
  checkoutUrl: string | null;
  referenceId: string;
  discountApplied?: string | null;
}

export interface CreateShopifyCheckoutOptions {
  welcomeDiscountCode?: string | null;
  customerEmail?: string | null;
  paymentMethod?: 'prepaid' | 'cod';
}

export async function createShopifyCheckout(
  cartItems: CartItem[],
  options: CreateShopifyCheckoutOptions = {}
): Promise<CheckoutResult> {
  const referenceId = `RWND-${Math.floor(100000 + Math.random() * 900000)}`;

  // 1. Direct Frontend Shopify Storefront API 2026-10 cartCreate when configured
  if (isShopifyConfigured && cartItems.length > 0) {
    const lines = cartItems.map((item) => ({
      merchandiseId: item.selectedVariant.id,
      quantity: item.quantity,
    }));

    const cartInput: Record<string, unknown> = { lines };
    if (options.welcomeDiscountCode) {
      cartInput.discountCodes = [options.welcomeDiscountCode];
    }
    if (options.customerEmail) {
      cartInput.buyerIdentity = {
        email: options.customerEmail,
        countryCode: 'IN',
      };
    }

    const data = await shopifyGraphqlRequest<{
      cartCreate?: { cart?: { checkoutUrl?: string } };
    }>(CART_CREATE_MUTATION, {
      input: cartInput,
    });

    const liveUrl = data?.cartCreate?.cart?.checkoutUrl;
    if (liveUrl) {
      return {
        mode: 'shopify-live',
        checkoutUrl: liveUrl,
        referenceId,
        discountApplied: options.welcomeDiscountCode || null,
      };
    }
  }

  // 2. Try server-side Shopify checkout proxy (/api/shopify/checkout)
  if (cartItems.length > 0) {
    try {
      const apiResp = await fetch('/api/shopify/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            variantId: item.selectedVariant.id,
            title: item.product.title,
            variantLabel: item.selectedVariant.label,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
          })),
          welcomeDiscountCode: options.welcomeDiscountCode || null,
          customerEmail: options.customerEmail || null,
          paymentMethod: options.paymentMethod || 'prepaid',
        }),
      });

      if (apiResp.ok) {
        const result = (await apiResp.json()) as CheckoutResult;
        if (result.mode === 'shopify-live' && result.checkoutUrl) {
          return result;
        }
      }
    } catch {
      // Fall back to local preview below
    }
  }

  return {
    mode: 'local-preview',
    checkoutUrl: null,
    referenceId,
    discountApplied: options.welcomeDiscountCode || null,
  };
}


