/**
 * Curated Monochrome Studio Hardware Photography & Seamless Fallback Generator
 * Every product is mapped to verified dark-background Y2K hardware photographs
 * (Studio 01, Angle 02, Detail 03) rendered in dark studio lighting.
 */

export type StudioAngle = 0 | 1 | 2;

const STUDIO_PHOTO_SETS: Record<string, [string, string, string]> = {
  'cyber-bundle': [
    'https://images.unsplash.com/photo-1617723438144-5f11a7c77e3a?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1679973299029-eaa2f8ae11b2?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1593269842281-09c4a88272ee?auto=format&fit=crop&w=1000&q=85',
  ],
  'watch-obsidian': [
    'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1598533891159-1d1db0800d61?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=85',
  ],
  'watch-skeleton': [
    'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1598533891159-1d1db0800d61?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=85',
  ],
  'iem-chrome': [
    'https://images.unsplash.com/photo-1778854290451-7bdac49cd6e8?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1637868796503-9191d8ae78be?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1722439667098-f32094e3b1d4?auto=format&fit=crop&w=1000&q=85',
  ],
  'iem-turbine': [
    'https://images.unsplash.com/photo-1778854290451-7bdac49cd6e8?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1637868796503-9191d8ae78be?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1722439667098-f32094e3b1d4?auto=format&fit=crop&w=1000&q=85',
  ],
  'ring-star': [
    'https://images.unsplash.com/photo-1593269842281-09c4a88272ee?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1677913840782-6efe78b7d204?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1617723438144-5f11a7c77e3a?auto=format&fit=crop&w=1000&q=85',
  ],
  'ring-cross': [
    'https://images.unsplash.com/photo-1593269842281-09c4a88272ee?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1677913840782-6efe78b7d204?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1617723438144-5f11a7c77e3a?auto=format&fit=crop&w=1000&q=85',
  ],
  'chain-cross': [
    'https://images.unsplash.com/photo-1679973299029-eaa2f8ae11b2?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1679973296613-33a89caa5ee0?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1617723438144-5f11a7c77e3a?auto=format&fit=crop&w=1000&q=85',
  ],
  'chain-barbed': [
    'https://images.unsplash.com/photo-1679973299029-eaa2f8ae11b2?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1679973296613-33a89caa5ee0?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1617723438144-5f11a7c77e3a?auto=format&fit=crop&w=1000&q=85',
  ],
  'bracelet-heavy': [
    'https://images.unsplash.com/photo-1679973296613-33a89caa5ee0?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1617723438144-5f11a7c77e3a?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1679973299029-eaa2f8ae11b2?auto=format&fit=crop&w=1000&q=85',
  ],
  'bracelet-cuff': [
    'https://images.unsplash.com/photo-1679973296613-33a89caa5ee0?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1617723438144-5f11a7c77e3a?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1679973299029-eaa2f8ae11b2?auto=format&fit=crop&w=1000&q=85',
  ],
  'earrings-y2k': [
    'https://images.unsplash.com/photo-1677913840782-6efe78b7d204?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1593269842281-09c4a88272ee?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1617723438144-5f11a7c77e3a?auto=format&fit=crop&w=1000&q=85',
  ],
};

export function createStudioProductDataUri(
  key: string,
  _sku: string,
  _label: string,
  angle: StudioAngle = 0
): string {
  const photos = STUDIO_PHOTO_SETS[key] || STUDIO_PHOTO_SETS['watch-obsidian'];
  return photos[angle] || photos[0];
}

export function buildHardwareStudioSet(
  key: string,
  _sku?: string,
  _label?: string
): string[] {
  const photos = STUDIO_PHOTO_SETS[key] || STUDIO_PHOTO_SETS['watch-obsidian'];
  return [...photos];
}

/**
 * Borderless dark-studio metallic fallback graphic (used only if an external image URL fails to load)
 */
export function getSeamlessFallbackDataUri(label = 'RWND20S HARDWARE'): string {
  const safeLabel = label.replace(/[&<>'"]/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" fill="none">
    <rect width="800" height="800" fill="#080808"/>
    <defs>
      <radialGradient id="spot" cx="50%" cy="50%" r="52%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.22"/>
        <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.05"/>
        <stop offset="100%" stop-color="#080808" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="chrome" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FAFAFA"/>
        <stop offset="45%" stop-color="#71717A"/>
        <stop offset="75%" stop-color="#E4E4E7"/>
        <stop offset="100%" stop-color="#18181B"/>
      </linearGradient>
    </defs>
    <circle cx="400" cy="400" r="360" fill="url(#spot)"/>
    <ellipse cx="400" cy="400" rx="220" ry="90" transform="rotate(-18 400 400)" stroke="url(#chrome)" stroke-width="18" opacity="0.85"/>
    <circle cx="400" cy="400" r="105" stroke="url(#chrome)" stroke-width="12" fill="#0B0B0B"/>
    <path d="M400 260 L414 386 L540 400 L414 414 L400 540 L386 414 L260 400 L386 386 Z" fill="url(#chrome)" opacity="0.9"/>
    <text x="400" y="660" text-anchor="middle" fill="#A1A1AA" font-family="monospace" font-size="16" letter-spacing="6">${safeLabel}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
