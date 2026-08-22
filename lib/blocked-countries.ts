/**
 * Geo-block denylist for high-risk / sanctioned / state-threat sources.
 *
 * Override at runtime with Cloud Run env:
 *   BLOCKED_COUNTRIES=CN,KP,IR,...
 *   GEO_BLOCK_IP_FALLBACK=true   (default off — enable after verifying headers/IP path)
 */
const DEFAULT_BLOCKED_COUNTRIES = [
  'CN',
  'RU',
  'KP',
  'IR',
  'BY',
  'SY',
  'CU',
  'VE',
  'MM',
  'AF',
  'SD',
  'SS',
  'YE',
  'IQ',
  'LY',
  'SO',
  'ER',
  'CD',
  'CF',
  'ML',
  'NE',
  'TD',
  'ZW',
] as const

const COUNTRY_HEADER_KEYS = [
  'cf-ipcountry',
  'x-vercel-ip-country',
  'x-country-code',
  'x-client-region',
  'x-goog-ip-country',
] as const

const CLIENT_IP_HEADER_KEYS = [
  'cf-connecting-ip',
  'x-real-ip',
  'x-client-ip',
  'true-client-ip',
  'fastly-client-ip',
] as const

type GeoIpModule = {
  lookup: (ip: string) => { country?: string } | null
}

let geoipModule: GeoIpModule | null | undefined

function getGeoIpModule(): GeoIpModule | null {
  if (geoipModule !== undefined) return geoipModule
  try {
    // Lazy load so a missing DB in standalone cannot break proxy at import time.
    geoipModule = require('geoip-lite') as GeoIpModule
  } catch {
    geoipModule = null
  }
  return geoipModule
}

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
  try {
    const geoip = getGeoIpModule()
    if (!geoip) return null
    const geo = geoip.lookup(ip)
    const code = geo?.country?.trim().toUpperCase()
    if (!code || code.length !== 2) return null
    return code
  } catch {
    return null
  }
}

export function resolveRequestCountryCode(
  headers: Headers | { get: (key: string) => string | null }
): { countryCode: string | null; source: 'header' | 'ip' | null } {
  try {
    const fromHeader = getRequestCountryCode(headers)
    if (fromHeader) {
      return { countryCode: fromHeader, source: 'header' }
    }

    // Opt-in: IP fallback can mis-block or crash if geo DB is unavailable in prod.
    if (process.env.GEO_BLOCK_IP_FALLBACK !== 'true') {
      return { countryCode: null, source: null }
    }

    const fromIp = getCountryCodeFromIp(getClientIp(headers))
    if (fromIp) {
      return { countryCode: fromIp, source: 'ip' }
    }
  } catch {
    // Fail open — never take the site offline because geo lookup failed.
  }

  return { countryCode: null, source: null }
}

export function isBlockedCountry(countryCode: string | null): boolean {
  if (!countryCode) return false
  return getBlockedCountries().has(countryCode.toUpperCase())
}
