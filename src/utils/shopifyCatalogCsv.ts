import { type Product } from './catalogLogic';

/**
 * Normalizes a Shopify store domain (e.g. "https://rwnd20s.myshopify.com/" -> "rwnd20s.myshopify.com")
 */
export function normalizeShopifyDomain(rawDomain?: string | null): string {
  if (!rawDomain) return '';
  const cleaned = rawDomain
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .trim()
    .toLowerCase();

  if (
    !cleaned ||
    cleaned === 'my_shopify_store_domain' ||
    cleaned === 'your-store.myshopify.com'
  ) {
    return '';
  }

  return cleaned;
}

/**
 * Escapes a field for RFC-4180 CSV output
 */
function escapeCsvField(value: string | number | boolean | undefined | null): string {
  const str = value === undefined || value === null ? '' : String(value);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generates an official Shopify-compatible Products CSV containing all RWND20s products,
 * variants, MRP prices, and doubled Stash Prices (Variant Compare At Price).
 */
export function generateShopifyProductsCsv(products: Product[]): string {
  const headers = [
    'Handle',
    'Title',
    'Body (HTML)',
    'Vendor',
    'Product Category',
    'Type',
    'Tags',
    'Published',
    'Option1 Name',
    'Option1 Value',
    'Variant SKU',
    'Variant Grams',
    'Variant Inventory Tracker',
    'Variant Inventory Qty',
    'Variant Inventory Policy',
    'Variant Fulfillment Service',
    'Variant Price',
    'Variant Compare At Price',
    'Variant Requires Shipping',
    'Variant Taxable',
    'SEO Title',
    'SEO Description',
    'Status',
  ];

  const rows: string[] = [headers.map(escapeCsvField).join(',')];

  for (const product of products) {
    const cleanHandle = product.handle.replace(/^\/products\//, '').trim();
    const bulletHtml =
      product.shortBullets && product.shortBullets.length > 0
        ? `<ul>${product.shortBullets.map((b) => `<li>${b}</li>`).join('')}</ul>`
        : '';
    const careHtml = product.careNote ? `<p><strong>Care:</strong> ${product.careNote}</p>` : '';
    const bodyHtml = `<p>${product.description}</p>${bulletHtml}${careHtml}`;
    const tagsJoined = (product.tags || []).join(', ');
    const variants =
      product.variants && product.variants.length > 0
        ? product.variants
        : [{ id: `${product.id}-default`, label: 'Default Title', priceDelta: 0, inStock: true }];

    variants.forEach((variant, index) => {
      const isFirstRow = index === 0;
      const variantPrice = product.price + (variant.priceDelta || 0);
      const variantCompareAt = product.compareAtPrice + (variant.priceDelta || 0);
      const variantSku =
        variants.length > 1 ? `${product.sku}-${index + 1}` : product.sku;

      const row = [
        cleanHandle,
        isFirstRow ? product.title : '',
        isFirstRow ? bodyHtml : '',
        isFirstRow ? product.vendor || 'RWND20s' : '',
        isFirstRow ? 'Apparel & Accessories > Jewelry' : '',
        isFirstRow ? product.productType || 'Hardware' : '',
        isFirstRow ? tagsJoined : '',
        isFirstRow ? 'TRUE' : '',
        isFirstRow ? product.optionName || 'Title' : '',
        variant.label,
        variantSku,
        '85',
        'shopify',
        product.stockCount ?? 25,
        'deny',
        'manual',
        variantPrice.toFixed(2),
        variantCompareAt.toFixed(2),
        'TRUE',
        'TRUE',
        isFirstRow ? product.seoTitle || `${product.title} | RWND20s` : '',
        isFirstRow ? product.seoDescription || product.description : '',
        isFirstRow ? 'active' : '',
      ];

      rows.push(row.map(escapeCsvField).join(','));
    });
  }

  return rows.join('\n');
}

/**
 * Extracts a numeric Shopify Variant ID from a Storefront GID ("gid://shopify/ProductVariant/123456789")
 * or numeric string, and builds a direct Shopify Cart Permalink URL if valid.
 */
export function buildShopifyCartPermalink(
  rawStoreDomain: string,
  items: { variantId: string; quantity: number }[],
  discountCode?: string
): string | null {
  const domain = normalizeShopifyDomain(rawStoreDomain);
  if (!domain || items.length === 0) return null;

  const numericLines: string[] = [];
  for (const item of items) {
    const gidMatch = item.variantId.match(/ProductVariant\/(\d+)$/);
    const rawNumeric = /^\d+$/.test(item.variantId.trim())
      ? item.variantId.trim()
      : null;
    const numericId = gidMatch ? gidMatch[1] : rawNumeric;
    if (!numericId) {
      return null;
    }
    numericLines.push(`${numericId}:${Math.max(1, item.quantity)}`);
  }

  const baseUrl = `https://${domain}/cart/${numericLines.join(',')}`;
  if (discountCode && discountCode.trim()) {
    return `${baseUrl}?discount=${encodeURIComponent(discountCode.trim())}`;
  }
  return baseUrl;
}
