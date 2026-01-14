# RSC (_rsc) Request Optimization Guide

## What are _rsc Requests?

`_rsc` (React Server Component) requests are Next.js App Router's way of fetching component data during client-side navigation. They're necessary for client-side navigation but can be excessive if prefetching is enabled.

## Optimization Applied: Disabled Prefetching Completely ✅

**All Links Now Have `prefetch={false}`:**
- Blog post links
- Category links
- Navigation breadcrumbs
- Footer links
- All internal links

**Result:** Eliminates ALL automatic prefetch requests. RSC requests only happen when user actually clicks a link.

### 2. **Route Segment Config** ✅

Added to blog pages:
```typescript
export const revalidate = 3600 // Revalidate every hour
export const dynamic = 'force-static' // Force static generation
```

**Benefits:**
- Pages are fully static (no runtime RSC generation)
- Cached for 1 hour, reducing duplicate requests
- Faster page loads

## Expected Reduction

**Before:**
- Every link in viewport prefetched → Many `_rsc` requests
- Automatic prefetching on page load
- All links treated equally

**After:**
- **ZERO automatic prefetch requests** → Only fetch on actual click
- RSC requests only when user navigates
- No prefetching overhead

## How to Verify

### 1. Check Network Tab

1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Navigate between pages
4. Count `_rsc` requests

**Expected:**
- ✅ **ZERO `_rsc` requests on page load** (no prefetching)
- ✅ Only 1 `_rsc` request when user clicks a link
- ✅ No automatic prefetch requests

### 2. Test Fast Navigation

1. Quickly click between blog posts
2. Check Network tab
3. Should see fewer `_rsc` requests
4. Cached requests should be reused

### 3. Monitor Request Count

**Before optimization:**
- Blog listing page: ~10-15 `_rsc` requests (all links prefetched automatically)
- Page load: Many prefetch requests immediately

**After optimization:**
- Blog listing page: **0 `_rsc` requests on load** (no prefetching)
- Only 1 `_rsc` request when user clicks a link
- **~90-100% reduction in RSC requests**

## Why Some _rsc Requests Are Still Needed

1. **User Navigation** - When user clicks a link, RSC payload is needed for client-side navigation
2. **Client-Side Routing** - Next.js App Router requires RSC for fast client-side navigation
3. **Cannot Be Completely Removed** - RSC is core to Next.js App Router functionality

**Note:** We've eliminated automatic prefetching, but RSC requests will still occur when users navigate. This is expected and necessary for the App Router to work.

## Additional Optimizations (Future)

If you still see too many requests:

1. **Reduce Blog Cards on Listing Page**
   - Show fewer blog cards initially
   - Use pagination or "Load More"

2. **Lazy Load Footer**
   - Load footer links only when scrolled to bottom

3. **Use Intersection Observer**
   - Only prefetch links when they're about to be visible

4. **Implement Request Deduplication**
   - Next.js already does this, but can be enhanced

## Summary

✅ **Optimizations Applied:**
- **Disabled prefetching on ALL links** (`prefetch={false}`)
- Added route segment config for static generation
- Optimized blog pages for better caching

**Result:** **~90-100% reduction in automatic `_rsc` requests**. RSC requests now only occur when users actually click links, not automatically on page load.

### Trade-offs

**Benefits:**
- ✅ Zero automatic prefetch requests
- ✅ Reduced server load
- ✅ Lower bandwidth usage
- ✅ Faster initial page load

**Trade-offs:**
- ⚠️ Navigation may feel slightly slower (no prefetching)
- ⚠️ First click on a link will fetch RSC payload
- ⚠️ Subsequent navigation is still fast (client-side routing)

**Recommendation:** This approach is ideal if you want to minimize server requests and bandwidth usage. Navigation is still fast due to client-side routing, just without the prefetching overhead.
