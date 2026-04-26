import React, { useState } from 'react';
import CoverEditor from './CoverEditor';
import PagesList from './PagesList';
import PageEditor from './PageEditor';
import BookPreview from './BookPreview';
import StickerLibrary from './StickerLibrary';
import OrderForm from './OrderForm';

const MemoryBook = ({ initialImage, onBack }) => {
  const [book, setBook] = useState({
    cover: {
      photo: initialImage || null,
      photoX: 0,
      photoY: 0,
      photoScale: 1,
      title: 'My Memory Book',
      author: '',
      color: '#FFB7C5',
      titleFont: 'Dancing Script',
      stickers: [],
    },
    pages: [{ 
      id: Date.now(), 
      photos: [], 
      photoX: 0, 
      photoY: 0, 
      photoScale: 1, 
      text: '', 
      textAlign: 'center',   // ✅ default alignment
      color: '#FFF5E1', 
      stickers: [], 
      border: 'none' 
    }],
  });
  
  const [activeTab, setActiveTab] = useState('cover');
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showStickers, setShowStickers] = useState(false);

  const updateCover = (updates) =>
    setBook(prev => ({ ...prev, cover: { ...prev.cover, ...updates } }));

  const updatePage = (pageId, updates) =>
    setBook(prev => ({
      ...prev,
      pages: prev.pages.map(p => p.id === pageId ? { ...p, ...updates } : p),
    }));

  const addPage = () => {
    if (book.pages.length >= 20) {
      alert("Maximum 20 pages allowed!");
      return;
    }
    const newPage = { 
      id: Date.now(), 
      photos: [], 
      photoX: 0, 
      photoY: 0, 
      photoScale: 1, 
      text: '', 
      textAlign: 'center',   // ✅ new pages also get default alignment
      color: '#FFF5E1', 
      stickers: [], 
      border: 'none' 
    };
    setBook(prev => ({ ...prev, pages: [...prev.pages, newPage] }));
    setSelectedPageId(newPage.id);
  };

  const deletePage = (pageId) => {
    if (book.pages.length <= 1) {
      alert("You need at least one page!");
      return;
    }
    const remaining = book.pages.filter(p => p.id !== pageId);
    setBook(prev => ({ ...prev, pages: remaining }));
    if (selectedPageId === pageId) {
      setSelectedPageId(remaining[0]?.id || null);
    }
  };

  const reorderPages = (fromIndex, toIndex) => {
    const newPages = [...book.pages];
    const [removed] = newPages.splice(fromIndex, 1);
    newPages.splice(toIndex, 0, removed);
    setBook(prev => ({ ...prev, pages: newPages }));
  };

  const addStickerToCover = (emoji) => {
    updateCover({
      stickers: [...book.cover.stickers, { emoji, x: 100, y: 100, id: Date.now() }]
    });
  };

  const addStickerToPage = (pageId, emoji) => {
    const page = book.pages.find(p => p.id === pageId);
    if (page) {
      updatePage(pageId, {
        stickers: [...page.stickers, { emoji, x: 100, y: 100, id: Date.now() }]
      });
    }
  };

  const removeStickerFromCover = (stickerId) => {
    updateCover({
      stickers: book.cover.stickers.filter(s => s.id !== stickerId)
    });
  };

  const removeStickerFromPage = (pageId, stickerId) => {
    const page = book.pages.find(p => p.id === pageId);
    if (page) {
      updatePage(pageId, {
        stickers: page.stickers.filter(s => s.id !== stickerId)
      });
    }
  };

  const updateStickerPosition = (type, stickerId, x, y, pageId = null) => {
    if (type === 'cover') {
      updateCover({
        stickers: book.cover.stickers.map(s => 
          s.id === stickerId ? { ...s, x, y } : s
        )
      });
    } else if (type === 'page' && pageId) {
      const page = book.pages.find(p => p.id === pageId);
      if (page) {
        updatePage(pageId, {
          stickers: page.stickers.map(s => 
            s.id === stickerId ? { ...s, x, y } : s
          )
        });
      }
    }
  };

  const handleDownload = () => {
    const previewElement = document.getElementById('book-preview');
    if (previewElement) {
      setShowPreview(true);
    }
  };

  const selectedPage = book.pages.find(p => p.id === selectedPageId) || book.pages[0];

  if (!selectedPageId && book.pages.length > 0) {
    setSelectedPageId(book.pages[0].id);
  }

  if (showOrderForm) {
    return (
      <OrderForm 
        book={book} 
        onBack={() => setShowOrderForm(false)} 
        onDownload={handleDownload}
      />
    );
  }

  if (showPreview) {
    return (
      <BookPreview 
        book={book} 
        onBack={() => setShowPreview(false)} 
        onOrder={() => setShowOrderForm(true)}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📚 Create Your Memory Book</h1>
        <p className="text-gray-500">Design your cover, add pages, decorate with stickers!</p>
      </div>

      <div className="flex gap-2 mb-4 sm:mb-6 bg-white rounded-xl p-2 shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('cover')}
          className={`flex-1 py-2 px-3 sm:px-4 rounded-lg font-medium transition-colors text-xs sm:text-sm whitespace-nowrap ${
            activeTab === 'cover' ? 'bg-pink-600 text-white' : 'text-gray-600 hover:bg-pink-50'
          }`}
        >
          📖 Cover
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`flex-1 py-2 px-3 sm:px-4 rounded-lg font-medium transition-colors text-xs sm:text-sm whitespace-nowrap ${
            activeTab === 'pages' ? 'bg-pink-600 text-white' : 'text-gray-600 hover:bg-pink-50'
          }`}
        >
          📄 Pages ({book.pages.length}/20)
        </button>
        <button
          onClick={() => setShowPreview(true)}
          className="flex-1 py-2 px-3 sm:px-4 rounded-lg font-medium bg-purple-500 text-white hover:bg-purple-600 text-xs sm:text-sm whitespace-nowrap"
        >
          👁️ Preview
        </button>
      </div>

      {activeTab === 'cover' && (
        <CoverEditor 
          cover={book.cover} 
          onUpdate={updateCover} 
          onAddSticker={addStickerToCover}
          onRemoveSticker={(id) => removeStickerFromCover(id)}
          onUpdateStickerPosition={(id, x, y) => updateStickerPosition('cover', id, x, y)}
        />
      )}

      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:6">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <PagesList
              pages={book.pages}
              selectedPageId={selectedPageId}
              onSelectPage={setSelectedPageId}
              onAddPage={addPage}
              onDeletePage={deletePage}
              onReorder={reorderPages}
            />
          </div>
          <div className="lg:col-span-2 order-1 lg:order-2">
            {selectedPage && (
              <PageEditor
                page={selectedPage}
                pageNumber={book.pages.findIndex(p => p.id === selectedPageId) + 1}
                onUpdate={(updates) => updatePage(selectedPageId, updates)}
                onAddSticker={(emoji) => addStickerToPage(selectedPageId, emoji)}
                onRemoveSticker={(id) => removeStickerFromPage(selectedPageId, id)}
                onUpdateStickerPosition={(id, x, y) => updateStickerPosition('page', id, x, y, selectedPageId)}
              />
            )}
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
        <button
          onClick={() => setShowPreview(true)}
          className="bg-pink-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-pink-700 transition transform hover:scale-105 text-sm sm:text-base"
        >
          ✨ Continue
        </button>
      </div>
    </div>
  );
};

export default MemoryBook;