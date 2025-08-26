import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

import { StickerWithId } from '@/models/StickerWithId';
import { StickerDataDto, getStickerData } from '@/api/api';

import DraggableSticker from './DraggableSticker';
import StickerManagement from './StickerManagement';
import AdditionalInfo from './AdditionalInfo';
import InstructionsOverlay from './InstructionsOverlay';
import AddSticker from './AddSticker';

interface StickerVisualizerProps {
  stickerData: StickerDataDto;
}

export default function StickerVisualizer({ stickerData }: StickerVisualizerProps) {
  const [stickers, setStickers] = useState<StickerWithId[]>([]);
  const [stickerPositions, setStickerPositions] = useState<Record<string, { x: number; y: number }>>({});
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

  const handleAddSticker = (sticker: StickerWithId) => {
    setStickers(prev => [...prev, sticker]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <AddSticker onAddSticker={handleAddSticker} />

      <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl p-8 shadow-2xl">
        <div className="relative mx-auto" style={{ maxWidth: '900px' }}>
          <div 
            ref={containerRef}
            className="relative w-full aspect-[4/3] bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <Image
              src="/mbp14-black.jpeg"
              alt="MacBook Pro"
              fill
              className="object-cover"
              unoptimized
              priority
            />
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
                />
              ))
            }

          </div>

          <InstructionsOverlay />

          {/* Model Info */}
          <div className="mt-4 text-center">
            <h3 className="text-lg font-bold text-sticker-brown mb-2">
              {MACBOOK_SPECS.displayName}
            </h3>
            <div className="flex justify-center space-x-6 text-sm text-sticker-text">
              <span>Lid Area: {MACBOOK_SPECS.lidWidth}&quot; × {MACBOOK_SPECS.lidHeight}&quot;</span>
              <span>•</span>
              <span>
                Total Coverage: {
                  (stickers.reduce((total, sticker) => 
                    total + (sticker.size.width * sticker.size.height), 0
                  ) / (MACBOOK_SPECS.lidWidth * MACBOOK_SPECS.lidHeight) * 100).toFixed(1)
                }%
              </span>
            </div>
          </div>
        </div>
      </div>

      <StickerManagement
        stickers={stickers}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        onRemoveSticker={handleRemoveSticker}
      />

      <AdditionalInfo />
    </div>
  );
}