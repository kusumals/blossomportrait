import React from 'react';

const artStyles = [
  {
    id: 'oil',
    name: 'Oil Painting',
    icon: '🎨',
    description: 'Rich brushstrokes, classical',
    color: 'from-amber-200 to-amber-400'
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    icon: '💧',
    description: 'Soft, flowing colors',
    color: 'from-blue-200 to-blue-400'
  },
  {
    id: 'sketch',
    name: 'Pencil Sketch',
    icon: '✏️',
    description: 'Detailed graphite drawing',
    color: 'from-gray-200 to-gray-400'
  },
  {
    id: 'anime',
    name: 'Anime',
    icon: '🌸',
    description: 'Japanese manga style',
    color: 'from-pink-200 to-pink-400'
  },
  {
    id: 'renaissance',
    name: 'Renaissance',
    icon: '🏛️',
    description: 'Classical old master',
    color: 'from-amber-300 to-amber-500'
  },
  {
    id: 'popart',
    name: 'Pop Art',
    icon: '⚡',
    description: 'Bold colors, comic style',
    color: 'from-red-200 to-red-400'
  }
];

export default function StyleSelector({ selectedStyle, onSelectStyle }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Art Style</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {artStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelectStyle(style.id)}
            className={`
              relative p-4 rounded-lg text-center transition-all duration-300
              bg-gradient-to-br ${style.color} 
              hover:scale-105 hover:shadow-md
              ${selectedStyle === style.id ? 'ring-4 ring-pink-500 ring-offset-2' : ''}
            `}
          >
            <span className="text-4xl mb-2 block">{style.icon}</span>
            <h3 className="font-semibold text-gray-800 text-sm">{style.name}</h3>
            <p className="text-xs text-gray-600 mt-1">{style.description}</p>
            
            {selectedStyle === style.id && (
              <div className="absolute top-2 right-2 bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                ✓
              </div>
            )}
          </button>
        ))}
      </div>
      
      <p className="text-sm text-gray-500 mt-4 text-center">
        Click on any style to select it
      </p>
    </div>
  );
}