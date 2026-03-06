# PDF Viewer Version Mismatch Fix

## Problem

You were experiencing this error:
```
UnknownErrorException: The API version "5.4.296" does not match the Worker version "5.4.624".
```

## Root Cause

The project had **two different versions** of `pdfjs-dist` installed:

1. **Top-level**: `pdfjs-dist@5.4.624` (manually added to package.json)
2. **From react-pdf**: `pdfjs-dist@5.4.296` (dependency of react-pdf@10.4.0)

When using `react-pdf`, it internally uses its own bundled version of `pdfjs-dist` (5.4.296), but we were copying the worker file from the top-level version (5.4.624), causing a version mismatch.

## Solution

### 1. Removed Duplicate Package
- Removed `pdfjs-dist@5.4.624` from `package.json` dependencies
- React-pdf already includes its own `pdfjs-dist@5.4.296`

### 2. Updated Worker Source Path
Changed the worker copy source in both:
- **package.json postinstall script**
- **scripts/copy-pdf-worker.sh**

From:
```bash
node_modules/pdfjs-dist/build/pdf.worker.min.mjs
```

To:
```bash
node_modules/react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min.mjs
```

### 3. Ran npm install
This removed the duplicate package and ran the postinstall script to copy the correct worker version.

## Result

✅ Only one version of pdfjs-dist now: **5.4.296** (from react-pdf)  
✅ Worker file matches react-pdf's version: **5.4.296**  
✅ No version mismatch errors  
✅ Automatic updates when react-pdf updates pdfjs-dist

## Key Takeaway

**Never manually install `pdfjs-dist`** when using `react-pdf`. Always use the version that comes bundled with react-pdf to avoid version conflicts.

## Files Modified

- ✏️ `package.json` - Removed pdfjs-dist, updated postinstall script
- ✏️ `scripts/copy-pdf-worker.sh` - Updated source path
- ✏️ `docs/PDF_VIEWER_SETUP.md` - Updated documentation
- 🔄 `public/pdf.worker.min.mjs` - Updated to correct version (5.4.296)

## Future Updates

When react-pdf updates and changes its pdfjs-dist version:
1. Run `npm install` (postinstall script handles it)
2. Or manually run `./scripts/copy-pdf-worker.sh`
3. The worker will always match react-pdf's version ✅
