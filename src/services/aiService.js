export const generateAIPortrait = async (imageDataUrl) => {
  const response = await fetch('http://localhost:3001/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageDataUrl }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Server error');
  }

  const data = await response.json();
  return [data.imageUrl];
};
