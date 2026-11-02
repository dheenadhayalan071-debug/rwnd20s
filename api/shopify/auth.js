/**
 * Vercel Serverless API Function: /api/shopify/auth
 *
 * Authenticates with Shopify Admin OAuth using the Client Credentials Grant
 * (`grant_type=client_credentials`) and returns ONLY authentication status,
 * token expiry metadata, and granted scopes.
 *
 * SECURITY INVARIANT:
 * - Never returns, logs, or exposes `access_token` or `SHOPIFY_CLIENT_SECRET`.
 */

const SHOPIFY_DOMAIN_PATTERN = /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i;

/**
 * Normalizes and validates a Shopify store domain (e.g., "x530k-qs.myshopify.com").
 * Returns null if the domain is missing or invalid to prevent SSRF.
 *
 * @param {string | undefined} rawDomain
 * @returns {string | null}
 */
export function sanitizeStoreDomain(rawDomain) {
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
 * Builds the `application/x-www-form-urlencoded` body for Shopify OAuth.
 *
 * @param {string} clientId
 * @param {string} clientSecret
 * @returns {string}
 */
export function buildTokenRequestBody(clientId, clientSecret) {
  const params = new URLSearchParams();
  params.set('grant_type', 'client_credentials');
  params.set('client_id', clientId.trim());
  params.set('client_secret', clientSecret.trim());
  return params.toString();
}

/**
 * Extracts only non-sensitive metadata from Shopify's token response.
 * Explicitly discards `access_token`.
 *
 * @param {Record<string, unknown>} payload
 * @param {number} [nowMs]
 */
export function sanitizeShopifyTokenResponse(payload, nowMs = Date.now()) {
  const hasAccessToken =
    typeof payload?.access_token === 'string' &&
    payload.access_token.trim().length > 0;

  if (!hasAccessToken) {
    return {
      authenticated: false,
      expiresIn: null,
      expiresAt: null,
      scope: null,
      scopes: [],
    };
  }

  const rawExpiresIn = Number(payload?.expires_in);
  const expiresIn =
    Number.isFinite(rawExpiresIn) && rawExpiresIn > 0
      ? Math.floor(rawExpiresIn)
      : null;

  const expiresAt =
    expiresIn !== null ? new Date(nowMs + expiresIn * 1000).toISOString() : null;

  const rawScope = typeof payload?.scope === 'string' ? payload.scope.trim() : '';
  const scopes = rawScope
    ? rawScope
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return {
    authenticated: true,
    expiresIn,
    expiresAt,
    scope: rawScope,
    scopes,
  };
}

/**
 * Vercel Node.js Serverless Handler (`POST /api/shopify/auth`).
 *
 * @param {import('http').IncomingMessage & { method?: string }} req
 * @param {import('http').ServerResponse & { status?: (code: number) => any; json?: (body: any) => any; setHeader: (name: string, value: string) => void }} res
 */
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  const sendJson = (statusCode, body) => {
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
  };

  // 1. Accept POST requests only
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(405, {
      authenticated: false,
      expiresIn: null,
      expiresAt: null,
      scopes: [],
      error: 'Method Not Allowed. Use POST.',
    });
  }

  // 2. Read environment variables server-side
  const rawDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

  const storeDomain = sanitizeStoreDomain(rawDomain);

  if (
    !storeDomain ||
    !clientId ||
    typeof clientId !== 'string' ||
    !clientId.trim() ||
    !clientSecret ||
    typeof clientSecret !== 'string' ||
    !clientSecret.trim()
  ) {
    return sendJson(500, {
      authenticated: false,
      expiresIn: null,
      expiresAt: null,
      scopes: [],
      error:
        'Server configuration error: SHOPIFY_STORE_DOMAIN (must match *.myshopify.com), SHOPIFY_CLIENT_ID, and SHOPIFY_CLIENT_SECRET must be configured.',
    });
  }

  // 3. Send POST request to https://<SHOPIFY_STORE_DOMAIN>/admin/oauth/access_token
  const tokenEndpoint = `https://${storeDomain}/admin/oauth/access_token`;
  const formBody = buildTokenRequestBody(clientId, clientSecret);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: formBody,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok || !data) {
      const safeErrorDescription =
        typeof data?.error_description === 'string'
          ? data.error_description
          : typeof data?.error === 'string'
            ? data.error
            : `Shopify authentication failed with HTTP ${response.status}.`;

      const statusCode =
        response.status >= 400 && response.status < 500 ? 401 : 502;

      return sendJson(statusCode, {
        authenticated: false,
        expiresIn: null,
        expiresAt: null,
        scopes: [],
        error: safeErrorDescription,
      });
    }

    // 5 & 6. Return only whether authentication succeeded, expiry time, and granted scopes.
    // Never return, log, or expose the Admin access token.
    const sanitized = sanitizeShopifyTokenResponse(data);

    if (!sanitized.authenticated) {
      return sendJson(502, {
        authenticated: false,
        expiresIn: null,
        expiresAt: null,
        scopes: [],
        error: 'Shopify response did not confirm authentication.',
      });
    }

    return sendJson(200, sanitized);
  } catch (err) {
    clearTimeout(timeoutId);

    const isTimeout = err instanceof Error && err.name === 'AbortError';
    return sendJson(502, {
      authenticated: false,
      expiresIn: null,
      expiresAt: null,
      scopes: [],
      error: isTimeout
        ? 'Shopify OAuth request timed out.'
        : 'Unable to reach Shopify OAuth endpoint.',
    });
  }
}
