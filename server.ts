import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

export const REQUIRED_SHOPIFY_THEME_FILES = [
  'layout/theme.liquid',
  'config/settings_schema.json',
  'locales/en.default.json',
  'assets/theme.css',
  'assets/theme.js',
  'snippets/cart-drawer.liquid',
  'sections/header.liquid',
  'sections/main-storefront.liquid',
  'sections/main-product.liquid',
  'sections/main-collection.liquid',
  'sections/footer.liquid',
  'templates/index.json',
  'templates/product.json',
  'templates/collection.json',
] as const;

export interface ShopifyPreviewProduct {
  id: number;
  handle: string;
  sku: string;
  title: string;
  type: string;
  tags: string[];
  price: number; // in paise/cents (e.g. 119900 = ₹1,199)
  compare_at_price: number; // doubled stash price in paise/cents (e.g. 289400 = ₹2,894)
  priceFormatted: string;
  compareFormatted: string;
  savingsFormatted: string;
  description: string;
  featured_image: string;
  second_image: string;
  variant_id: number;
  variant_title: string;
  badge: string;
}

function makeProductSvgDataUri(sku: string, title: string, subtitle: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
    <defs>
      <radialGradient id="spot" cx="50%" cy="45%" r="55%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.98"/>
        <stop offset="55%" stop-color="#E4E7EC" stop-opacity="0.92"/>
        <stop offset="100%" stop-color="#CFD4DD" stop-opacity="1"/>
      </radialGradient>
      <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#09090B"/>
        <stop offset="50%" stop-color="#3F3F46"/>
        <stop offset="100%" stop-color="#09090B"/>
      </linearGradient>
    </defs>
    <rect width="600" height="600" rx="40" fill="url(#spot)"/>
    <circle cx="300" cy="270" r="145" fill="none" stroke="#09090B" stroke-width="2" stroke-dasharray="6 6" opacity="0.35"/>
    <ellipse cx="300" cy="270" rx="185" ry="68" fill="none" stroke="#09090B" stroke-width="2.5" transform="rotate(-16 300 270)" opacity="0.65"/>
    <rect x="175" y="185" width="250" height="170" rx="28" fill="#FFFFFF" stroke="#09090B" stroke-width="3"/>
    <text x="300" y="245" text-anchor="middle" font-family="monospace" font-size="18" font-weight="700" fill="#52525B">${sku} // 316L ARCHIVE</text>
    <text x="300" y="285" text-anchor="middle" font-family="sans-serif" font-size="22" font-weight="800" fill="#09090B">${title}</text>
    <text x="300" y="320" text-anchor="middle" font-family="monospace" font-size="14" font-weight="600" fill="#3F3F46">${subtitle}</text>
    <path d="M300 95 L308 125 L338 133 L308 141 L300 171 L292 141 L262 133 L292 125 Z" fill="url(#metal)"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const RWND_ARCHIVE_CATALOG: ShopifyPreviewProduct[] = [
  {
    id: 1001,
    handle: '3-piece-y2k-cyber-set',
    sku: 'BUN-01',
    title: '3-PIECE Y2K CYBER SET',
    type: 'bundles',
    tags: ['bundles', 'y2k', 'bestseller', 'free-shipping'],
    price: 119900,
    compare_at_price: 289400,
    priceFormatted: '₹1,199',
    compareFormatted: '₹2,894',
    savingsFormatted: 'SAVE ₹1,695',
    description:
      'Three signature pieces engineered to wear together as a complete set. Includes the Cyber Signet Ring, Heavy Chain + Pendant, and Chain Bracelet in solid 316L stainless steel.',
    featured_image: makeProductSvgDataUri('BUN-01', '3-PIECE Y2K CYBER SET', 'Ring + Chain + Bracelet'),
    second_image: makeProductSvgDataUri('BUN-01', '3-PC STACK SPEC', 'Solid 316L Stainless Steel'),
    variant_id: 40101,
    variant_title: 'Complete 3-Piece Set (Ring + Chain + Bracelet)',
    badge: '★ MOST POPULAR BUNDLE · SAVE ₹1,695',
  },
  {
    id: 1002,
    handle: 'cyber-signet-ring',
    sku: 'R-01',
    title: 'CYBER SIGNET RING',
    type: 'rings',
    tags: ['rings', 'y2k', 'bestseller'],
    price: 34900,
    compare_at_price: 99800,
    priceFormatted: '₹349',
    compareFormatted: '₹998',
    savingsFormatted: 'SAVE ₹649',
    description:
      'Chunky 316L surgical-grade stainless steel signet ring with mirror-polished liquid chrome bevels. Sweatproof and tarnish-resistant.',
    featured_image: makeProductSvgDataUri('R-01', 'CYBER SIGNET RING', '316L Mirror Chrome Ring'),
    second_image: makeProductSvgDataUri('R-01', 'SIGNET PROFILE', 'US Size 7 / 8 / 9 / 10'),
    variant_id: 40102,
    variant_title: 'US Size 8 / Liquid Silver',
    badge: 'BESTSELLER · SAVE ₹649',
  },
  {
    id: 1003,
    handle: 'heavy-chain-pendant',
    sku: 'C-01',
    title: 'HEAVY CHAIN + PENDANT',
    type: 'chains',
    tags: ['chains', 'y2k', 'core'],
    price: 54900,
    compare_at_price: 159800,
    priceFormatted: '₹549',
    compareFormatted: '₹1,598',
    savingsFormatted: 'SAVE ₹1,049',
    description:
      '50cm heavy-gauge 316L stainless steel curb chain paired with a sculpted Y2K orbital emblem pendant and reinforced lobster clasp.',
    featured_image: makeProductSvgDataUri('C-01', 'HEAVY CHAIN + PENDANT', '50cm 316L Curb Link'),
    second_image: makeProductSvgDataUri('C-01', 'PENDANT LOCKUP', 'Reinforced Clasp Spec'),
    variant_id: 40103,
    variant_title: '50cm Chain + Y2K Starburst Pendant',
    badge: 'CORE ARCHIVE · SAVE ₹1,049',
  },
  {
    id: 1004,
    handle: 'chain-bracelet',
    sku: 'B-01',
    title: 'CHAIN BRACELET',
    type: 'bracelets',
    tags: ['bracelets', 'y2k', 'core'],
    price: 54900,
    compare_at_price: 159800,
    priceFormatted: '₹549',
    compareFormatted: '₹1,598',
    savingsFormatted: 'SAVE ₹1,049',
    description:
      'Industrial 316L stainless steel wrist hardware with custom low-profile box clasp. Weighted for solo wear or chronograph stacking.',
    featured_image: makeProductSvgDataUri('B-01', 'CHAIN BRACELET', 'Industrial Wrist Link'),
    second_image: makeProductSvgDataUri('B-01', 'WRIST STACK SPEC', '20cm Heavy Curb Link'),
    variant_id: 40104,
    variant_title: '20cm Standard Wrist Fit',
    badge: 'CORE ARCHIVE · SAVE ₹1,049',
  },
  {
    id: 1005,
    handle: 'pink-chrome-wired-earphones',
    sku: 'EAR-01',
    title: 'PINK CHROME WIRED EARPHONES (TYPE-C)',
    type: 'audio',
    tags: ['audio', 'earphones', 'type-c', 'free-shipping'],
    price: 99900,
    compare_at_price: 299800,
    priceFormatted: '₹999',
    compareFormatted: '₹2,998',
    savingsFormatted: 'SAVE ₹1,999',
    description:
      'High-output 10mm dynamic driver wired IEMs in metallic pink chrome housing with built-in DAC Type-C plug, inline mic, and hard shell carry case.',
    featured_image: makeProductSvgDataUri('EAR-01', 'PINK CHROME EARPHONES', 'Type-C Wired + Case'),
    second_image: makeProductSvgDataUri('EAR-01', '10MM DYNAMIC IEM', 'Zero-Latency Type-C DAC'),
    variant_id: 40105,
    variant_title: 'Type-C Digital Plug + Carry Case',
    badge: 'ONLY 16 LEFT · SAVE ₹1,999',
  },
  {
    id: 1006,
    handle: 'y2k-cyber-studs',
    sku: 'E-01',
    title: 'Y2K CYBER STUDS',
    type: 'earrings',
    tags: ['earrings', 'studs', 'y2k'],
    price: 29900,
    compare_at_price: 89800,
    priceFormatted: '₹299',
    compareFormatted: '₹898',
    savingsFormatted: 'SAVE ₹599',
    description:
      'Hypoallergenic 316L surgical steel Y2K starburst stud earrings (matched pair) with secure butterfly backs.',
    featured_image: makeProductSvgDataUri('E-01', 'Y2K CYBER STUDS', 'Matched Pair · 316L Steel'),
    second_image: makeProductSvgDataUri('E-01', 'STARBURST STUDS', 'Hypoallergenic Post'),
    variant_id: 40106,
    variant_title: 'Matched Pair / Liquid Silver',
    badge: 'ARCHIVE ENTRY · SAVE ₹599',
  },
  {
    id: 1007,
    handle: 'y2k-watch',
    sku: 'W-01',
    title: 'Y2K WATCH',
    type: 'watches',
    tags: ['watches', 'chronograph', 'phase-2', 'free-shipping'],
    price: 199900,
    compare_at_price: 499800,
    priceFormatted: '₹1,999',
    compareFormatted: '₹4,998',
    savingsFormatted: 'SAVE ₹2,999',
    description:
      'Dual-movement analog-digital chronograph in brushed 316L stainless steel with integrated link bracelet and EL backlight.',
    featured_image: makeProductSvgDataUri('W-01', 'Y2K WATCH', 'Analog-Digital Chronograph'),
    second_image: makeProductSvgDataUri('W-01', 'PHASE 2 CHRONO', 'Brushed 316L Steel Case'),
    variant_id: 40107,
    variant_title: 'Prepaid ₹1,999 (COD ₹2,199 w/ ₹150 UPI Advance)',
    badge: 'PHASE 2 PRE-ORDER · SAVE ₹2,999',
  },
];

export function validateShopifyThemeStructure(rootDir = __dirname): {
  valid: boolean;
  checkedFiles: string[];
  errors: string[];
} {
  const errors: string[] = [];
  const checkedFiles: string[] = [];

  for (const relPath of REQUIRED_SHOPIFY_THEME_FILES) {
    const fullPath = path.join(rootDir, relPath);
    if (!fs.existsSync(fullPath)) {
      errors.push(`Missing required Shopify file: ${relPath}`);
      continue;
    }
    const content = fs.readFileSync(fullPath, 'utf8');
    checkedFiles.push(relPath);

    if (content.includes('className=')) {
      errors.push(`${relPath} contains JSX className instead of HTML class`);
    }
    if (content.includes('htmlFor=')) {
      errors.push(`${relPath} contains JSX htmlFor instead of HTML for`);
    }

    if (relPath.endsWith('.json')) {
      try {
        JSON.parse(content);
      } catch (e) {
        errors.push(`Invalid JSON in ${relPath}: ${(e as Error).message}`);
      }
    }

    if (relPath.startsWith('sections/') && relPath.endsWith('.liquid')) {
      const match = content.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
      if (!match) {
        errors.push(`Missing {% schema %} block in ${relPath}`);
      } else {
        try {
          const parsed = JSON.parse(match[1]);
          if (!Array.isArray(parsed.presets)) {
            errors.push(`Missing "presets" array in ${relPath} schema`);
          }
        } catch (e) {
          errors.push(`Invalid JSON inside {% schema %} in ${relPath}: ${(e as Error).message}`);
        }
      }
    }
  }

  const themeLiquidPath = path.join(rootDir, 'layout/theme.liquid');
  if (fs.existsSync(themeLiquidPath)) {
    const themeLiquid = fs.readFileSync(themeLiquidPath, 'utf8');
    if (!themeLiquid.includes('{{ content_for_header }}')) {
      errors.push('layout/theme.liquid missing {{ content_for_header }}');
    }
    if (!themeLiquid.includes('{{ content_for_layout }}')) {
      errors.push('layout/theme.liquid missing {{ content_for_layout }}');
    }
  }

  return {
    valid: errors.length === 0,
    checkedFiles,
    errors,
  };
}

interface CartSessionItem {
  key: string;
  variant_id: number;
  quantity: number;
  product_title: string;
  variant_title: string;
  price: number;
  final_line_price: number;
  image: string;
  url: string;
}

const sessionCartItems: CartSessionItem[] = [];

function buildShopifyCartPayload() {
  const item_count = sessionCartItems.reduce((sum, i) => sum + i.quantity, 0);
  const total_price = sessionCartItems.reduce((sum, i) => sum + i.final_line_price, 0);
  return {
    token: 'rwnd20s-shopify-os2-cart',
    item_count,
    total_price,
    currency: 'INR',
    items: sessionCartItems,
  };
}

function stripSchemaBlock(liquidSource: string): string {
  return liquidSource.replace(/\{%\s*schema\s*%\}[\s\S]*?\{%\s*endschema\s*%\}/g, '');
}

function renderStorefrontCardsHtml(): string {
  return RWND_ARCHIVE_CATALOG.map(
    (p) => `
      <article
        data-product-card
        data-handle="${p.handle}"
        data-title="${p.title}"
        data-subtitle="${p.variant_title}"
        data-category="${p.type}"
        data-tags="${p.tags.join(',')}"
        data-price="${p.price}"
        data-price-formatted="${p.priceFormatted}"
        data-compare-formatted="${p.compareFormatted}"
        data-description="${p.description}"
        data-image="${p.featured_image}"
        data-variant-id="${p.variant_id}"
        data-url="/products/${p.handle}"
        class="group flex flex-col justify-between overflow-hidden rounded-2xl border border-black/15 bg-white transition-all duration-300 hover:border-[#09090B] shadow-sm"
      >
        <div class="relative aspect-square w-full overflow-hidden border-b border-black/10 bg-[#D4D8E0]">
          <a href="/products/${p.handle}" class="block h-full w-full">
            <img
              src="${p.featured_image}"
              alt="${p.title}"
              loading="lazy"
              class="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            >
            <img
              src="${p.second_image}"
              alt="${p.title} alternate view"
              loading="lazy"
              class="absolute inset-0 h-full w-full object-contain p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
          </a>
          <div class="pointer-events-none absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
            <span class="rounded-full border border-black/15 bg-white px-2.5 py-1 font-mono-tech text-[10px] font-bold tracking-wider text-[#09090B] uppercase shadow-xs">
              ${p.badge}
            </span>
          </div>
          <button
            type="button"
            data-toggle-wishlist
            aria-label="Save ${p.title} to wishlist"
            class="absolute top-3.5 right-3.5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/15 bg-white text-[#09090B] shadow-xs transition-colors hover:bg-[#09090B] hover:text-white cursor-pointer"
          >
            ♥
          </button>
        </div>

        <div class="flex flex-1 flex-col justify-between p-5">
          <div>
            <h3 class="font-display text-lg font-extrabold tracking-wide text-[#09090B] uppercase">
              <a href="/products/${p.handle}">${p.title}</a>
            </h3>
            <p class="mt-1 text-xs text-[#3F3F46]">${p.variant_title}</p>
          </div>

          <div class="mt-5 border-t border-black/10 pt-4">
            <div class="flex flex-wrap items-baseline gap-2">
              <span class="font-mono-tech text-xl font-bold text-[#09090B]">${p.priceFormatted}</span>
              <span class="font-mono-tech text-xs text-[#52525B] line-through">${p.compareFormatted}</span>
              <span class="rounded border border-black/15 bg-[#EEF0F4] px-2 py-0.5 font-mono-tech text-[10px] font-bold text-[#09090B] uppercase">
                ${p.savingsFormatted}
              </span>
            </div>

            <div class="mt-4 flex items-center gap-2.5">
              <button
                type="button"
                data-add-to-cart
                variant-id="${p.variant_id}"
                class="flex flex-1 items-center justify-center gap-2 rounded-full border border-black bg-[#09090B] px-5 py-3 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-white hover:text-[#09090B] cursor-pointer"
              >
                <span>ADD TO BAG +</span>
              </button>
              <button
                type="button"
                data-open-quick-view
                aria-label="Quick view ${p.title}"
                class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/20 bg-white text-[#09090B] transition-colors hover:bg-[#09090B] hover:text-white cursor-pointer"
              >
                👁
              </button>
            </div>
          </div>
        </div>
      </article>
    `
  ).join('\n');
}

function renderShopifyLiquidPage(contentForLayoutHtml: string, pageTitle = 'rwnd20s. — Timeless, But Make It Y2K | Shopify OS 2.0 Theme'): string {
  const layoutRaw = fs.readFileSync(path.join(__dirname, 'layout/theme.liquid'), 'utf8');
  const headerRaw = stripSchemaBlock(fs.readFileSync(path.join(__dirname, 'sections/header.liquid'), 'utf8'));
  const footerRaw = stripSchemaBlock(fs.readFileSync(path.join(__dirname, 'sections/footer.liquid'), 'utf8'));
  const cartDrawerRaw = fs.readFileSync(path.join(__dirname, 'snippets/cart-drawer.liquid'), 'utf8');

  const cart = buildShopifyCartPayload();

  const headerHtml = headerRaw
    .replace(/\{\{\s*section\.settings\.announcement_text\s*\}\}/g, 'Free shipping on orders above ₹999  +  Limited drops only')
    .replace(/\{\{\s*routes\.root_url\s*\}\}/g, '/')
    .replace(/\{\{\s*shop\.name\s*\|\s*default:\s*'rwnd20s\.'\s*\}\}/g, 'rwnd20s.')
    .replace(/\{\{\s*settings\.brand_name\s*\|\s*default:\s*'rwnd20s\.'\s*\}\}/g, 'rwnd20s.')
    .replace(/\{\{\s*cart\.item_count\s*\}\}/g, String(cart.item_count));

  const footerHtml = footerRaw
    .replace(/\{\{\s*settings\.brand_name\s*\|\s*default:\s*'rwnd20s\.'\s*\}\}/g, 'rwnd20s.')
    .replace(/\{\{\s*section\.settings\.dispatch_city\s*\|\s*upcase\s*\}\}/g, 'MADURAI, TAMIL NADU')
    .replace(/\{\{\s*section\.settings\.dispatch_city\s*\}\}/g, 'Madurai, Tamil Nadu')
    .replace(/\{\{\s*'now'\s*\|\s*date:\s*'%Y'\s*\}\}/g, '2026');

  const cartDrawerHtml = cartDrawerRaw
    .replace(/\{\{\s*cart\.item_count\s*\}\}/g, String(cart.item_count))
    .replace(/\{\{\s*cart\.total_price\s*\|\s*money\s*\}\}/g, `₹${Math.round(cart.total_price / 100).toLocaleString('en-IN')}`)
    .replace(/\{\{\s*'general\.cart\.empty'\s*\|\s*t\s*\}\}/g, 'YOUR HARDWARE BAG IS EMPTY')
    .replace(/\{\{\s*'general\.cart\.subtotal'\s*\|\s*t\s*\}\}/g, 'SUBTOTAL (MRP INCL. TAX)')
    .replace(/\{\{\s*'general\.cart\.checkout'\s*\|\s*t\s*\}\}/g, 'PROCEED TO CHECKOUT →')
    .replace(/\{%\s*if[\s\S]*?\{%\s*endif\s*%\}/g, '');

  return layoutRaw
    .replace(/\{\{\s*request\.locale\.iso_code\s*\}\}/g, 'en')
    .replace(/\{\{\s*canonical_url\s*\}\}/g, 'http://localhost:3000/')
    .replace(/\{\{\s*page_title\s*\}\}/g, pageTitle)
    .replace(/\{%-?\s*if[\s\S]*?endif\s*-?%\}/g, '')
    .replace(/\{%-?\s*unless[\s\S]*?endunless\s*-?%\}/g, '')
    .replace(/\{\{\s*'theme\.css'\s*\|\s*asset_url\s*\|\s*stylesheet_tag\s*\}\}/g, '<link rel="stylesheet" href="/assets/theme.css">')
    .replace(/\{\{\s*'theme\.js'\s*\|\s*asset_url\s*\}\}/g, '/assets/theme.js')
    .replace(/\{\{\s*content_for_header\s*\}\}/g, '<!-- Shopify content_for_header -->')
    .replace(/\{%\s*section\s*'header'\s*%\}/g, headerHtml)
    .replace(/\{\{\s*content_for_layout\s*\}\}/g, contentForLayoutHtml)
    .replace(/\{%\s*section\s*'footer'\s*%\}/g, footerHtml)
    .replace(/\{%\s*render\s*'cart-drawer'\s*%\}/g, cartDrawerHtml);
}

function renderMainStorefrontHtml(): string {
  const raw = stripSchemaBlock(fs.readFileSync(path.join(__dirname, 'sections/main-storefront.liquid'), 'utf8'));
  const productGridRegex = /<div id="rwnd-product-grid"[\s\S]*?<\/section>/;
  const cardsHtml = `
    <div id="rwnd-product-grid" class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      ${renderStorefrontCardsHtml()}
    </div>
  </div>
</section>`;

  return raw
    .replace(/\{%\s*assign[\s\S]*?%\}/g, '')
    .replace(/\{\{\s*section\.settings\.hero_badge\s*\}\}/g, '+ DROP 01 // LIVE NOW')
    .replace(/\{\{\s*section\.settings\.hero_title_line_1\s*\}\}/g, 'TIMELESS')
    .replace(/\{\{\s*section\.settings\.hero_title_line_2\s*\}\}/g, 'BUT MAKE IT Y2K.')
    .replace(
      /\{\{\s*section\.settings\.hero_subtitle\s*\}\}/g,
      'Heavy 316L steel hardware, pink chrome Type-C wired earphones & analog chronographs. Free shipping above ₹999. Cash on Delivery available.'
    )
    .replace(/\{%\s*if archive_collection\.products\.size > 0[\s\S]*?\{%\s*endif\s*%\}/g, `<img src="${RWND_ARCHIVE_CATALOG[0].featured_image}" alt="${RWND_ARCHIVE_CATALOG[0].title}" class="h-full w-full rounded-2xl object-contain">`)
    .replace(productGridRegex, cardsHtml);
}

// Run CLI validation when invoked via `npm run build` (`tsx server.ts --validate`)
if (process.argv.includes('--validate')) {
  const result = validateShopifyThemeStructure(__dirname);
  if (!result.valid) {
    console.error('[Shopify OS 2.0 Validator] Failed:', result.errors);
    process.exit(1);
  }
  console.log(
    `[Shopify OS 2.0 Validator] Verified ${result.checkedFiles.length} theme files successfully.`
  );
  process.exit(0);
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Serve Shopify /assets directory
  app.use('/assets', express.static(path.join(__dirname, 'assets')));

  // Shopify AJAX Cart API: GET /cart.js
  app.get('/cart.js', (_req, res) => {
    res.json(buildShopifyCartPayload());
  });

  // Shopify AJAX Cart API: POST /cart/add.js
  app.post('/cart/add.js', (req, res) => {
    const variantId = Number(req.body?.id) || 40101;
    const quantity = Math.max(1, Number(req.body?.quantity) || 1);
    const product =
      RWND_ARCHIVE_CATALOG.find((p) => p.variant_id === variantId) ||
      RWND_ARCHIVE_CATALOG[0];

    const existing = sessionCartItems.find((item) => item.variant_id === product.variant_id);
    if (existing) {
      existing.quantity += quantity;
      existing.final_line_price = existing.price * existing.quantity;
    } else {
      sessionCartItems.push({
        key: `${product.variant_id}:${Date.now()}`,
        variant_id: product.variant_id,
        quantity,
        product_title: product.title,
        variant_title: product.variant_title,
        price: product.price,
        final_line_price: product.price * quantity,
        image: product.featured_image,
        url: `/products/${product.handle}`,
      });
    }

    res.json(buildShopifyCartPayload());
  });

  // Shopify AJAX Cart API: POST /cart/change.js
  app.post('/cart/change.js', (req, res) => {
    const key = String(req.body?.id || '');
    const quantity = Math.max(0, Number(req.body?.quantity) || 0);
    const index = sessionCartItems.findIndex((item) => item.key === key);
    if (index !== -1) {
      if (quantity === 0) {
        sessionCartItems.splice(index, 1);
      } else {
        sessionCartItems[index].quantity = quantity;
        sessionCartItems[index].final_line_price =
          sessionCartItems[index].price * quantity;
      }
    }
    res.json(buildShopifyCartPayload());
  });

  // Theme Structure JSON endpoint
  app.get('/api/theme-structure', (_req, res) => {
    res.json(validateShopifyThemeStructure(__dirname));
  });

  // Product Detail Route: /products/:handle
  app.get('/products/:handle', (req, res) => {
    const product =
      RWND_ARCHIVE_CATALOG.find((p) => p.handle === req.params.handle) ||
      RWND_ARCHIVE_CATALOG[0];
    const bodyHtml = `
      <section class="metallic-chrome-bg py-12 sm:py-16">
        <div class="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div class="lg:col-span-7">
              <div class="overflow-hidden rounded-3xl border border-black/15 bg-white p-6 shadow-md">
                <img src="${product.featured_image}" alt="${product.title}" class="aspect-square w-full rounded-2xl bg-[#D4D8E0] object-contain p-4">
              </div>
            </div>
            <div class="lg:col-span-5">
              <div class="rounded-3xl border border-black/15 bg-white p-6 sm:p-8 shadow-md">
                <span class="inline-block rounded-full border border-black/15 bg-[#EEF0F4] px-3 py-1 font-mono-tech text-[10px] font-bold tracking-widest text-[#09090B] uppercase">${product.sku} // ${product.type}</span>
                <h1 class="mt-3 font-display text-2xl font-extrabold text-[#09090B] uppercase sm:text-3xl">${product.title}</h1>
                <div class="mt-4 flex items-baseline gap-3">
                  <span class="font-mono-tech text-2xl font-bold text-[#09090B]">${product.priceFormatted}</span>
                  <span class="font-mono-tech text-sm text-[#52525B] line-through">${product.compareFormatted}</span>
                  <span class="rounded border border-black/15 bg-[#EEF0F4] px-2 py-0.5 font-mono-tech text-[11px] font-bold text-[#09090B]">${product.savingsFormatted}</span>
                </div>
                <p class="mt-5 text-sm leading-relaxed text-[#27272A]">${product.description}</p>
                <button type="button" data-add-to-cart variant-id="${product.variant_id}" class="mt-6 w-full rounded-full border border-black bg-[#09090B] px-6 py-4 font-mono-tech text-xs font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-[#09090B] cursor-pointer">
                  ADD TO BAG +
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
    res.type('html').send(renderShopifyLiquidPage(bodyHtml, `${product.title} — rwnd20s.`));
  });

  // Main Storefront Route: GET /
  app.get('*', (_req, res) => {
    const html = renderShopifyLiquidPage(renderMainStorefrontHtml());
    res.type('html').send(html);
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `[rwnd20s. Shopify OS 2.0 Liquid Theme Server] Listening on http://0.0.0.0:${PORT}`
    );
  });
}

startServer();
