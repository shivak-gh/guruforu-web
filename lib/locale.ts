import localesConfig from './locales.json'
import localizedContent from './localized-content.json'

export type SupportedLocale = 'en-US' | 'en-GB' | 'en-CA' | 'en-AU' | 'en-NZ' | 'en-QA' | 'en-AE' | 'en-IN' | 'x-default'
export type Region = 'US' | 'UK' | 'CA' | 'AU' | 'NZ' | 'QA' | 'AE' | 'IN' | 'DEFAULT'

export interface AboutTopicItem {
  label: string
  text: string
}

export interface AboutPageSeo {
  title: string
  description: string
  keywords: string[]
  ogTitle: string
  ogDescription: string
}

export interface AboutPageContent {
  heroBadge: string
  trustGradeValue: string
  trustGradeLabel: string
  examPrepCard: string
  globalCurriculumCard: string
  subjectsSectionDesc: string
  mathTopics: AboutTopicItem[]
  mathAlignmentNote: string
  scienceTopics: AboutTopicItem[]
  scienceAlignmentNote: string
  globalReachCard: string
  faqMathAnswer: string
  faqScienceAnswer: string
  orgSchemaDescription: string
  orgSchemaKnowsAbout: string[]
}

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

/** Live debugging — append to any URL, e.g. ?gf_region=IN or ?gf_locale=en-IN */
export const LOCALE_DEBUG_QUERY = {
  locale: 'gf_locale',
  region: 'gf_region',
} as const

export const LOCALE_DEBUG_HEADERS = {
  locale: 'x-gf-locale-override',
  region: 'x-gf-region-override',
} as const

export interface LocaleDebugOverride {
  locale?: string | null
  region?: string | null
}

export function getLocaleDebugParams(
  source?: URLSearchParams | { get: (key: string) => string | null } | null
): LocaleDebugOverride {
  if (!source) return {}
  return {
    locale: source.get(LOCALE_DEBUG_QUERY.locale),
    region: source.get(LOCALE_DEBUG_QUERY.region),
  }
}

function resolveLocaleDebugOverride(override: LocaleDebugOverride): LocaleInfo | null {
  const { locale, region } = override
  const detectionConfig = localesConfig.detection

  if (locale) {
    const normalized = locale.trim().toLowerCase()
    const match = localesConfig.supportedLocales.find(
      (entry) =>
        entry.code.toLowerCase() === normalized ||
        entry.hreflang.toLowerCase() === normalized ||
        entry.region.toLowerCase() === normalized
    )
    if (match) {
      return getLocaleConfig(match.code as SupportedLocale)
    }
  }

  if (region) {
    const code = region.trim().toUpperCase()
    const mappedLocale =
      detectionConfig.countryCodeMapping[
        code as keyof typeof detectionConfig.countryCodeMapping
      ]
    if (mappedLocale) {
      return getLocaleConfig(mappedLocale as SupportedLocale)
    }

    const byRegion = localesConfig.supportedLocales.find((entry) => entry.region === code)
    if (byRegion) {
      return getLocaleConfig(byRegion.code as SupportedLocale)
    }
  }

  return null
}

function readDebugOverrideFromHeaders(
  headers?: Headers | { get: (key: string) => string | null }
): LocaleDebugOverride | null {
  if (!headers) return null

  const locale = headers.get(LOCALE_DEBUG_HEADERS.locale)
  const region = headers.get(LOCALE_DEBUG_HEADERS.region)
  if (!locale && !region) return null

  return { locale, region }
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
function parseAcceptLanguage(header: string): string[] {
  return header
    .split(',')
    .map((part) => part.trim().split(';')[0].toLowerCase())
    .filter(Boolean)
}

function matchLanguageTag(
  tag: string,
  languageMapping: Record<string, string>
): SupportedLocale | null {
  const normalized = tag.toLowerCase()

  if (languageMapping[normalized]) {
    return languageMapping[normalized] as SupportedLocale
  }

  for (const [key, locale] of Object.entries(languageMapping)) {
    if (normalized.startsWith(`${key}-`)) {
      return locale as SupportedLocale
    }
  }

  return null
}

export function detectLocale(
  headers?: Headers | { get: (key: string) => string | null },
  debugOverride?: LocaleDebugOverride
): LocaleInfo {
  let override = debugOverride

  if (!override?.locale && !override?.region) {
    override = readDebugOverrideFromHeaders(headers) ?? override
  }

  if (!override?.locale && !override?.region && typeof window !== 'undefined') {
    override = getLocaleDebugParams(new URLSearchParams(window.location.search))
  }

  const debugLocale = resolveLocaleDebugOverride(override ?? {})
  if (debugLocale) {
    return debugLocale
  }

  let detectedLocale: SupportedLocale = localesConfig.defaultLocale as SupportedLocale
  const detectionConfig = localesConfig.detection

  if (headers) {
    // Country headers take priority — geo beats browser language preferences
    for (const headerKey of detectionConfig.headerKeys) {
      if (!headerKey.includes('country') && !headerKey.includes('ipcountry')) continue

      const value = headers.get(headerKey)
      if (!value) continue

      const countryCode = value.toUpperCase()
      const mappedLocale =
        detectionConfig.countryCodeMapping[
          countryCode as keyof typeof detectionConfig.countryCodeMapping
        ]

      if (mappedLocale) {
        detectedLocale = mappedLocale as SupportedLocale
        const localeConfig = getLocaleConfig(detectedLocale)
        return localeConfig || getLocaleConfig(localesConfig.defaultLocale as SupportedLocale)!
      }
    }

    // Fall back to primary Accept-Language tag only (not secondary q= values)
    const acceptLanguage = headers.get('accept-language')
    if (acceptLanguage) {
      const languageTags = parseAcceptLanguage(acceptLanguage)
      for (const tag of languageTags) {
        const matched = matchLanguageTag(tag, detectionConfig.languageMapping)
        if (matched) {
          detectedLocale = matched
          break
        }
      }
    }
  } else if (typeof window !== 'undefined') {
    const browserLanguages = [
      navigator.language,
      ...(navigator.languages || []),
    ].filter(Boolean)

    for (const tag of browserLanguages) {
      const matched = matchLanguageTag(tag, detectionConfig.languageMapping)
      if (matched) {
        detectedLocale = matched
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
  const terms = localizedContent.educationalTerms as Record<Region, (typeof localizedContent.educationalTerms)['DEFAULT']>
  return terms[region] || terms.DEFAULT
}

/**
 * Gets region-specific SEO content from JSON
 */
export function getSEOContent(region: Region) {
  const content = localizedContent.seoContent as Record<Region, (typeof localizedContent.seoContent)['DEFAULT']>
  return content[region] || content.DEFAULT
}

/**
 * Gets region-specific About page content from JSON
 */
export function getAboutPageContent(region: Region): AboutPageContent {
  const content = localizedContent.aboutPageContent as Record<Region, AboutPageContent>
  return content[region] || content.DEFAULT
}

/**
 * Gets region-specific About page SEO metadata from JSON
 */
export function getAboutPageSeo(region: Region): AboutPageSeo {
  const seo = localizedContent.aboutPageSeo as Record<Region, AboutPageSeo>
  return seo[region] || seo.DEFAULT
}

/**
 * Generates hreflang links for all supported locales
 * All locales point to the same URL (single-URL site with locale detection)
 * Each page must include a self-referencing hreflang tag
 */
export function generateHreflangLinks(baseUrl: string, currentPath: string = ''): Array<{ hreflang: string; href: string }> {
  // Normalize path: ensure it starts with / and doesn't have trailing slash (except root)
  let path = currentPath.trim()
  if (!path || path === '') {
    path = '/'
  } else if (!path.startsWith('/')) {
    path = '/' + path
  }
  // Remove trailing slash for non-root paths
  if (path !== '/' && path.endsWith('/')) {
    path = path.slice(0, -1)
  }
  
  // For single-URL sites, all hreflang tags point to the same URL (current page)
  // This is correct for sites that detect locale but use the same URL structure
  const fullUrl = `${baseUrl}${path}`
  
  return localesConfig.supportedLocales.map(locale => ({
    hreflang: locale.hreflang,
    href: fullUrl,
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
