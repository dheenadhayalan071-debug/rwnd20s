import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import { LOCAL_ARCHIVE_PRODUCTS } from './src/services/shopify';
import {
  normalizeShopifyDomain,
  generateShopifyProductsCsv,
  buildShopifyCartPermalink,
} from './src/utils/shopifyCatalogCsv';
import {
  type CategoryHandle,
  type Product,
  WELCOME_INSTANT_CODE,
} from './src/utils/catalogLogic';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const SHOPIFY_API_VERSION = '2026-10';

function getShopifyCredentials() {
  const rawDomain =
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.VITE_SHOPIFY_STORE_DOMAIN ||
    '';
  const storeDomain = normalizeShopifyDomain(rawDomain);

  const storefrontToken = (
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    process.env.VITE_SHOPIFY_STOREFRONT_TOKEN ||
    ''
  ).trim();

  const adminToken = (
    process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ||
    process.env.SHOPIFY_ADMIN_TOKEN ||
    process.env.VITE_SHOPIFY_ADMIN_TOKEN ||
    process.env.SHOPIFY_ACCESS_TOKEN ||
    ''
  ).trim();

  const detectedShopifyEnvKeys = Object.keys(process.env).filter((k) =>
    k.toLowerCase().includes('shopify')
  );

  return {
    storeDomain,
    storefrontToken,
    adminToken,
    detectedShopifyEnvKeys,
    hasStoreDomain: Boolean(storeDomain),
    hasStorefrontToken: Boolean(
      storefrontToken && storefrontToken !== 'MY_SHOPIFY_STOREFRONT_TOKEN'
    ),
    hasAdminToken: Boolean(
      adminToken && adminToken !== 'MY_SHOPIFY_ADMIN_ACCESS_TOKEN'
    ),
  };
}

async function queryShopifyStorefront<T>(
  storeDomain: string,
  storefrontToken: string,
  query: string,
  variables: Record<string, unknown> = {}
): Promise<{ data: T | null; errors?: unknown; statusCode: number }> {
  const endpoint = `https://${storeDomain}/api/${SHOPIFY_API_VERSION}/graphql.json`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = (await response.json().catch(() => null)) as {
    data?: T;
    errors?: unknown;
  } | null;

  return {
    data: json?.data ?? null,
    errors: json?.errors,
    statusCode: response.status,
  };
}

const STOREFRONT_SHOP_AND_PRODUCTS_QUERY = `
  query GetShopAndCatalog {
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

const STOREFRONT_CART_CREATE_MUTATION = `
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

interface StorefrontProductNode {
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

function mapStorefrontNodesToCatalog(nodes: StorefrontProductNode[]): Product[] {
  if (!nodes || nodes.length === 0) {
    return LOCAL_ARCHIVE_PRODUCTS;
  }

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

  return nodes.map((node, idx) => {
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
    const rawCompareAt = Math.round(
      Number(firstVar?.compareAtPrice?.amount || 0)
    );
    const compareAtPrice =
      rawCompareAt > basePrice
        ? rawCompareAt
        : matchedLocal?.compareAtPrice || Math.round(basePrice * 2);

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

    const remoteImgs =
      node.images?.edges?.map((e) => e.node.url).filter(Boolean) || [];

    const tags =
      node.tags && node.tags.length > 0
        ? node.tags
        : matchedLocal?.tags || ['y2k', 'everyday-drop'];

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
      phaseStatus: matchedLocal?.phaseStatus || 'LIVE SHOPIFY DROP',
      stockCount: matchedLocal?.stockCount ?? 30,
      price: basePrice,
      compareAtPrice,
      specBadge: matchedLocal?.specBadge || 'LIVE IN STORE',
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
        })) ||
        matchedLocal?.variants || [
          { id: `${node.id}-v1`, label: 'Standard Spec', inStock: true },
        ],
      images:
        remoteImgs.length > 0
          ? remoteImgs
          : matchedLocal?.images ||
            LOCAL_ARCHIVE_PRODUCTS[idx % LOCAL_ARCHIVE_PRODUCTS.length].images,
      featuredRank: matchedLocal?.featuredRank ?? idx + 1,
    };
  });
}

async function startServer() {
  const app = express();
  app.use(express.json());

  /**
   * GET /api/shopify/status
   * Checks live connection state with the configured Shopify store.
   */
  app.get('/api/shopify/status', async (_req, res) => {
    const creds = getShopifyCredentials();

    if (!creds.hasStoreDomain) {
      res.json({
        connected: false,
        mode: 'local-archive',
        storeDomain: null,
        shopName: null,
        currencyCode: 'INR',
        productCount: LOCAL_ARCHIVE_PRODUCTS.length,
        storefrontConnected: false,
        adminSyncAvailable: false,
        message:
          'Running on the built-in 7-drop RWND20s Archive Catalog. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in AI Studio Secrets to connect your live Shopify store.',
      });
      return;
    }

    if (creds.hasStorefrontToken) {
      try {
        const result = await queryShopifyStorefront<{
          shop?: {
            name?: string;
            primaryDomain?: { url?: string; host?: string };
            paymentSettings?: { currencyCode?: string };
          };
          products?: { edges?: { node: StorefrontProductNode }[] };
        }>(
          creds.storeDomain,
          creds.storefrontToken,
          STOREFRONT_SHOP_AND_PRODUCTS_QUERY
        );

        if (result.data?.shop) {
          const remoteCount = result.data.products?.edges?.length || 0;
          res.json({
            connected: true,
            mode: 'shopify-live',
            storeDomain: creds.storeDomain,
            shopName: result.data.shop.name || creds.storeDomain,
            currencyCode:
              result.data.shop.paymentSettings?.currencyCode || 'INR',
            productCount:
              remoteCount > 0 ? remoteCount : LOCAL_ARCHIVE_PRODUCTS.length,
            remoteProductCount: remoteCount,
            storefrontConnected: true,
            adminSyncAvailable: creds.hasAdminToken,
            message:
              remoteCount > 0
                ? `Connected to ${result.data.shop.name} (${remoteCount} live products synced).`
                : `Connected to ${result.data.shop.name}. Store has 0 published products—use Push 7 Archive Products or Import CSV to populate your catalog.`,
          });
          return;
        }
      } catch (err) {
        // Fall through to Admin check or domain-only status
      }
    }

    if (creds.hasAdminToken) {
      try {
        const adminResp = await fetch(
          `https://${creds.storeDomain}/admin/api/${SHOPIFY_API_VERSION}/shop.json`,
          {
            headers: {
              'X-Shopify-Access-Token': creds.adminToken,
              'Content-Type': 'application/json',
            },
          }
        );
        if (adminResp.ok) {
          const adminJson = (await adminResp.json()) as {
            shop?: { name?: string; currency?: string };
          };
          res.json({
            connected: true,
            mode: 'shopify-admin-connected',
            storeDomain: creds.storeDomain,
            shopName: adminJson.shop?.name || creds.storeDomain,
            currencyCode: adminJson.shop?.currency || 'INR',
            productCount: LOCAL_ARCHIVE_PRODUCTS.length,
            storefrontConnected: false,
            adminSyncAvailable: true,
            message: `Connected to ${adminJson.shop?.name || creds.storeDomain} via Admin API. Ready to push all 7 RWND20s products & create Draft Orders.`,
          });
          return;
        }
      } catch {
        // Fall through
      }
    }

    res.json({
      connected: false,
      mode: 'domain-configured',
      storeDomain: creds.storeDomain,
      shopName: creds.storeDomain,
      currencyCode: 'INR',
      productCount: LOCAL_ARCHIVE_PRODUCTS.length,
      storefrontConnected: false,
      adminSyncAvailable: creds.hasAdminToken,
      message: `Store domain (${creds.storeDomain}) detected, awaiting valid SHOPIFY_STOREFRONT_ACCESS_TOKEN or SHOPIFY_ADMIN_ACCESS_TOKEN.`,
    });
  });

  /**
   * GET /api/shopify/products
   * Returns live products from Shopify Storefront API or Admin API, falling back to LOCAL_ARCHIVE_PRODUCTS.
   */
  app.get('/api/shopify/products', async (_req, res) => {
    const creds = getShopifyCredentials();

    if (creds.hasStoreDomain && creds.hasStorefrontToken) {
      try {
        const result = await queryShopifyStorefront<{
          products?: { edges?: { node: StorefrontProductNode }[] };
        }>(
          creds.storeDomain,
          creds.storefrontToken,
          STOREFRONT_SHOP_AND_PRODUCTS_QUERY
        );

        const nodes =
          result.data?.products?.edges?.map((edge) => edge.node) || [];
        if (nodes.length > 0) {
          res.json({
            source: 'shopify-storefront',
            storeDomain: creds.storeDomain,
            products: mapStorefrontNodesToCatalog(nodes),
          });
          return;
        }
      } catch {
        // Fallback below
      }
    }

    res.json({
      source: 'local-archive',
      storeDomain: creds.storeDomain || null,
      products: LOCAL_ARCHIVE_PRODUCTS,
    });
  });

  /**
   * POST /api/shopify/checkout
   * Creates a live Shopify Storefront Cart (or Admin Draft Order) with automatic 5% Welcome Offer discount support.
   */
  app.post('/api/shopify/checkout', async (req, res) => {
    const creds = getShopifyCredentials();
    const {
      items = [],
      welcomeDiscountCode,
      customerEmail,
      paymentMethod = 'prepaid',
    } = req.body as {
      items?: {
        variantId: string;
        title?: string;
        variantLabel?: string;
        unitPrice?: number;
        quantity: number;
      }[];
      welcomeDiscountCode?: string | null;
      customerEmail?: string | null;
      paymentMethod?: 'prepaid' | 'cod';
    };

    const referenceId = `RWND-${Math.floor(100000 + Math.random() * 900000)}`;

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Cart is empty.' });
      return;
    }

    // 1. Try Shopify Storefront API cartCreate
    if (creds.hasStoreDomain && creds.hasStorefrontToken) {
      const hasShopifyGids = items.every((item) =>
        String(item.variantId).startsWith('gid://shopify/ProductVariant/')
      );

      if (hasShopifyGids) {
        try {
          const lines = items.map((item) => ({
            merchandiseId: item.variantId,
            quantity: Math.max(1, Number(item.quantity) || 1),
          }));

          const cartInput: Record<string, unknown> = {
            lines,
            attributes: [
              { key: 'Storefront', value: 'rwnd20s-archive' },
              { key: 'Preferred_Payment', value: paymentMethod.toUpperCase() },
            ],
          };

          if (welcomeDiscountCode) {
            cartInput.discountCodes = [welcomeDiscountCode];
          }

          if (customerEmail) {
            cartInput.buyerIdentity = {
              email: customerEmail,
              countryCode: 'IN',
            };
          }

          const result = await queryShopifyStorefront<{
            cartCreate?: {
              cart?: { id: string; checkoutUrl?: string };
              userErrors?: { field?: string[]; message: string }[];
            };
          }>(
            creds.storeDomain,
            creds.storefrontToken,
            STOREFRONT_CART_CREATE_MUTATION,
            { input: cartInput }
          );

          const checkoutUrl = result.data?.cartCreate?.cart?.checkoutUrl;
          if (checkoutUrl) {
            res.json({
              mode: 'shopify-live',
              checkoutUrl,
              referenceId,
              discountApplied: welcomeDiscountCode || null,
            });
            return;
          }
        } catch {
          // Continue to fallback
        }
      }
    }

    // 2. Try Shopify Admin API Draft Order (works even when variants are local SKUs!)
    if (creds.hasStoreDomain && creds.hasAdminToken) {
      try {
        const lineItems = items.map((item) => ({
          title: item.title || 'RWND20s Hardware',
          variant_title: item.variantLabel || 'Standard Spec',
          price: String(item.unitPrice || 549),
          quantity: Math.max(1, Number(item.quantity) || 1),
          requires_shipping: true,
        }));

        const draftOrderPayload: Record<string, unknown> = {
          draft_order: {
            line_items: lineItems,
            email: customerEmail || undefined,
            tags: `rwnd20s, ${paymentMethod}`,
            note: `Order Ref: ${referenceId} | Payment: ${paymentMethod.toUpperCase()}`,
            applied_discount: welcomeDiscountCode
              ? {
                  title: `Welcome Pass (${welcomeDiscountCode})`,
                  description: '5% Instant Welcome Offer',
                  value: '5.0',
                  value_type: 'percentage',
                }
              : undefined,
          },
        };

        const adminResp = await fetch(
          `https://${creds.storeDomain}/admin/api/${SHOPIFY_API_VERSION}/draft_orders.json`,
          {
            method: 'POST',
            headers: {
              'X-Shopify-Access-Token': creds.adminToken,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(draftOrderPayload),
          }
        );

        if (adminResp.ok) {
          const adminJson = (await adminResp.json()) as {
            draft_order?: { invoice_url?: string; id?: number };
          };
          if (adminJson.draft_order?.invoice_url) {
            res.json({
              mode: 'shopify-live',
              checkoutUrl: adminJson.draft_order.invoice_url,
              referenceId: `RWND-${adminJson.draft_order.id || referenceId}`,
              discountApplied: welcomeDiscountCode || null,
            });
            return;
          }
        }
      } catch {
        // Continue to permalink / local fallback
      }
    }

    // 3. Try direct Shopify Cart Permalink if variant IDs are numeric or GIDs
    if (creds.hasStoreDomain) {
      const permalink = buildShopifyCartPermalink(
        creds.storeDomain,
        items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        welcomeDiscountCode || undefined
      );
      if (permalink) {
        res.json({
          mode: 'shopify-live',
          checkoutUrl: permalink,
          referenceId,
          discountApplied: welcomeDiscountCode || null,
        });
        return;
      }
    }

    // 4. Local Preview Checkout Fallback
    res.json({
      mode: 'local-preview',
      checkoutUrl: null,
      referenceId,
      discountApplied: welcomeDiscountCode || WELCOME_INSTANT_CODE,
    });
  });

  /**
   * POST /api/shopify/sync-catalog
   * Pushes all 7 RWND20s Archive Products (with doubled Stash Prices) to the connected Shopify store via Admin API.
   */
  app.post('/api/shopify/sync-catalog', async (_req, res) => {
    const creds = getShopifyCredentials();

    if (!creds.hasStoreDomain || !creds.hasAdminToken) {
      res.status(400).json({
        success: false,
        message:
          'To auto-push products via API, configure SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN in AI Studio Secrets, or click "Download Shopify Products CSV" to import all 7 products in Shopify Admin → Products → Import.',
      });
      return;
    }

    const syncedTitles: string[] = [];
    const errors: string[] = [];

    for (const product of LOCAL_ARCHIVE_PRODUCTS) {
      const cleanHandle = product.handle.replace(/^\/products\//, '').trim();
      const bulletHtml =
        product.shortBullets && product.shortBullets.length > 0
          ? `<ul>${product.shortBullets.map((b) => `<li>${b}</li>`).join('')}</ul>`
          : '';
      const careHtml = product.careNote
        ? `<p><strong>Care:</strong> ${product.careNote}</p>`
        : '';

      const payload = {
        product: {
          title: product.title,
          handle: cleanHandle,
          body_html: `<p>${product.description}</p>${bulletHtml}${careHtml}`,
          vendor: product.vendor || 'RWND20s',
          product_type: product.productType || 'Hardware',
          tags: (product.tags || []).join(', '),
          status: 'active',
          options: [{ name: product.optionName || 'Option' }],
          variants: product.variants.map((v, idx) => ({
            option1: v.label,
            price: String((product.price + (v.priceDelta || 0)).toFixed(2)),
            compare_at_price: String(
              (product.compareAtPrice + (v.priceDelta || 0)).toFixed(2)
            ),
            sku:
              product.variants.length > 1
                ? `${product.sku}-${idx + 1}`
                : product.sku,
            inventory_management: 'shopify',
            inventory_quantity: product.stockCount ?? 25,
          })),
        },
      };

      try {
        const resp = await fetch(
          `https://${creds.storeDomain}/admin/api/${SHOPIFY_API_VERSION}/products.json`,
          {
            method: 'POST',
            headers: {
              'X-Shopify-Access-Token': creds.adminToken,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          }
        );

        if (resp.ok) {
          syncedTitles.push(product.title);
        } else {
          const errText = await resp.text();
          errors.push(`${product.sku}: ${resp.status} ${errText.slice(0, 120)}`);
        }
      } catch (err) {
        errors.push(
          `${product.sku}: ${err instanceof Error ? err.message : 'Network error'}`
        );
      }
    }

    res.json({
      success: syncedTitles.length > 0,
      syncedCount: syncedTitles.length,
      syncedTitles,
      errors,
      message:
        syncedTitles.length > 0
          ? `Synced ${syncedTitles.length} of ${LOCAL_ARCHIVE_PRODUCTS.length} RWND20s products (with doubled Stash Prices) to ${creds.storeDomain}.`
          : `Could not sync products to ${creds.storeDomain}. Check Admin API permissions (write_products).`,
    });
  });

  /**
   * GET /api/shopify/export-csv
   * Downloads an official Shopify Products CSV file with all 7 drops and doubled Stash Prices.
   */
  app.get('/api/shopify/export-csv', (_req, res) => {
    const csvContent = generateShopifyProductsCsv(LOCAL_ARCHIVE_PRODUCTS);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="rwnd20s-shopify-products.csv"'
    );
    res.send(csvContent);
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `[rwnd20s.] Server & Shopify Proxy listening on http://0.0.0.0:${PORT}`
    );
  });
}

startServer();
