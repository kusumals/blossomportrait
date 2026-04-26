import React, { useState } from 'react';

const PagesList = ({ pages, selectedPageId, onSelectPage, onAddPage, onDeletePage, onReorder }) => {
  const [dragIndex, setDragIndex] = useState(null);

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
        <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Pages ({pages.length}/20)</h3>
        {pages.length < 20 && (
          <button
            onClick={onAddPage}
            className="bg-pink-600 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-lg hover:bg-pink-700"
          >
            + Add
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-80 sm:max-h-96 overflow-y-auto">
        {pages.map((page, index) => (
          <div
            key={page.id}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIndex !== null && dragIndex !== index) {
                onReorder(dragIndex, index);
              }
              setDragIndex(null);
            }}
            onClick={() => onSelectPage(page.id)}
            className={`flex items-center justify-between p-2 sm:p-3 rounded-xl cursor-pointer transition-colors ${
              selectedPageId === page.id ? 'bg-pink-100 border-2 border-pink-400' : 'bg-gray-50 hover:bg-pink-50 border-2 border-transparent'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs cursor-grab hidden sm:inline">⠿</span>
              <div
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-md border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0"
                style={{ backgroundColor: page.color }}
              >
                {index + 1}
              </div>
              <div className="text-xs sm:text-sm min-w-0">
                <div className="text-gray-700 font-medium truncate">Page {index + 1}</div>
                <div className="text-gray-400 text-xs hidden sm:block">
                  {page.photos.length} photo{page.photos.length !== 1 ? 's' : ''}
                  {page.text ? ' · text' : ''}
                  {page.stickers.length > 0 ? ` · ${page.stickers.length} sticker${page.stickers.length !== 1 ? 's' : ''}` : ''}
                </div>
              </div>
            </div>
            {pages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); onDeletePage(page.id); }}
                className="text-red-400 hover:text-red-600 text-lg leading-none flex-shrink-0"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PagesList;
