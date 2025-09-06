import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  PlusIcon, TrashIcon, StrikethroughIcon, AlignLeftIcon, 
  AlignCenterIcon, AlignRightIcon, QuoteIcon, ListUnorderedIcon, ListOrderedIcon 
} from './icons';

interface Document {
  id: string;
  title: string;
  content: string;
  lastModified: number;
}

const initialDocs: Document[] = [
  {
    id: '1',
    title: 'Project Proposal',
    content: '<h1>Project Zenith Proposal</h1><p>This document outlines the scope, goals, and timeline for <b>Project Zenith</b>.</p><ul><li>Phase 1: Research</li><li>Phase 2: Development</li><li>Phase 3: Launch</li></ul>',
    lastModified: Date.now() - 1000 * 60 * 60 * 3,
  },
];

const ToolbarButton: React.FC<{
  onClick: (e: React.MouseEvent) => void;
  title: string;
  isActive?: boolean;
  children: React.ReactNode;
}> = ({ onClick, title, isActive = false, children }) => (
    <button
        title={title}
        onMouseDown={e => { e.preventDefault(); onClick(e); }}
        className={`p-2 w-10 h-10 flex items-center justify-center rounded transition-colors ${
            isActive ? 'bg-accent text-accent-text' : 'hover:bg-tertiary'
        }`}
    >
       {children}
    </button>
);

const WordProcessor: React.FC = () => {
  const [docs, setDocs] = useState<Document[]>(initialDocs);
  const [activeDocId, setActiveDocId] = useState<string | null>(initialDocs[0]?.id || null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean | string>>({});

  const activeDoc = docs.find((doc) => doc.id === activeDocId);

  // This effect synchronizes the editor's content when the active document changes.
  // It prevents the cursor from jumping by not re-rendering the component on every keystroke.
  useEffect(() => {
    const editor = editorRef.current;
    if (editor && activeDoc && editor.innerHTML !== activeDoc.content) {
      editor.innerHTML = activeDoc.content;
    } else if (editor && !activeDoc) {
      editor.innerHTML = '';
    }
  }, [activeDoc]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const updateFormatState = () => {
        const newFormats: Record<string, boolean | string> = {};
        newFormats.bold = document.queryCommandState('bold');
        newFormats.italic = document.queryCommandState('italic');
        newFormats.underline = document.queryCommandState('underline');
        newFormats.strikethrough = document.queryCommandState('strikeThrough');
        newFormats.justifyLeft = document.queryCommandState('justifyLeft');
        newFormats.justifyCenter = document.queryCommandState('justifyCenter');
        newFormats.justifyRight = document.queryCommandState('justifyRight');
        newFormats.insertUnorderedList = document.queryCommandState('insertUnorderedList');
        newFormats.insertOrderedList = document.queryCommandState('insertOrderedList');
        
        let blockType = document.queryCommandValue('formatBlock');
        if (['h1', 'h2', 'h3', 'p', 'blockquote'].includes(blockType)) {
            newFormats.blockType = blockType;
        } else {
            newFormats.blockType = 'p';
        }

        setActiveFormats(newFormats);
    };
    
    document.addEventListener('selectionchange', updateFormatState);
    editor.addEventListener('keyup', updateFormatState);
    editor.addEventListener('mouseup', updateFormatState);
    editor.addEventListener('focus', updateFormatState);

    return () => {
        document.removeEventListener('selectionchange', updateFormatState);
        editor.removeEventListener('keyup', updateFormatState);
        editor.removeEventListener('mouseup', updateFormatState);
        editor.removeEventListener('focus', updateFormatState);
    };
  }, [activeDocId]);

  const handleAddDoc = () => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title: 'Untitled Document',
      content: '<p><br></p>',
      lastModified: Date.now(),
    };
    setDocs([newDoc, ...docs]);
    setActiveDocId(newDoc.id);
  };

  const handleDeleteDoc = (id: string) => {
    const newDocs = docs.filter((doc) => doc.id !== id);
    setDocs(newDocs);
    if (activeDocId === id) {
      setActiveDocId(newDocs.length > 0 ? newDocs.sort((a,b) => b.lastModified - a.lastModified)[0].id : null);
    }
  };

  const handleUpdateDocContent = (value: string) => {
    if (!activeDocId) return;
    setDocs(
        docs.map((doc) =>
            doc.id === activeDocId
            ? { ...doc, content: value, lastModified: Date.now() }
            : doc
        )
    );
  };

  const handleUpdateDocTitle = (value: string) => {
      if (!activeDocId) return;
      setDocs(
          docs.map((doc) =>
              doc.id === activeDocId
              ? { ...doc, title: value, lastModified: Date.now() }
              : doc
          )
      );
  }

  const execCmd = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const wordCount = useMemo(() => {
      if (!activeDoc?.content) return 0;
      const text = editorRef.current?.innerText || '';
      return text.trim().split(/\s+/).filter(Boolean).length;
  }, [activeDoc?.content]);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Word Processor</h2>
      <div className="flex h-[calc(100vh-150px)] bg-secondary rounded-lg">
        {/* Document list sidebar */}
        <div className="w-1/3 border-r border-border-color flex flex-col">
          <div className="p-4 border-b border-border-color flex justify-between items-center">
            <h3 className="text-xl font-semibold">Documents</h3>
            <button onClick={handleAddDoc} className="text-accent hover:opacity-80 transition-opacity">
                <PlusIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="overflow-y-auto">
            {docs.sort((a, b) => b.lastModified - a.lastModified).map((doc) => (
              <div
                key={doc.id}
                onClick={() => setActiveDocId(doc.id)}
                className={`p-4 cursor-pointer border-l-4 ${
                  doc.id === activeDocId
                    ? 'bg-tertiary border-accent'
                    : 'border-transparent hover:bg-tertiary/50'
                }`}
              >
                <h4 className="font-semibold text-text-primary truncate">{doc.title}</h4>
                <p className="text-xs text-text-secondary mt-1">{new Date(doc.lastModified).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Editor */}
        <div className="w-2/3 flex flex-col bg-primary">
          {activeDoc ? (
            <>
              <div className="p-2 border-b border-border-color flex justify-between items-center bg-secondary">
                <input
                  type="text"
                  value={activeDoc.title}
                  onChange={(e) => handleUpdateDocTitle(e.target.value)}
                  className="bg-transparent text-xl font-semibold w-full focus:outline-none text-text-primary p-2"
                />
                 <button onClick={() => handleDeleteDoc(activeDoc.id)} className="text-text-secondary hover:text-danger p-2">
                    <TrashIcon className="w-5 h-5" />
                 </button>
              </div>
              <div className="p-1 border-b border-border-color flex items-center space-x-1 flex-wrap bg-secondary">
                <select 
                    value={activeFormats.blockType as string || 'p'} 
                    onChange={(e) => execCmd('formatBlock', e.target.value)}
                    className="bg-tertiary text-text-primary p-2 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-accent h-10"
                >
                    <option value="p">Paragraph</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                </select>
                <div className="w-px h-6 bg-border-color mx-2"></div>
                <ToolbarButton title="Bold" onClick={() => execCmd('bold')} isActive={!!activeFormats.bold}>
                    <span className="font-bold">B</span>
                </ToolbarButton>
                <ToolbarButton title="Italic" onClick={() => execCmd('italic')} isActive={!!activeFormats.italic}>
                    <span className="italic font-serif text-lg">I</span>
                </ToolbarButton>
                <ToolbarButton title="Underline" onClick={() => execCmd('underline')} isActive={!!activeFormats.underline}>
                    <span className="underline">U</span>
                </ToolbarButton>
                <ToolbarButton title="Strikethrough" onClick={() => execCmd('strikeThrough')} isActive={!!activeFormats.strikethrough}>
                    <StrikethroughIcon className="w-5 h-5" />
                </ToolbarButton>
                <div className="w-px h-6 bg-border-color mx-2"></div>
                <ToolbarButton title="Align Left" onClick={() => execCmd('justifyLeft')} isActive={!!activeFormats.justifyLeft}>
                    <AlignLeftIcon className="w-5 h-5" />
                </ToolbarButton>
                <ToolbarButton title="Align Center" onClick={() => execCmd('justifyCenter')} isActive={!!activeFormats.justifyCenter}>
                    <AlignCenterIcon className="w-5 h-5" />
                </ToolbarButton>
                <ToolbarButton title="Align Right" onClick={() => execCmd('justifyRight')} isActive={!!activeFormats.justifyRight}>
                    <AlignRightIcon className="w-5 h-5" />
                </ToolbarButton>
                <div className="w-px h-6 bg-border-color mx-2"></div>
                <ToolbarButton title="Unordered List" onClick={() => execCmd('insertUnorderedList')} isActive={!!activeFormats.insertUnorderedList}>
                    <ListUnorderedIcon className="w-5 h-5" />
                </ToolbarButton>
                 <ToolbarButton title="Ordered List" onClick={() => execCmd('insertOrderedList')} isActive={!!activeFormats.insertOrderedList}>
                    <ListOrderedIcon className="w-5 h-5" />
                </ToolbarButton>
                <ToolbarButton title="Blockquote" onClick={() => execCmd('formatBlock', 'blockquote')} isActive={activeFormats.blockType === 'blockquote'}>
                    <QuoteIcon className="w-5 h-5" />
                </ToolbarButton>
              </div>
              <div className="flex-grow p-4 lg:p-8 overflow-y-auto">
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => handleUpdateDocContent(e.currentTarget.innerHTML)}
                    className="bg-secondary p-8 rounded-lg shadow-inner min-h-full focus:outline-none text-text-primary leading-relaxed prose prose-invert max-w-none prose-p:my-2 prose-headings:my-4"
                    // FIX: Cast style object to React.CSSProperties to allow for CSS custom properties.
                    style={{
                        '--tw-prose-body': 'var(--text-primary)',
                        '--tw-prose-headings': 'var(--text-primary)',
                        '--tw-prose-bold': 'var(--text-primary)',
                        '--tw-prose-bullets': 'var(--text-secondary)',
                        '--tw-prose-blockquote': 'var(--text-secondary)',
                        '--tw-prose-code': 'var(--text-primary)',
                    } as React.CSSProperties}
                />
              </div>
              <div className="p-2 border-t border-border-color text-right text-sm text-text-secondary bg-secondary">
                  {wordCount} {wordCount === 1 ? 'word' : 'words'}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-text-secondary">
              <p>Select a document or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordProcessor;