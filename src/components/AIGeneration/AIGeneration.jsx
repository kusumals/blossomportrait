import React, { useState, useEffect } from 'react';
import { generateAIPortrait } from '../../services/aiService';

const AIGeneration = ({ image, style }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const generate = async () => {
      try {
        setLoading(true);
        const result = await generateAIPortrait(image);
        setImages(result);
        setLoading(false);
      } catch (err) {
        console.error("Generation failed:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    generate();
  }, [image, style]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎨</div>
        <h3 className="text-2xl font-semibold text-gray-800">Creating your artistic portrait...</h3>
        <p className="text-gray-600 mt-2">This may take a few seconds</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 bg-pink-600 text-white px-4 py-2 rounded">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
        Your Artistic Portrait! ✨
      </h2>
      <div className="max-w-md mx-auto">
        <div className="bg-gray-50 rounded-lg p-4">
          <img 
            src={images[0]} 
            alt="Your artistic portrait" 
            className="w-full rounded-lg shadow-md"
          />
          <div className="text-center mt-4">
            <button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = images[0];
                link.download = `portrait-${style}.png`;
                link.click();
              }}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
            >
              ⬇️ Download Free
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-pink-50 rounded-lg text-center">
        <p className="text-gray-700">
          <span className="font-semibold">Love your portrait?</span> Get it framed and delivered in Bangalore! 🖼️
        </p>
        <button className="mt-3 bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700">
          Choose a Frame →
        </button>
      </div>
    </div>
  );
};

export default AIGeneration;