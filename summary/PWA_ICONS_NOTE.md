# PWA Icons Missing - Note

## Issue

The browser console shows 404 errors for missing PWA (Progressive Web App) icons:
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`
- `android-chrome-maskable-192x192.png`
- `android-chrome-maskable-512x512.png`

## Location

These icons should be in: `public/img/icons/`

Currently only these exist:
- `favicon-16x16.png`
- `favicon-32x32.png`

## Impact

- **Low priority** - App works fine without them
- Only affects PWA installation on Android devices
- Does not affect language switcher or core functionality
- Browser will use default icons instead

## To Fix (Optional)

If you want to add PWA support for Android:

1. Create app icons in these sizes:
   - 192x192 pixels
   - 512x512 pixels

2. Save them as:
   - `public/img/icons/android-chrome-192x192.png`
   - `public/img/icons/android-chrome-512x512.png`
   - `public/img/icons/android-chrome-maskable-192x192.png`
   - `public/img/icons/android-chrome-maskable-512x512.png`

3. Or update `dist/manifest.json` to remove these icon references

## Tools to Generate Icons

- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)

## Current Status

✅ **Language switcher is working perfectly**  
⚠️ **PWA icons missing** (optional feature)  
✅ **App functionality not affected**

---

**Note**: This is a separate issue from the language system and does not need immediate attention unless you want full PWA support.
