/**
 * Geo-block denylist for high-risk / sanctioned / state-threat sources.
 *
 * Override at runtime with Cloud Run env:
 *   BLOCKED_COUNTRIES=CN,KP,IR,...
 *
 * Requires a country header from the edge (Cloudflare, Cloud Armor, etc.).
 * Plain Cloud Run does not set country headers by itself.
 */
const DEFAULT_BLOCKED_COUNTRIES = [
  // State-sponsored cyber / high attack volume
  'CN', // China
  'RU', // Russia
  'KP', // North Korea
  'IR', // Iran
  'BY', // Belarus
  // Comprehensive sanctioned / restricted jurisdictions
  'SY', // Syria
  'CU', // Cuba
  'VE', // Venezuela
  'MM', // Myanmar
  'AF', // Afghanistan
  'SD', // Sudan
  'SS', // South Sudan
  'YE', // Yemen
  'IQ', // Iraq
  'LY', // Libya
  'SO', // Somalia
  'ER', // Eritrea
  'CD', // DR Congo
  'CF', // Central African Republic
  'ML', // Mali
  'NE', // Niger
  'TD', // Chad
  'ZW', // Zimbabwe
] as const

const COUNTRY_HEADER_KEYS = [
  'cf-ipcountry', // Cloudflare
  'x-vercel-ip-country', // Vercel
  'x-country-code', // Custom / CDN
  'x-client-region', // Google Cloud Load Balancing (when configured)
  'x-goog-ip-country', // Custom Cloud Armor header name some setups use
] as const

export function getBlockedCountries(): Set<string> {
  const fromEnv = process.env.BLOCKED_COUNTRIES
  const list = fromEnv
    ? fromEnv.split(/[\s,]+/).map((code) => code.trim().toUpperCase()).filter(Boolean)
    : [...DEFAULT_BLOCKED_COUNTRIES]
  return new Set(list)
}

export function getRequestCountryCode(
  headers: Headers | { get: (key: string) => string | null }
): string | null {
  for (const key of COUNTRY_HEADER_KEYS) {
    const value = headers.get(key)
    if (!value) continue
    const code = value.trim().toUpperCase()
    // Cloudflare uses XX for unknown and T1 for Tor
    if (!code || code === 'XX' || code === 'T1' || code.length !== 2) continue
    return code
  }
  return null
}

export function isBlockedCountry(countryCode: string | null): boolean {
  if (!countryCode) return false
  return getBlockedCountries().has(countryCode.toUpperCase())
}
