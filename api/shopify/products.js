import {
  getStorefrontConfig,
  executeStorefrontGraphQL,
  sendJsonResponse,
  STOREFRONT_PRODUCTS_QUERY,
  mapStorefrontProductNode,
} from './_storefront.js';

/**
 * Vercel Serverless Function: `GET /api/shopify/products`
 *
 * Loads live catalog products from Shopify Storefront API (`2026-01`) for
 * `SHOPIFY_STORE_DOMAIN` (`00w7hv-n6.myshopify.com`).
 *
 * Never silently substitutes demo products when the connection fails or is unconfigured.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJsonResponse(res, 405, {
      connected: false,
      products: [],
      error: 'Method Not Allowed. Use GET.',
    });
  }

  const config = getStorefrontConfig();

  if (!config.hasStoreDomain || !config.storeDomain) {
    return sendJsonResponse(res, 503, {
      connected: false,
      source: 'error',
      apiVersion: config.apiVersion,
      storeDomain: null,
      products: [],
      error:
        'Invalid or missing SHOPIFY_STORE_DOMAIN environment variable on server.',
    });
  }

  if (!config.hasStorefrontToken) {
    return sendJsonResponse(res, 503, {
      connected: false,
      source: 'error',
      apiVersion: config.apiVersion,
      storeDomain: config.storeDomain,
      products: [],
      error: `Shopify Storefront connection is not configured for ${config.storeDomain}. Set SHOPIFY_STORE_DOMAIN=${config.storeDomain} and SHOPIFY_STOREFRONT_ACCESS_TOKEN in Vercel Environment Variables.`,
    });
  }

  const result = await executeStorefrontGraphQL({
    storeDomain: config.storeDomain,
    storefrontToken: config.storefrontToken,
    query: STOREFRONT_PRODUCTS_QUERY,
    variables: { first: 50 },
  });

  if (!result.ok || !result.data?.products) {
    const errorMsg =
      result.error ||
      `Failed to load products from Shopify Storefront API (${config.storeDomain}).`;

    return sendJsonResponse(res, 502, {
      connected: false,
      source: 'error',
      apiVersion: config.apiVersion,
      storeDomain: config.storeDomain,
      products: [],
      error: errorMsg,
    });
  }

  const rawNodes =
    result.data.products.edges
      ?.map((edge) => edge?.node)
      .filter(Boolean) || [];

  const products = rawNodes.map((node, index) =>
    mapStorefrontProductNode(node, index)
  );

  return sendJsonResponse(res, 200, {
    connected: true,
    source: 'shopify-storefront',
    apiVersion: config.apiVersion,
    storeDomain: config.storeDomain,
    shopName: result.data.shop?.name || config.storeDomain,
    currencyCode:
      result.data.shop?.paymentSettings?.currencyCode || 'INR',
    products,
    error: null,
  });
}
