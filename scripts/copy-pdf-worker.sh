#!/bin/bash

# Script to copy PDF.js worker to public directory
# Run this after npm install or when pdfjs-dist is updated
# Uses the version from react-pdf's dependencies to ensure version match

SOURCE="node_modules/react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min.mjs"
DEST="public/pdf.worker.min.mjs"

if [ -f "$SOURCE" ]; then
    cp "$SOURCE" "$DEST"
    echo "✅ PDF.js worker copied successfully to $DEST"
    echo "📦 Using version from react-pdf's pdfjs-dist dependency"
else
    echo "❌ Error: $SOURCE not found. Make sure react-pdf is installed."
    exit 1
fi
