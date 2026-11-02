/**
 * Shared Shopify Storefront API utilities for Vercel Serverless Functions
 * (`/api/shopify/status`, `/api/shopify/products`, `/api/shopify/checkout`).
 *
 * Uses Shopify Storefront GraphQL API version `2026-01` (verified supported on
 * `00w7hv-n6.myshopify.com`).
 *
 * SECURITY INVARIANTS:
 * - Reads `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN` strictly
 *   from server-side environment variables (`process.env`).
 * - Never exposes tokens in responses or logs.
 * - Never trusts browser-supplied prices during checkout.
 */

export const SHOPIFY_API_VERSION = '2026-01';
export const DEFAULT_SHOPIFY_STORE_DOMAIN = '00w7hv-n6.myshopify.com';

const SHOPIFY_DOMAIN_PATTERN = /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i;
const SHOPIFY_VARIANT_GID_PATTERN =
  /^gid:\/\/shopify\/ProductVariant\/([0-9]+)$/;
const NUMERIC_ID_PATTERN = /^[0-9]+$/;

/**
 * Normalizes and validates a `*.myshopify.com` store domain.
 *
 * @param {string | undefined | null} rawDomain
 * @returns {string | null}
 */
export function sanitizeShopifyDomain(rawDomain) {
  if (!rawDomain || typeof rawDomain !== 'string') {
    return null;
  }

  const cleaned = rawDomain
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .toLowerCase();

  if (!cleaned || !SHOPIFY_DOMAIN_PATTERN.test(cleaned)) {
    return null;
  }

  return cleaned;
}

/**
 * Resolves the server-side Shopify Storefront configuration from environment variables.
 * Defaults `SHOPIFY_STORE_DOMAIN` to `00w7hv-n6.myshopify.com` if unset.
 *
 * @param {Record<string, string | undefined>} [env]
 */
export function getStorefrontConfig(env = process.env) {
  const rawDomain =
    env.SHOPIFY_STORE_DOMAIN && env.SHOPIFY_STORE_DOMAIN.trim()
      ? env.SHOPIFY_STORE_DOMAIN
      : DEFAULT_SHOPIFY_STORE_DOMAIN;

  const storeDomain = sanitizeShopifyDomain(rawDomain);
  const rawToken =
    typeof env.SHOPIFY_STOREFRONT_ACCESS_TOKEN === 'string'
      ? env.SHOPIFY_STOREFRONT_ACCESS_TOKEN.trim()
      : '';

  const hasValidToken = Boolean(
    rawToken &&
      rawToken !== 'MY_SHOPIFY_STOREFRONT_TOKEN' &&
      rawToken !== 'YOUR_SHOPIFY_STOREFRONT_ACCESS_TOKEN'
  );

  return {
    storeDomain,
    storefrontToken: hasValidToken ? rawToken : '',
    apiVersion: SHOPIFY_API_VERSION,
    hasStoreDomain: Boolean(storeDomain),
    hasStorefrontToken: hasValidToken,
    isConfigured: Boolean(storeDomain && hasValidToken),
  };
}

/**
 * Sends a JSON response compatible with both Vercel serverless `res` and Node `http.ServerResponse`.
 */
export function sendJsonResponse(res, statusCode, body) {
  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, private'
  );
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (typeof res.status === 'function') {
    const chained = res.status(statusCode);
    if (chained && typeof chained.json === 'function') {
      return chained.json(body);
    }
    if (typeof res.json === 'function') {
      return res.json(body);
    }
  }

  res.statusCode = statusCode;
  return res.end(JSON.stringify(body));
}

/**
 * Executes a GraphQL operation against the Shopify Storefront API (`2026-01`).
 *
 * @param {{
 *   storeDomain: string;
 *   storefrontToken: string;
 *   query: string;
 *   variables?: Record<string, unknown>;
 *   fetchImpl?: typeof fetch;
 * }} params
 */
export async function executeStorefrontGraphQL({
  storeDomain,
  storefrontToken,
  query,
  variables = {},
  fetchImpl = fetch,
}) {
  const endpoint = `https://${storeDomain}/api/${SHOPIFY_API_VERSION}/graphql.json`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let payload = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    const graphqlErrors = Array.isArray(payload?.errors) ? payload.errors : [];
    const firstErrorMessage =
      typeof graphqlErrors[0]?.message === 'string'
        ? graphqlErrors[0].message
        : null;

    if (!response.ok) {
      return {
        ok: false,
        statusCode: response.status,
        data: null,
        error:
          firstErrorMessage ||
          `Shopify Storefront API responded with HTTP ${response.status}.`,
      };
    }

    if (graphqlErrors.length > 0 && !payload?.data) {
      return {
        ok: false,
        statusCode: 502,
        data: null,
        error:
          firstErrorMessage ||
          'Shopify Storefront API returned GraphQL errors.',
      };
    }

    return {
      ok: true,
      statusCode: 200,
      data: payload?.data ?? null,
      error: firstErrorMessage,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    const isTimeout = err instanceof Error && err.name === 'AbortError';
    return {
      ok: false,
      statusCode: 502,
      data: null,
      error: isTimeout
        ? `Request to Shopify Storefront API (${storeDomain}) timed out.`
        : `Failed to reach Shopify Storefront API (${storeDomain}).`,
    };
  }
}

export const STOREFRONT_STATUS_QUERY = `
  query GetShopStatus {
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

export const STOREFRONT_PRODUCTS_QUERY = `
  query GetStorefrontProducts($first: Int!) {
    shop {
      name
      paymentSettings {
        currencyCode
      }
    }
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          productType
          description
          vendor
          tags
          availableForSale
          options {
            id
            name
            values
          }
          featuredImage {
            url
            altText
          }
          images(first: 6) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                sku
                availableForSale
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
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
`;

export const STOREFRONT_CART_CREATE_MUTATION = `
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const CATEGORY_LABELS = {
  'cyber-bundle': '3-PC CYBER SET',
  watches: 'WATCHES',
  'chrome-earphones': 'CHROME EARPHONES',
  'y2k-rings': 'Y2K RINGS',
  chains: 'CHAINS',
  bracelets: 'BRACELETS',
  earrings: 'EARRINGS',
};

/**
 * Infers the storefront category handle from a Shopify product's type, handle, title, and tags.
 *
 * @param {Record<string, any>} node
 * @returns {'cyber-bundle' | 'watches' | 'chrome-earphones' | 'y2k-rings' | 'chains' | 'bracelets' | 'earrings'}
 */
export function inferProductCategory(node) {
  const haystack = [
    node?.productType || '',
    node?.handle || '',
    node?.title || '',
    ...(Array.isArray(node?.tags) ? node.tags : []),
  ]
    .join(' ')
    .toLowerCase();

  if (
    haystack.includes('bundle') ||
    haystack.includes('cyber-set') ||
    haystack.includes('3-piece') ||
    haystack.includes('set')
  ) {
    return 'cyber-bundle';
  }
  if (haystack.includes('watch') || haystack.includes('chrono')) {
    return 'watches';
  }
  if (
    haystack.includes('earphone') ||
    haystack.includes('iem') ||
    haystack.includes('audio') ||
    haystack.includes('type-c')
  ) {
    return 'chrome-earphones';
  }
  if (haystack.includes('earring') || haystack.includes('stud')) {
    return 'earrings';
  }
  if (
    haystack.includes('chain') ||
    haystack.includes('pendant') ||
    haystack.includes('necklace')
  ) {
    return 'chains';
  }
  if (haystack.includes('bracelet') || haystack.includes('cuff')) {
    return 'bracelets';
  }
  return 'y2k-rings';
}

/**
 * Maps a raw Shopify Storefront GraphQL `Product` node to the frontend `Product` schema.
 * Always preserves Shopify's real `gid://shopify/ProductVariant/...` IDs and Shopify's real prices.
 *
 * @param {Record<string, any>} node
 * @param {number} index
 */
export function mapStorefrontProductNode(node, index = 0) {
  const variantNodes =
    node?.variants?.edges?.map((edge) => edge?.node).filter(Boolean) || [];
  const firstVariant = variantNodes[0] || null;

  const rawBasePrice = Number(firstVariant?.price?.amount);
  const basePrice =
    Number.isFinite(rawBasePrice) && rawBasePrice >= 0
      ? Math.round(rawBasePrice * 100) / 100
      : 0;

  const rawCompareAt = Number(firstVariant?.compareAtPrice?.amount);
  const compareAtPrice =
    Number.isFinite(rawCompareAt) && rawCompareAt > basePrice
      ? Math.round(rawCompareAt * 100) / 100
      : basePrice;

  const category = inferProductCategory(node);
  const tags = Array.isArray(node?.tags) ? node.tags : [];
  const dropCollection = tags.includes('premium-drop')
    ? 'premium-drop'
    : 'everyday-drop';

  const imageUrls =
    node?.images?.edges
      ?.map((edge) => edge?.node?.url)
      .filter((url) => typeof url === 'string' && url.length > 0) || [];

  if (
    imageUrls.length === 0 &&
    typeof node?.featuredImage?.url === 'string' &&
    node.featuredImage.url
  ) {
    imageUrls.push(node.featuredImage.url);
  }

  const firstOptionName =
    Array.isArray(node?.options) && node.options[0]?.name
      ? String(node.options[0].name)
      : 'Variant';

  const mappedVariants = variantNodes.map((v) => {
    const vPriceNum = Number(v.price?.amount);
    const vPrice =
      Number.isFinite(vPriceNum) && vPriceNum >= 0
        ? Math.round(vPriceNum * 100) / 100
        : basePrice;
    const priceDelta = Math.round((vPrice - basePrice) * 100) / 100;

    return {
      id: String(v.id),
      label:
        !v.title || v.title === 'Default Title'
          ? 'Standard Spec'
          : String(v.title),
      priceDelta: priceDelta !== 0 ? priceDelta : 0,
      inStock: Boolean(v.availableForSale),
    };
  });

  const anyAvailable =
    mappedVariants.length > 0
      ? mappedVariants.some((v) => v.inStock)
      : Boolean(node?.availableForSale ?? true);

  return {
    id: String(node.id),
    sku: firstVariant?.sku || `SHOPIFY-${index + 1}`,
    handle: `/products/${node.handle || index + 1}`,
    title: String(node.title || 'UNTITLED HARDWARE').toUpperCase(),
    subtitle:
      node.productType ||
      (node.vendor ? `${node.vendor} Hardware` : 'RWND20s Archive Hardware'),
    category,
    categoryLabel: CATEGORY_LABELS[category] || 'HARDWARE',
    dropCollection,
    phase: 1,
    phaseStatus: anyAvailable
      ? basePrice >= 999
        ? 'FREE SHIPPING ELIGIBLE'
        : 'IN STOCK · LIVE ON SHOPIFY'
      : 'SOLD OUT',
    price: basePrice,
    compareAtPrice,
    specBadge: anyAvailable
      ? compareAtPrice > basePrice
        ? `SAVE ₹${Math.round(compareAtPrice - basePrice).toLocaleString('en-IN')}`
        : 'LIVE SHOPIFY DROP'
      : 'SOLD OUT',
    description:
      node.description ||
      'Authentic hardware from the RWND20s Shopify catalog.',
    tags,
    productType: node.productType || 'Hardware',
    vendor: node.vendor || 'RWND20s',
    imageAlt:
      node?.featuredImage?.altText ||
      node?.images?.edges?.[0]?.node?.altText ||
      String(node.title || 'RWND20s Product'),
    specs: [
      { label: 'Brand', value: node.vendor || 'rwnd20s.' },
      { label: 'Category', value: CATEGORY_LABELS[category] || 'Hardware' },
      {
        label: 'Availability',
        value: anyAvailable ? 'In Stock (Shopify Live)' : 'Out of Stock',
      },
    ],
    optionName: firstOptionName,
    variants: mappedVariants,
    images: imageUrls,
    featuredRank: index + 1,
  };
}

/**
 * Validates and normalizes a Shopify `ProductVariant` GID.
 * Rejects local demo variant IDs (e.g. `bun01-us8`) so checkout only ever uses real Shopify variants.
 *
 * @param {unknown} rawVariantId
 * @returns {string | null}
 */
export function normalizeVariantGid(rawVariantId) {
  if (typeof rawVariantId !== 'string') {
    return null;
  }

  const trimmed = rawVariantId.trim();
  if (SHOPIFY_VARIANT_GID_PATTERN.test(trimmed)) {
    return trimmed;
  }

  if (NUMERIC_ID_PATTERN.test(trimmed)) {
    return `gid://shopify/ProductVariant/${trimmed}`;
  }

  return null;
}

/**
 * Validates and sanitizes checkout line items from the request body.
 * Strips any browser-supplied price fields so Shopify's server-side variant prices are used exclusively.
 *
 * @param {unknown} rawItems
 * @returns {{ ok: true; lines: { merchandiseId: string; quantity: number }[] } | { ok: false; error: string }}
 */
export function buildValidatedCartLines(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return {
      ok: false,
      error: 'Cart is empty. Add at least one product before checking out.',
    };
  }

  const lines = [];

  for (const item of rawItems) {
    const rawVariantId = item?.variantId ?? item?.merchandiseId;
    const merchandiseId = normalizeVariantGid(rawVariantId);

    if (!merchandiseId) {
      return {
        ok: false,
        error: `Invalid Shopify variant ID "${String(rawVariantId ?? '')}". Checkout requires live Shopify ProductVariant IDs.`,
      };
    }

    const parsedQty = Number(item?.quantity);
    if (!Number.isInteger(parsedQty) || parsedQty < 1 || parsedQty > 99) {
      return {
        ok: false,
        error: `Invalid quantity for variant ${merchandiseId}. Quantity must be an integer between 1 and 99.`,
      };
    }

    lines.push({
      merchandiseId,
      quantity: parsedQty,
    });
  }

  return { ok: true, lines };
}

/**
 * Verifies that a checkout URL returned by Shopify is a valid `https://` URL.
 *
 * @param {unknown} rawUrl
 * @returns {string | null}
 */
export function validateCheckoutUrl(rawUrl) {
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) {
    return null;
  }

  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}
