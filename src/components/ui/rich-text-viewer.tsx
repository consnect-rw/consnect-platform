"use client";
import React from 'react';

interface RichTextViewProps {
  /** HTML content to display */
  content: string;
  /** Additional CSS classes for the container */
  className?: string;
  /** Minimum height of the view container */
  minHeight?: string;
  /** Maximum height of the view container (adds scroll if exceeded) */
  maxHeight?: string;
  /** Whether to show a border around the content */
  showBorder?: boolean;
}

const RichTextView: React.FC<RichTextViewProps> = ({
  content,
  className = '',
  minHeight,
  maxHeight,
  showBorder = true,
}) => {
  return (
    <div
      className={`rich-text-view ${showBorder ? 'border-2 border-gray-200 rounded-xl' : ''} bg-white overflow-hidden ${className}`}
      style={{ minHeight, maxHeight, overflow: maxHeight ? 'auto' : 'visible' }}
    >
      <div
        className="rtv-content prose prose-sm max-w-none p-5"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <style jsx>{`
        /* ── Headings ─────────────────────────────────────────────────── */
        .rtv-content :global(h1) {
          font-size: 2em;
          font-weight: 800;
          margin: 0.7em 0 0.3em;
          color: #111827;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .rtv-content :global(h2) {
          font-size: 1.5em;
          font-weight: 700;
          margin: 0.6em 0 0.3em;
          color: #1f2937;
          line-height: 1.3;
        }
        .rtv-content :global(h3) {
          font-size: 1.2em;
          font-weight: 700;
          margin: 0.5em 0 0.25em;
          color: #374151;
          line-height: 1.4;
        }

        /* ── Paragraphs ───────────────────────────────────────────────── */
        .rtv-content :global(p) {
          margin: 0.5rem 0;
          line-height: 1.75;
          color: #374151;
        }

        /* ── Inline formatting ────────────────────────────────────────── */
        .rtv-content :global(strong) { font-weight: 700; color: #111827; }
        .rtv-content :global(em)     { font-style: italic; }
        .rtv-content :global(u)      { text-decoration: underline; text-underline-offset: 3px; }
        .rtv-content :global(s)      { text-decoration: line-through; color: #9ca3af; }

        /* ── Lists ────────────────────────────────────────────────────── */
        .rtv-content :global(ul),
        .rtv-content :global(ol) {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .rtv-content :global(li) {
          margin: 0.3rem 0;
          color: #374151;
          line-height: 1.7;
        }
        .rtv-content :global(ul li::marker) { color: #f59e0b; font-size: 1.1em; }
        .rtv-content :global(ol li::marker) { color: #d97706; font-weight: 700; }

        /* ── Code ─────────────────────────────────────────────────────── */
        .rtv-content :global(code) {
          background: #fef3c7;
          padding: 0.15em 0.45em;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.88em;
          color: #92400e;
          border: 1px solid #fde68a;
        }
        .rtv-content :global(pre) {
          background: #111827;
          color: #f9fafb;
          padding: 1.25rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          margin: 1rem 0;
          border: 1px solid #1f2937;
        }
        .rtv-content :global(pre code) {
          background: none;
          padding: 0;
          color: inherit;
          border: none;
        }

        /* ── Blockquote ───────────────────────────────────────────────── */
        .rtv-content :global(blockquote) {
          border-left: 4px solid #fbbf24;
          padding: 0.875rem 1.25rem;
          margin: 1.25rem 0;
          background: #fffbeb;
          border-radius: 0 0.625rem 0.625rem 0;
          color: #78350f;
          font-style: italic;
        }

        /* ── Links ────────────────────────────────────────────────────── */
        .rtv-content :global(a) {
          color: #d97706;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color 0.15s;
        }
        .rtv-content :global(a:hover) { color: #92400e; }

        /* ── Images ───────────────────────────────────────────────────── */
        .rtv-content :global(img) {
          display: block;
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 1.5rem auto;
          border: 2px solid #e5e7eb;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.07);
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .rtv-content :global(img:hover) {
          border-color: #fcd34d;
          box-shadow: 0 6px 28px rgba(0, 0, 0, 0.12);
        }

        /* ── Text alignment ───────────────────────────────────────────── */
        .rtv-content :global([style*="text-align: center"]) { text-align: center; }
        .rtv-content :global([style*="text-align: right"])  { text-align: right;  }
        .rtv-content :global([style*="text-align: left"])   { text-align: left;   }
      `}</style>
    </div>
  );
};

export default RichTextView;