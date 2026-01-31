"use client";

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIconLucide, 
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  Undo,
  Redo,
  Code
} from 'lucide-react';

interface MenuButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}

const MenuButton = ({ onClick, isActive, disabled, children, title }: MenuButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    type='button'
    className={`p-2 rounded hover:bg-yellow-50 transition-colors ${
      isActive ? 'bg-yellow-100 text-yellow-600' : 'text-gray-700'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);
interface RichTextEditorProps {
  /** Initial HTML content to display in the editor */
  defaultValue?: string;
  /** Callback function triggered on content change, receives HTML string */
  onChange?: (html: string) => void;
  /** Placeholder text shown when editor is empty */
  placeholder?: string;
  /** Whether the editor content is editable */
  editable?: boolean;
  /** Minimum height of the editor */
  minHeight?: string;
  /** Maximum height of the editor */
  maxHeight?: string;
}

export const RichTextEditor = ({ 
  defaultValue = '', 
  onChange,
  placeholder = 'Start typing...',
  editable = true,
  minHeight = '200px',
  maxHeight = '500px'
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-yellow-600 underline hover:text-yellow-700',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: defaultValue,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    immediatelyRender: false
  });

  useEffect(() => {
    if (editor && defaultValue !== editor.getHTML()) {
      editor.commands.setContent(defaultValue);
    }
  }, [defaultValue, editor]);

  const setLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-gray-50">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <MenuButton
           disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIconLucide size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Inline Code"
          >
            <Code size={18} />
          </MenuButton>
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Heading1 size={18} />
          </MenuButton>
          <MenuButton
               disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 size={18} />
          </MenuButton>
          <MenuButton
               disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Heading3 size={18} />
          </MenuButton>
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <MenuButton
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List size={18} />
          </MenuButton>
          <MenuButton
               disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered size={18} />
          </MenuButton>
        </div>

        {/* Alignment */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <MenuButton
          disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <AlignLeft size={18} />
          </MenuButton>
          <MenuButton
          disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <AlignCenter size={18} />
          </MenuButton>
          <MenuButton
          disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <AlignRight size={18} />
          </MenuButton>
        </div>

        {/* Link */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <MenuButton
               disabled={!editor.can().undo()}
            onClick={setLink}
            isActive={editor.isActive('link')}
            title="Insert Link"
          >
            <Link2 size={18} />
          </MenuButton>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <MenuButton
               isActive={true}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo size={18} />
          </MenuButton>
          <MenuButton
               isActive={true}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            <Redo size={18} />
          </MenuButton>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className="prose prose-sm max-w-none"
        style={{ 
          minHeight,
          maxHeight,
          overflow: 'auto'
        }}
      />

      <style jsx global>{`
        .ProseMirror {
          padding: 1rem;
          outline: none;
          min-height: ${minHeight};
          max-height: ${maxHeight};
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }

        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          color: #854d0e;
        }

        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          color: #a16207;
        }

        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          color: #ca8a04;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }

        .ProseMirror li {
          margin: 0.25rem 0;
        }

        .ProseMirror code {
          background-color: #fef3c7;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: monospace;
          font-size: 0.9em;
        }

        .ProseMirror pre {
          background-color: #374151;
          color: #e2e8f0;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
        }

        .ProseMirror pre code {
          background: none;
          padding: 0;
          color: inherit;
        }

        .ProseMirror blockquote {
          border-left: 4px solid #fbbf24;
          padding-left: 1rem;
          margin-left: 0;
          font-style: italic;
          color: #4b5563;
        }

        .ProseMirror a {
          color: #ca8a04;
          text-decoration: underline;
        }

        .ProseMirror a:hover {
          color: #a16207;
        }
      `}</style>
    </div>
  );
};

