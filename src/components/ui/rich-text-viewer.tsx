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
      className={`rich-text-view ${showBorder ? 'border border-gray-300 rounded-lg' : ''} bg-white ${className}`}
      style={{
        minHeight,
        maxHeight,
        overflow: maxHeight ? 'auto' : 'visible',
      }}
    >
      <div
        className="prose prose-sm max-w-none p-4"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <style jsx>{`
        .rich-text-view :global(h1) {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          color: #854d0e;
        }

        .rich-text-view :global(h2) {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          color: #a16207;
        }

        .rich-text-view :global(h3) {
          font-size: 1.25em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          color: #ca8a04;
        }

        .rich-text-view :global(p) {
          margin: 0.5rem 0;
          line-height: 1.6;
          color: #475569;
        }

        .rich-text-view :global(strong) {
          font-weight: 600;
          color: #1e293b;
        }

        .rich-text-view :global(em) {
          font-style: italic;
        }

        .rich-text-view :global(u) {
          text-decoration: underline;
        }

        .rich-text-view :global(s) {
          text-decoration: line-through;
        }

        .rich-text-view :global(ul),
        .rich-text-view :global(ol) {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }

        .rich-text-view :global(li) {
          margin: 0.25rem 0;
          color: #475569;
        }

        .rich-text-view :global(code) {
          background-color: #fef3c7;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
          color: #92400e;
        }

        .rich-text-view :global(pre) {
          background-color: #374151;
          color: #e2e8f0;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .rich-text-view :global(pre code) {
          background: none;
          padding: 0;
          color: inherit;
        }

        .rich-text-view :global(blockquote) {
          border-left: 4px solid #fbbf24;
          padding-left: 1rem;
          margin-left: 0;
          margin: 1rem 0;
          font-style: italic;
          color: #64748b;
          background-color: #fef3c7;
          padding: 1rem;
          border-radius: 0.5rem;
        }

        .rich-text-view :global(a) {
          color: #ca8a04;
          text-decoration: underline;
          transition: color 0.2s;
        }

        .rich-text-view :global(a:hover) {
          color: #a16207;
        }

        .rich-text-view :global([style*="text-align: center"]) {
          text-align: center;
        }

        .rich-text-view :global([style*="text-align: right"]) {
          text-align: right;
        }

        .rich-text-view :global([style*="text-align: left"]) {
          text-align: left;
        }
      `}</style>
    </div>
  );
};

export default RichTextView;