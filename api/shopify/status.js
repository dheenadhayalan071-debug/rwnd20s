import {
  getStorefrontConfig,
  executeStorefrontGraphQL,
  sendJsonResponse,
  STOREFRONT_STATUS_QUERY,
} from './_storefront.js';

/**
 * Vercel Serverless Function: `GET /api/shopify/status`
 *
 * Verifies connection to the configured Shopify Storefront API (`2026-01`)
 * on `SHOPIFY_STORE_DOMAIN` (`00w7hv-n6.myshopify.com`) using the server-side
 * `SHOPIFY_STOREFRONT_ACCESS_TOKEN`.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJsonResponse(res, 405, {
      connected: false,
      mode: 'error',
      error: 'Method Not Allowed. Use GET.',
    });
  }

  const config = getStorefrontConfig();

  if (!config.hasStoreDomain || !config.storeDomain) {
    return sendJsonResponse(res, 200, {
      connected: false,
      mode: 'unconfigured',
      apiVersion: config.apiVersion,
      storeDomain: null,
      shopName: null,
      currencyCode: 'INR',
      productCount: 0,
      storefrontConnected: false,
      error:
        'Invalid or missing SHOPIFY_STORE_DOMAIN. Expected a valid *.myshopify.com domain (e.g., 00w7hv-n6.myshopify.com).',
      message:
        'Invalid or missing SHOPIFY_STORE_DOMAIN. Set SHOPIFY_STORE_DOMAIN=00w7hv-n6.myshopify.com in Vercel Environment Variables.',
    });
  }

  if (!config.hasStorefrontToken) {
    return sendJsonResponse(res, 200, {
      connected: false,
      mode: 'unconfigured',
      apiVersion: config.apiVersion,
      storeDomain: config.storeDomain,
      shopName: null,
      currencyCode: 'INR',
      productCount: 0,
      storefrontConnected: false,
      error:
        'SHOPIFY_STOREFRONT_ACCESS_TOKEN is not configured on the server.',
      message: `Shopify Storefront token is missing for ${config.storeDomain}. Add SHOPIFY_STOREFRONT_ACCESS_TOKEN in your Vercel Environment Variables and redeploy.`,
    });
  }

  const result = await executeStorefrontGraphQL({
    storeDomain: config.storeDomain,
    storefrontToken: config.storefrontToken,
    query: STOREFRONT_STATUS_QUERY,
  });

  if (!result.ok || !result.data?.shop) {
    const errMsg =
      result.error ||
      `Unable to verify Storefront API connection with ${config.storeDomain}.`;

    return sendJsonResponse(res, 200, {
      connected: false,
      mode: 'error',
      apiVersion: config.apiVersion,
      storeDomain: config.storeDomain,
      shopName: null,
      currencyCode: 'INR',
      productCount: 0,
      storefrontConnected: false,
      error: errMsg,
      message: `Shopify connection error (${config.storeDomain}): ${errMsg}`,
    });
  }

  const shop = result.data.shop;
  const remoteProductCount = Array.isArray(result.data.products?.edges)
    ? result.data.products.edges.length
    : 0;
  const currencyCode = shop.paymentSettings?.currencyCode || 'INR';

  return sendJsonResponse(res, 200, {
    connected: true,
    mode: 'shopify-live',
    apiVersion: config.apiVersion,
    storeDomain: config.storeDomain,
    shopName: shop.name || config.storeDomain,
    primaryDomainUrl: shop.primaryDomain?.url || `https://${config.storeDomain}`,
    currencyCode,
    productCount: remoteProductCount,
    remoteProductCount,
    storefrontConnected: true,
    error: null,
    message:
      remoteProductCount > 0
        ? `Connected to ${shop.name || config.storeDomain} via Storefront API (${config.apiVersion}) · ${remoteProductCount} live products available.`
        : `Connected to ${shop.name || config.storeDomain} via Storefront API (${config.apiVersion}), but 0 products are published to the Storefront channel.`,
  });
}
