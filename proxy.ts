import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { LOCALE_DEBUG_HEADERS, LOCALE_DEBUG_QUERY } from './lib/locale'
import { getRequestCountryCode, isBlockedCountry } from './lib/blocked-countries'

function withLocaleDebugHeaders(request: NextRequest): NextResponse | null {
  const locale = request.nextUrl.searchParams.get(LOCALE_DEBUG_QUERY.locale)
  const region = request.nextUrl.searchParams.get(LOCALE_DEBUG_QUERY.region)

  if (!locale && !region) {
    return null
  }

  const requestHeaders = new Headers(request.headers)
  if (locale) requestHeaders.set(LOCALE_DEBUG_HEADERS.locale, locale)
  if (region) requestHeaders.set(LOCALE_DEBUG_HEADERS.region, region)

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

function blockedCountryResponse(countryCode: string): NextResponse {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Access unavailable | GuruForU</title>
  <style>
    body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
      font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#0f172a;color:#e2e8f0}
    main{max-width:28rem;padding:2rem;text-align:center}
    h1{font-size:1.5rem;margin:0 0 .75rem}
    p{margin:0;line-height:1.5;color:#94a3b8}
  </style>
</head>
<body>
  <main>
    <h1>Access unavailable</h1>
    <p>GuruForU is not available in your region.</p>
  </main>
</body>
</html>`

  return new NextResponse(html, {
    status: 403,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Blocked-Country': countryCode,
    },
  })
}

function isLocalOrInternalHost(hostname: string): boolean {
  return (
    hostname.includes('localhost') ||
    hostname.includes('127.0.0.1') ||
    hostname.includes('192.168.') ||
    hostname.includes('10.0.') ||
    hostname.includes('[::1]') ||
    hostname.includes('.run.app') ||
    hostname.includes('.cloudfunctions.net') ||
    process.env.NODE_ENV === 'development'
  )
}

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()

  const hostname =
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    url.hostname ||
    ''

  // Skip geo-block and www redirects for local / internal hosts.
  if (!isLocalOrInternalHost(hostname)) {
    const countryCode = getRequestCountryCode(request.headers)
    if (isBlockedCountry(countryCode) && countryCode) {
      return blockedCountryResponse(countryCode)
    }
  } else {
    return withLocaleDebugHeaders(request) ?? NextResponse.next()
  }

  const hostnameWithoutPort = hostname.split(':')[0].toLowerCase()

  // Canonicalize legacy demo URL directly to the live free-session page.
  if (url.pathname === '/book-demo') {
    url.hostname = 'www.guruforu.com'
    url.pathname = '/free-session'
    url.port = ''
    return NextResponse.redirect(url, 301)
  }

  // Redirect non-www to www
  if (hostnameWithoutPort === 'guruforu.com') {
    url.hostname = 'www.guruforu.com'
    if (!url.port || (url.port !== '443' && url.port !== '80')) {
      url.port = ''
    }
    return NextResponse.redirect(url, 301)
  }

  return withLocaleDebugHeaders(request) ?? NextResponse.next()
}

// Run on pages and API so blocked regions cannot hit lead forms either.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
}
