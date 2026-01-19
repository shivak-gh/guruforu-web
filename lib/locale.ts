import localesConfig from './locales.json'
import localizedContent from './localized-content.json'

export type SupportedLocale = 'en-US' | 'en-GB' | 'en-CA' | 'en-AU' | 'en-NZ' | 'en-QA' | 'en-AE' | 'x-default'
export type Region = 'US' | 'UK' | 'CA' | 'AU' | 'NZ' | 'QA' | 'AE' | 'DEFAULT'

export interface LocaleInfo {
  locale: SupportedLocale
  region: Region
  hreflang: string
  countryCode: string | null
  countryName: string
  currency: string
  currencySymbol: string
  openGraphLocale: string
  htmlLang: string
}

/**
 * Gets locale configuration from JSON
 */
export function getLocaleConfig(localeCode: SupportedLocale): LocaleInfo | null {
  const locale = localesConfig.supportedLocales.find(l => l.code === localeCode)
  if (!locale) return null

  return {
    locale: locale.code as SupportedLocale,
    region: locale.region as Region,
    hreflang: locale.hreflang,
    countryCode: locale.countryCode,
    countryName: locale.countryName,
    currency: locale.currency,
    currencySymbol: locale.currencySymbol,
    openGraphLocale: locale.openGraphLocale,
    htmlLang: locale.htmlLang,
  }
}

/**
 * Detects user locale from headers (server-side) or browser (client-side)
 */
export function detectLocale(
  headers?: Headers | { get: (key: string) => string | null }
): LocaleInfo {
  let detectedLocale: SupportedLocale = localesConfig.defaultLocale as SupportedLocale

  if (headers) {
    // Server-side: Check country code headers first (most reliable)
    const detectionConfig = localesConfig.detection
    for (const headerKey of detectionConfig.headerKeys) {
      const value = headers.get(headerKey)
      if (!value) continue

      // Check country code mapping
      if (headerKey.includes('country') || headerKey.includes('ipcountry')) {
        const countryCode = value.toUpperCase()
        const mappedLocale = detectionConfig.countryCodeMapping[countryCode as keyof typeof detectionConfig.countryCodeMapping]
        if (mappedLocale) {
          detectedLocale = mappedLocale as SupportedLocale
          break
        }
      }

      // Check Accept-Language header
      if (headerKey === 'accept-language') {
        const lang = value.toLowerCase()
        for (const [key, locale] of Object.entries(detectionConfig.languageMapping)) {
          if (lang.includes(key)) {
            detectedLocale = locale as SupportedLocale
            break
          }
        }
        if (detectedLocale !== localesConfig.defaultLocale) break
      }
    }
  } else if (typeof window !== 'undefined') {
    // Client-side: Use browser locale
    const browserLocale = navigator.language || navigator.languages?.[0] || 'en-US'
    const langLower = browserLocale.toLowerCase()
    
    for (const [key, locale] of Object.entries(localesConfig.detection.languageMapping)) {
      if (langLower.startsWith(key)) {
        detectedLocale = locale as SupportedLocale
        break
      }
    }
  }

  const localeConfig = getLocaleConfig(detectedLocale)
  return localeConfig || getLocaleConfig(localesConfig.defaultLocale as SupportedLocale)!
}

/**
 * Localizes text based on region using JSON configuration
 * Handles both phrase replacements (longer strings first) and word replacements
 */
export function localizeText(text: string, region: Region): string {
  const replacements = localizedContent.textReplacements[region]
  if (!replacements || Object.keys(replacements).length === 0) {
    return text
  }

  let localized = text
  
  // Sort keys by length (longest first) to handle phrases before individual words
  const sortedKeys = Object.keys(replacements).sort((a, b) => b.length - a.length)
  
  for (const key of sortedKeys) {
    const value = replacements[key as keyof typeof replacements] as string
    if (!value) continue
    // For multi-word phrases, use exact match with case-insensitive flag
    // For single words, use word boundaries
    if (key.includes(' ')) {
      // Phrase replacement - use case-insensitive global replacement
      const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
      localized = localized.replace(regex, (match) => {
        // Preserve original case pattern
        if (match === match.toUpperCase()) {
          return value.toUpperCase()
        } else if (match === match.toLowerCase()) {
          return value.toLowerCase()
        } else if (match[0] === match[0].toUpperCase()) {
          return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        }
        return value
      })
    } else {
      // Word replacement - use word boundaries
      const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
      localized = localized.replace(regex, (match) => {
        // Preserve original case
        if (match === match.toUpperCase()) {
          return value.toUpperCase()
        } else if (match === match.toLowerCase()) {
          return value.toLowerCase()
        } else if (match[0] === match[0].toUpperCase()) {
          return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        }
        return value
      })
    }
  }

  return localized
}

/**
 * Gets region-specific educational terms from JSON
 */
export function getEducationalTerms(region: Region) {
  return localizedContent.educationalTerms[region] || localizedContent.educationalTerms.DEFAULT
}

/**
 * Gets region-specific SEO content from JSON
 */
export function getSEOContent(region: Region) {
  return localizedContent.seoContent[region] || localizedContent.seoContent.DEFAULT
}

/**
 * Generates hreflang links for all supported locales
 */
export function generateHreflangLinks(baseUrl: string, currentPath: string = ''): Array<{ hreflang: string; href: string }> {
  const path = currentPath || '/'
  return localesConfig.supportedLocales.map(locale => ({
    hreflang: locale.hreflang,
    href: `${baseUrl}${path}`,
  }))
}

/**
 * Gets all supported locales
 */
export function getAllSupportedLocales(): LocaleInfo[] {
  return localesConfig.supportedLocales
    .map(locale => getLocaleConfig(locale.code as SupportedLocale))
    .filter((locale): locale is LocaleInfo => locale !== null)
}
