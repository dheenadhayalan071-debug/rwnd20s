import {
  getStorefrontConfig,
  executeStorefrontGraphQL,
  sendJsonResponse,
  STOREFRONT_CART_CREATE_MUTATION,
  buildValidatedCartLines,
  validateCheckoutUrl,
} from './_storefront.js';

/**
 * Parses JSON body safely whether `req.body` is already parsed by Vercel/Express
 * or arrives as a raw string/stream.
 */
async function parseRequestBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string' && req.body.trim()) {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  if (typeof req.on === 'function') {
    return new Promise((resolve) => {
      let raw = '';
      req.on('data', (chunk) => {
        raw += chunk;
      });
      req.on('end', () => {
        if (!raw.trim()) {
          resolve({});
          return;
        }
        try {
          resolve(JSON.parse(raw));
        } catch {
          resolve(null);
        }
      });
      req.on('error', () => resolve(null));
    });
  }
  return {};
}

/**
 * Vercel Serverless Function: `POST /api/shopify/checkout`
 *
 * Creates a live Shopify Cart via Storefront API `cartCreate` (`2026-01`)
 * using ONLY Shopify `ProductVariant` GIDs and quantities (never browser-supplied prices)
 * and returns the verified Shopify `checkoutUrl`.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJsonResponse(res, 405, {
      ok: false,
      checkoutUrl: null,
      error: 'Method Not Allowed. Use POST.',
    });
  }

  const config = getStorefrontConfig();

  if (!config.hasStoreDomain || !config.storeDomain) {
    return sendJsonResponse(res, 503, {
      ok: false,
      checkoutUrl: null,
      error:
        'Invalid or missing SHOPIFY_STORE_DOMAIN environment variable on server.',
    });
  }

  if (!config.hasStorefrontToken) {
    return sendJsonResponse(res, 503, {
      ok: false,
      checkoutUrl: null,
      error: `Shopify checkout is unavailable because SHOPIFY_STOREFRONT_ACCESS_TOKEN is not configured for ${config.storeDomain}.`,
    });
  }

  const body = await parseRequestBody(req);
  if (!body || typeof body !== 'object') {
    return sendJsonResponse(res, 400, {
      ok: false,
      checkoutUrl: null,
      error: 'Invalid JSON request body.',
    });
  }

  const validation = buildValidatedCartLines(body.items);
  if (!validation.ok) {
    return sendJsonResponse(res, 400, {
      ok: false,
      checkoutUrl: null,
      error: validation.error,
    });
  }

  const cartInput = {
    lines: validation.lines,
    attributes: [{ key: 'Storefront', value: 'rwnd20s-web' }],
  };

  const discountCode =
    typeof body.discountCode === 'string' && body.discountCode.trim()
      ? body.discountCode.trim()
      : typeof body.welcomeDiscountCode === 'string' &&
          body.welcomeDiscountCode.trim()
        ? body.welcomeDiscountCode.trim()
        : null;

  if (discountCode) {
    cartInput.discountCodes = [discountCode];
  }

  if (typeof body.customerEmail === 'string' && body.customerEmail.trim()) {
    cartInput.buyerIdentity = {
      email: body.customerEmail.trim(),
      countryCode: 'IN',
    };
  }

  const result = await executeStorefrontGraphQL({
    storeDomain: config.storeDomain,
    storefrontToken: config.storefrontToken,
    query: STOREFRONT_CART_CREATE_MUTATION,
    variables: { input: cartInput },
  });

  if (!result.ok) {
    return sendJsonResponse(res, 502, {
      ok: false,
      checkoutUrl: null,
      error:
        result.error ||
        `Shopify Storefront cartCreate failed on ${config.storeDomain}.`,
    });
  }

  const cartCreate = result.data?.cartCreate;
  const userErrors = Array.isArray(cartCreate?.userErrors)
    ? cartCreate.userErrors
    : [];

  if (userErrors.length > 0) {
    const combinedError = userErrors
      .map((u) => u?.message)
      .filter(Boolean)
      .join(' ');
    return sendJsonResponse(res, 400, {
      ok: false,
      checkoutUrl: null,
      error:
        combinedError ||
        'Shopify rejected the cart items. Verify that the variants are available for sale.',
    });
  }

  const verifiedCheckoutUrl = validateCheckoutUrl(
    cartCreate?.cart?.checkoutUrl
  );

  if (!verifiedCheckoutUrl) {
    return sendJsonResponse(res, 502, {
      ok: false,
      checkoutUrl: null,
      error:
        'Shopify did not return a valid checkout URL for this cart.',
    });
  }

  return sendJsonResponse(res, 200, {
    ok: true,
    mode: 'shopify-live',
    cartId: cartCreate.cart.id || null,
    checkoutUrl: verifiedCheckoutUrl,
    totalQuantity: cartCreate.cart.totalQuantity ?? null,
    cost: cartCreate.cart.cost ?? null,
    discountApplied: discountCode,
    error: null,
  });
}
