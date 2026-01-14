# Testing Guide for Development Mode

## 🚀 Starting Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000`

## ✅ Testing Checklist

### 1. **Visual Logo Testing**

#### Home Page
- Visit: `http://localhost:3000/`
- ✅ Check that the logo displays correctly (should be dark logo)
- ✅ Verify logo is visible and not broken

#### Blog Pages
- Visit: `http://localhost:3000/blog`
- ✅ Check header logo displays correctly
- ✅ Visit a blog post: `http://localhost:3000/blog/[categorySlug]/[slug]`
- ✅ Verify logo in header

### 2. **RSS Feed Testing**

#### Check RSS Feed
- Visit: `http://localhost:3000/feed.xml`
- ✅ Should see XML content (not HTML error)
- ✅ Verify feed contains blog posts
- ✅ Check that image URL uses dark logo: `guruforu-ai-education-logo-dark.png`

#### Validate RSS Feed
- Use online validator: https://validator.w3.org/feed/
- Or use browser extension: RSS Validator
- ✅ Should validate without errors

### 3. **Social Media Metadata Testing**

#### Open Graph (Facebook/LinkedIn)
- Visit: `http://localhost:3000/`
- Right-click → "View Page Source"
- Search for `og:image`
- ✅ Should see: `<meta property="og:image" content="https://guruforu.com/guruforu-ai-education-logo-dark.png" />`

#### Test with Facebook Debugger
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter: `http://localhost:3000` (or your production URL)
3. Click "Scrape Again"
4. ✅ Check preview shows dark logo
5. ✅ Verify image dimensions (1200x630)

#### Twitter Card Testing
- View page source
- Search for `twitter:image`
- ✅ Should see dark logo URL
- Test with: https://cards-dev.twitter.com/validator

### 4. **Structured Data Testing**

#### Check Structured Data in Source
- Visit any page
- Right-click → "View Page Source"
- Search for `application/ld+json`
- ✅ Should find JSON-LD scripts
- ✅ Verify logo URLs use dark logo

#### Test with Google Rich Results Test
1. Go to: https://search.google.com/test/rich-results
2. Enter your production URL (not localhost)
3. ✅ Should show valid structured data
4. ✅ FAQ schema should appear on home page
5. ✅ BlogPosting schema on blog posts

#### Test with Schema.org Validator
- Visit: https://validator.schema.org/
- Paste your page URL
- ✅ Should validate all schemas

### 5. **Favicon Testing**

#### Browser Tab Icon
- Visit any page
- ✅ Check browser tab shows dark logo as favicon
- ✅ Should appear in bookmarks

#### Apple Touch Icon
- On iOS device or simulator
- Add to home screen
- ✅ Should use dark logo

### 6. **Page-by-Page Testing**

#### Home Page (`/`)
```bash
# Test URL
http://localhost:3000/

# Check:
✅ Logo displays (dark version)
✅ FAQ schema in source code
✅ Open Graph tags
✅ Twitter Card tags
```

#### Blog Listing (`/blog`)
```bash
# Test URL
http://localhost:3000/blog

# Check:
✅ Logo displays
✅ Organization schema
✅ Blog schema
✅ Breadcrumb schema
```

#### Blog Post (`/blog/[categorySlug]/[slug]`)
```bash
# Test URL (example)
http://localhost:3000/blog/online-education/benefits-of-online-learning

# Check:
✅ Logo displays
✅ BlogPosting schema
✅ Organization schema
✅ Breadcrumb schema
✅ Open Graph tags
```

#### Category Page (`/blog/[categorySlug]`)
```bash
# Test URL (example)
http://localhost:3000/blog/online-education

# Check:
✅ Logo displays
✅ CollectionPage schema
✅ Organization schema
```

### 7. **Console Testing**

#### Check for Errors
1. Open browser DevTools (F12)
2. Go to Console tab
3. ✅ Should see no errors related to images
4. ✅ Check Network tab - logo should load successfully

#### Verify Image Loading
1. Open DevTools → Network tab
2. Filter by "Img"
3. Reload page
4. ✅ `guruforu-ai-education-logo-dark.png` should load (status 200)
5. ✅ No 404 errors

### 8. **Quick Verification Commands**

#### Check Logo References in Code
```bash
# Search for any remaining old logo references
grep -r "guruforu-ai-education-logo.png" app/

# Should return no results (all should be dark logo)
```

#### Verify Build
```bash
npm run build

# Should complete without errors
# Check that all routes are generated
```

## 🔍 Advanced Testing

### Test RSS Feed Programmatically
```bash
# Using curl
curl http://localhost:3000/feed.xml

# Should return valid XML
# Check for: guruforu-ai-education-logo-dark.png
```

### Test Metadata Extraction
```bash
# Using a tool like curl or httpie
# Extract Open Graph tags
curl -s http://localhost:3000 | grep -i "og:image"

# Should show dark logo URL
```

### Browser Extensions for Testing
1. **Open Graph Preview** (Chrome Extension)
   - Shows how your page will look when shared
   - ✅ Verify dark logo appears

2. **RSS Feed Reader**
   - Subscribe to: `http://localhost:3000/feed.xml`
   - ✅ Verify feed works and shows dark logo

3. **Schema.org Validator Extension**
   - Validates structured data on the page
   - ✅ Should show all schemas as valid

## 📱 Mobile Testing

### Test on Mobile Device
1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Visit: `http://[YOUR_IP]:3000` on mobile device
3. ✅ Logo should display correctly
4. ✅ Touch icon should work

## 🐛 Common Issues & Fixes

### Logo Not Showing
- ✅ Check file exists in `public/` folder
- ✅ Verify filename is exactly: `guruforu-ai-education-logo-dark.png`
- ✅ Check browser console for 404 errors

### RSS Feed Not Working
- ✅ Verify route file exists: `app/feed.xml/route.ts`
- ✅ Check server is running
- ✅ Try accessing directly: `http://localhost:3000/feed.xml`

### Metadata Not Updating
- ✅ Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- ✅ Clear browser cache
- ✅ Restart dev server

### Structured Data Errors
- ✅ Check JSON syntax in Script tags
- ✅ Validate with Google Rich Results Test
- ✅ Ensure all required fields are present

## 📊 Testing Checklist Summary

- [ ] Dev server starts without errors
- [ ] Home page logo displays (dark version)
- [ ] Blog pages logo displays (dark version)
- [ ] RSS feed accessible at `/feed.xml`
- [ ] RSS feed contains dark logo URL
- [ ] Open Graph tags use dark logo
- [ ] Twitter Card tags use dark logo
- [ ] Favicon shows dark logo
- [ ] Structured data uses dark logo
- [ ] No console errors
- [ ] No 404 errors for logo file
- [ ] Build completes successfully

---

**Quick Start Command:**
```bash
npm run dev
# Then visit http://localhost:3000
```
