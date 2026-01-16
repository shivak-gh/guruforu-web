import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  
  // Get hostname from various headers (Cloud Run may use x-forwarded-host)
  const hostname = 
    request.headers.get('x-forwarded-host') || 
    request.headers.get('host') || 
    url.hostname || 
    ''

  // Skip redirects for localhost and internal IPs (development/testing)
  if (
    hostname.includes('localhost') ||
    hostname.includes('127.0.0.1') ||
    hostname.includes('192.168.') ||
    hostname.includes('10.0.') ||
    hostname.includes('[::1]') ||
    hostname.includes('.run.app') || // Cloud Run default domain
    hostname.includes('.cloudfunctions.net') || // Cloud Functions
    process.env.NODE_ENV === 'development'
  ) {
    return NextResponse.next()
  }

  // Normalize hostname (remove port for comparison)
  const hostnameWithoutPort = hostname.split(':')[0].toLowerCase()

  // Redirect non-www to www
  if (hostnameWithoutPort === 'guruforu.com') {
    // Preserve protocol, pathname, and search params
    url.hostname = 'www.guruforu.com'
    // Keep the port if it was specified (though for production we want standard ports)
    if (!url.port || (url.port !== '443' && url.port !== '80')) {
      // Remove non-standard ports for production redirects
      url.port = ''
    }
    // Use 301 permanent redirect for SEO
    return NextResponse.redirect(url, 301)
  }

  // Optional: Force HTTPS (uncomment if you want to enforce HTTPS)
  // if (request.headers.get('x-forwarded-proto') !== 'https') {
  //   url.protocol = 'https:'
  //   return NextResponse.redirect(url, 301)
  // }

  return NextResponse.next()
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (static files)
     * - files with extensions (static files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
}
