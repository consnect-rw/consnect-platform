# PDF Viewer Setup

This project uses `react-pdf` with `pdfjs-dist` to display PDF documents.

## How It Works

The PDF.js worker file is served locally from the `public` directory instead of from a CDN to avoid CORS and network issues in Next.js.

**Important**: The worker file MUST match the exact version of `pdfjs-dist` that `react-pdf` uses internally. We copy the worker from `react-pdf`'s own `pdfjs-dist` dependency to ensure version compatibility.

## Files

- **Worker File**: `public/pdf.worker.min.mjs` - The PDF.js web worker
- **Component**: `src/components/ui/PdfViewer.tsx` - Main PDF viewer component
- **Used By**: 
  - `src/components/cards/CompanyDocumentCard.tsx`
  - `src/components/cards/DocumentCard.tsx`
  - `src/components/cards/CatalogCard.tsx`

## Setup

The worker file is automatically copied from `react-pdf`'s pdfjs-dist dependency to `public` directory:

1. **Automatically after `npm install`** via the `postinstall` script in `package.json`
2. **Manually** by running: `./scripts/copy-pdf-worker.sh`

**Critical**: The worker is copied from `node_modules/react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min.mjs` (NOT from the top-level pdfjs-dist) to ensure version compatibility with react-pdf.

## Important Notes

1. **Dynamic Import Required**: Always import PdfViewer using `next/dynamic` with `ssr: false` to avoid SSR issues:

```typescript
const PdfViewer = dynamic(() => import("@/components/ui/PdfViewer").then(mod => ({ default: mod.PdfViewer })), {
  ssr: false,
  loading: () => <div>Loading PDF Viewer...</div>
});
```

2. **Worker Location**: The worker is configured to load from `/pdf.worker.min.mjs` in the public directory

3. **After Updating pdfjs-dist**: If you update the `pdfjs-dist` package version, the worker file will be automatically copied during `npm install`

## Troubleshooting

### Version Mismatch Error

If you see "The API version does not match the Worker version":

1. This means the worker file version doesn't match react-pdf's pdfjs-dist version
2. Run: `./scripts/copy-pdf-worker.sh` to copy the correct version
3. The script copies from react-pdf's own pdfjs-dist dependency
4. Restart the dev server

### Worker Not Found Error

If you see "Failed to fetch worker" errors:

1. Check that `public/pdf.worker.min.mjs` exists
2. Run: `npm run postinstall` or `./scripts/copy-pdf-worker.sh`
3. Restart the dev server

### DOMMatrix SSR Error

If you see "DOMMatrix is not defined":

1. Ensure you're using dynamic import with `ssr: false`
2. Never import PdfViewer directly in server components

### PDF Not Loading

Common causes:
- **CORS Issues**: Ensure your PDF URLs allow cross-origin requests
- **Invalid URL**: Check that the PDF URL is accessible
- **File Format**: Ensure the file is actually a valid PDF

The PdfViewer component provides user-friendly error messages with fallback options (download, open in new tab).

## Development

When working with the PDF viewer:

1. Always test with real PDF URLs
2. Test error states with invalid URLs
3. Check browser console for detailed error messages
4. Verify the worker loads correctly in Network tab

## Production

Before deploying:

1. Ensure `public/pdf.worker.min.mjs` is committed to git
2. Verify the postinstall script runs during build
3. Test PDF viewing in production environment
