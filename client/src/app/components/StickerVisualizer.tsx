import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import DraggableSticker from './DraggableSticker';
import { StickerDataDto, getStickerData } from '@/api/api';

interface StickerWithId extends StickerDataDto {
  id: string;
}

interface StickerVisualizerProps {
  stickerData: StickerDataDto;
}


export default function StickerVisualizer({ stickerData }: StickerVisualizerProps) {
  // Initialize with the first sticker
  const [stickers, setStickers] = useState<StickerWithId[]>([
    { ...stickerData, id: crypto.randomUUID() }
  ]);
  const [stickerPositions, setStickerPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [resetTrigger, setResetTrigger] = useState<string | null>(null);
  const [newStickerUrl, setNewStickerUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  // MacBook Pro 14" lid dimensions (usable area for stickers)
  const MACBOOK_SPECS = {
    lidWidth: 12.3, // inches
    lidHeight: 8.5,  // inches
    displayName: '14" MacBook Pro'
  };

  // Update container dimensions when component mounts or window resizes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handlePositionChange = (stickerId: string, x: number, y: number) => {
    setStickerPositions(prev => ({
      ...prev,
      [stickerId]: { x, y }
    }));
  };

  const handleReset = (stickerId?: string) => {
    if (stickerId) {
      // Reset specific sticker
      setResetTrigger(stickerId);
      setStickerPositions(prev => ({
        ...prev,
        [stickerId]: { x: 0, y: 0 }
      }));
    } else {
      // Reset all stickers
      const resetPositions: Record<string, { x: number; y: number }> = {};
      stickers.forEach(sticker => {
        resetPositions[sticker.id] = { x: 0, y: 0 };
      });
      setStickerPositions(resetPositions);
      setResetTrigger('all');
    }
  };

  const handleResetComplete = (stickerId: string) => {
    if (resetTrigger === stickerId || resetTrigger === 'all') {
      setResetTrigger(null);
    }
  };

  const currentSpecs = MACBOOK_SPECS;

  // URL validation function (reused from homepage)
  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return false;
    try {
      const regex = /^https?:\/\/www\.stickermule\.com\/[^\/]+\/item\/\d+(?:\?.*)?$/;
      return regex.test(url);
    } catch {
      return false;
    }
  };

  // Add new sticker functionality
  const handleAddSticker = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateUrl(newStickerUrl)) {
      setError('The URL is not valid');
      return;
    }

    setLoading(true);
    try {
      const newStickerData = await getStickerData(newStickerUrl);
      const newSticker: StickerWithId = {
        ...newStickerData,
        id: crypto.randomUUID()
      };
      
      setStickers(prev => [...prev, newSticker]);
      setNewStickerUrl('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load sticker data');
      }
    } finally {
      setLoading(false);
    }
  };

  // Remove sticker functionality
  const handleRemoveSticker = (stickerId: string) => {
    setStickers(prev => prev.filter(sticker => sticker.id !== stickerId));
    setStickerPositions(prev => {
      const newPositions = { ...prev };
      delete newPositions[stickerId];
      return newPositions;
    });
  };

  // Move sticker up in order (higher z-index)
  const handleMoveUp = (stickerId: string) => {
    setStickers(prev => {
      const currentIndex = prev.findIndex(sticker => sticker.id === stickerId);
      if (currentIndex === prev.length - 1) return prev; // Already at top
      
      const newStickers = [...prev];
      [newStickers[currentIndex], newStickers[currentIndex + 1]] = 
      [newStickers[currentIndex + 1], newStickers[currentIndex]];
      return newStickers;
    });
  };

  // Move sticker down in order (lower z-index)
  const handleMoveDown = (stickerId: string) => {
    setStickers(prev => {
      const currentIndex = prev.findIndex(sticker => sticker.id === stickerId);
      if (currentIndex === 0) return prev; // Already at bottom
      
      const newStickers = [...prev];
      [newStickers[currentIndex], newStickers[currentIndex - 1]] = 
      [newStickers[currentIndex - 1], newStickers[currentIndex]];
      return newStickers;
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Add More Stickers Section */}
      <div className="mb-8 p-6 bg-white rounded-xl border-2 border-sticker-gray shadow-sm">
        <h3 className="text-xl font-bold text-sticker-brown mb-4">
          Add More Stickers
        </h3>
        <form onSubmit={handleAddSticker} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={newStickerUrl}
                onChange={(e) => setNewStickerUrl(e.target.value)}
                placeholder="https://www.stickermule.com/.../item/..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sticker-text placeholder-gray-400 focus:outline-none focus:border-sticker-orange focus:ring-0 transition-colors duration-200"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !newStickerUrl.trim()}
              className="px-6 py-3 bg-sticker-orange hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-sticker-orange"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </span>
              ) : (
                'Add Sticker'
              )}
            </button>
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </div>
          )}
        </form>
      </div>

      {/* MacBook Visualizer */}
      <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl p-8 shadow-2xl">
        <div className="relative mx-auto" style={{ maxWidth: '900px' }}>
          {/* MacBook Pro Background */}
          <div 
            ref={containerRef}
            className="relative w-full aspect-[4/3] bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            {/* Background Image */}
            <Image
              src="/mbp14-black.jpeg"
              alt="MacBook Pro"
              fill
              className="object-cover"
              unoptimized
              priority
            />
            {/* Lid Area Overlay (semi-transparent to show sticker placement area) */}
            <div className="absolute inset-0 bg-opacity-100 rounded-lg" />
            
            {/* Draggable Stickers */}
            {containerDimensions.width > 0 && containerDimensions.height > 0 && 
              stickers.map((sticker, index) => (
                <DraggableSticker
                  key={sticker.id}
                  id={sticker.id}
                  stickerImage={sticker.productImage}
                  stickerSize={sticker.size}
                  containerWidth={containerDimensions.width}
                  containerHeight={containerDimensions.height}
                  zIndex={10 + index} // Higher index = higher z-index (on top)
                  onPositionChange={handlePositionChange}
                  resetPosition={resetTrigger === sticker.id || resetTrigger === 'all'}
                  onResetComplete={handleResetComplete}
                />
              ))
            }

          </div>

          {/* Instructions Overlay */}
          <div className="mt-4 bottom-4 left-4 right-4">
            <div className="bg-gray-100 bg-opacity-90 rounded-lg p-3">
              <p className="text-xs text-gray-700 text-center">
                <span className="font-semibold">💡 Tip:</span> Drag the sticker around to see how it looks on your {currentSpecs.displayName}
              </p>
            </div>
          </div>

          {/* Model Info */}
          <div className="mt-4 text-center">
            <h3 className="text-lg font-bold text-sticker-brown mb-2">
              {currentSpecs.displayName}
            </h3>
            <div className="flex justify-center space-x-6 text-sm text-sticker-text">
                             <span>Lid Area: {currentSpecs.lidWidth}&quot; × {currentSpecs.lidHeight}&quot;</span>
              <span>•</span>
              <span>
                Total Coverage: {
                  (stickers.reduce((total, sticker) => 
                    total + (sticker.size.width * sticker.size.height), 0
                  ) / (currentSpecs.lidWidth * currentSpecs.lidHeight) * 100).toFixed(1)
                }%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticker Management */}
      {stickers.length > 1 && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="text-md font-semibold text-yellow-900 mb-3">
            Manage Your Stickers
          </h4>
          <div className="space-y-3">
            {stickers.slice().reverse().map((sticker, index) => (
              <div key={sticker.id} className="flex items-center justify-between p-3 bg-white rounded border">
                <div className="flex items-center space-x-3">
                  <img 
                    src={sticker.productImage} 
                    alt={`Sticker ${stickers.length - index}`}
                    className="w-8 h-8 object-cover rounded"
                  />
                  <div className="text-sm text-gray-500">
                    <div className="font-medium">
                      Sticker #{sticker.id.slice(0, 8)}
                      <span className="text-xs text-gray-400 ml-1">
                        (Layer {index === stickers.length - 1 ? 'Top' : index === 0 ? 'Bottom' : index + 1})
                      </span>
                    </div>
                    <div className="text-gray-500">{sticker.size.width}&quot; × {sticker.size.height}&quot;</div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {/* Move Up Button */}
                  {stickers.length > 1 && index > 0 && (
                    <button
                      onClick={() => handleMoveUp(sticker.id)}
                      className="p-1 text-blue-400 hover:text-blue-600 transition-colors"
                      title="Move up (forward)"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                  
                  {/* Move Down Button */}
                  {stickers.length > 1 && index < stickers.length - 1 && (
                    <button
                      onClick={() => handleMoveDown(sticker.id)}
                      className="p-1 text-blue-400 hover:text-blue-600 transition-colors"
                      title="Move down (backward)"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}

                  <button
                    onClick={() => handleReset(sticker.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Reset position"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {stickers.length > 1 && (
                    <button
                      onClick={() => handleRemoveSticker(sticker.id)}
                      className="p-1 text-red-400 hover:text-red-600 transition-colors"
                      title="Remove sticker"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <span className="w-5 h-5 text-blue-500 mt-0.5 inline-block text-center text-sm" role="img" aria-label="Info">
              ℹ️
            </span>
          </div>
          <div>
            <h4 className="text-md font-semibold text-blue-900 mb-1">
              Sticker Preview
            </h4>
            <p className="text-sm text-blue-800">
              This visualization shows your stickers at actual size relative to the MacBook Pro lid. 
              You can add multiple stickers and drag them around to find the perfect arrangement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}