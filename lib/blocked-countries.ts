import geoip from 'geoip-lite'

/**
 * Geo-block denylist for high-risk / sanctioned / state-threat sources.
 *
 * Override at runtime with Cloud Run env:
 *   BLOCKED_COUNTRIES=CN,KP,IR,...
 *
 * Country detection order:
 * 1. Edge headers (Cloudflare cf-ipcountry, Cloud Armor, etc.)
 * 2. IP lookup via geoip-lite (works on plain Cloud Run using x-forwarded-for)
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

const CLIENT_IP_HEADER_KEYS = [
  'cf-connecting-ip', // Cloudflare
  'x-real-ip',
  'x-client-ip',
  'true-client-ip',
  'fastly-client-ip',
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

function normalizeIp(ip: string): string {
  const trimmed = ip.trim()
  if (trimmed.startsWith('::ffff:')) {
    return trimmed.slice('::ffff:'.length)
  }
  return trimmed
}

function isPrivateOrLocalIp(ip: string): boolean {
  if (ip === '::1' || ip === '127.0.0.1' || ip === '0.0.0.0') return true
  if (ip.startsWith('10.')) return true
  if (ip.startsWith('192.168.')) return true
  const private172 = /^172\.(\d+)\./.exec(ip)
  if (private172) {
    const secondOctet = Number(private172[1])
    if (secondOctet >= 16 && secondOctet <= 31) return true
  }
  return false
}

export function getClientIp(
  headers: Headers | { get: (key: string) => string | null }
): string | null {
  for (const key of CLIENT_IP_HEADER_KEYS) {
    const value = headers.get(key)?.trim()
    if (!value) continue
    const ip = normalizeIp(value)
    if (!isPrivateOrLocalIp(ip)) return ip
  }

  const forwardedFor = headers.get('x-forwarded-for')
  if (!forwardedFor) return null

  for (const part of forwardedFor.split(',')) {
    const ip = normalizeIp(part)
    if (!ip || isPrivateOrLocalIp(ip)) continue
    return ip
  }

  return null
}

export function getCountryCodeFromIp(ip: string | null): string | null {
  if (!ip) return null
  const geo = geoip.lookup(ip)
  const code = geo?.country?.trim().toUpperCase()
  if (!code || code.length !== 2) return null
  return code
}

export function resolveRequestCountryCode(
  headers: Headers | { get: (key: string) => string | null }
): { countryCode: string | null; source: 'header' | 'ip' | null } {
  const fromHeader = getRequestCountryCode(headers)
  if (fromHeader) {
    return { countryCode: fromHeader, source: 'header' }
  }

  if (process.env.GEO_BLOCK_IP_FALLBACK === 'false') {
    return { countryCode: null, source: null }
  }

  const fromIp = getCountryCodeFromIp(getClientIp(headers))
  if (fromIp) {
    return { countryCode: fromIp, source: 'ip' }
  }

  return { countryCode: null, source: null }
}

export function isBlockedCountry(countryCode: string | null): boolean {
  if (!countryCode) return false
  return getBlockedCountries().has(countryCode.toUpperCase())
}
