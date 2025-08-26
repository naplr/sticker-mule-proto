import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import DraggableSticker from './DraggableSticker';
import { StickerDataDto } from '@/api/api';

interface StickerVisualizerProps {
  stickerData: StickerDataDto;
}


export default function StickerVisualizer({ stickerData }: StickerVisualizerProps) {
  const [stickerPosition, setStickerPosition] = useState({ x: 0, y: 0 });
  const [resetTrigger, setResetTrigger] = useState(false);
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

  const handlePositionChange = (x: number, y: number) => {
    setStickerPosition({ x, y });
  };

  const handleReset = () => {
    setResetTrigger(true);
    setStickerPosition({ x: 0, y: 0 });
  };

  const handleResetComplete = () => {
    setResetTrigger(false);
  };

  const currentSpecs = MACBOOK_SPECS;

  // Calculate sticker size in inches for display
  const stickerWidthInches = stickerData.size.width;
  const stickerHeightInches = stickerData.size.height;

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 p-4 bg-sticker-gray rounded-lg">
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
          {/* Sticker Info */}
          <div className="text-sm text-sticker-text">
            <span className="font-medium">Sticker Size:</span> {stickerWidthInches}&quot; × {stickerHeightInches}&quot;
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 mt-2 md:mt-0">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-white border border-gray-300 text-sticker-brown rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Reset Position
          </button>
          
          <div className="text-xs text-gray-500">
            Position: ({Math.round(stickerPosition.x)}px, {Math.round(stickerPosition.y)}px)
          </div>
        </div>
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
            
            {/* Draggable Sticker */}
            {containerDimensions.width > 0 && containerDimensions.height > 0 && (
              <DraggableSticker
                stickerImage={stickerData.productImage}
                stickerSize={stickerData.size}
                containerWidth={containerDimensions.width}
                containerHeight={containerDimensions.height}
                onPositionChange={handlePositionChange}
                resetPosition={resetTrigger}
                onResetComplete={handleResetComplete}
              />
            )}

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
              <span>Lid Area: {currentSpecs.lidWidth}&quot; × {currentSpecs.lidHeight}"</span>
              <span>•</span>
              <span>Sticker Coverage: {((stickerWidthInches * stickerHeightInches) / (currentSpecs.lidWidth * currentSpecs.lidHeight) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

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
              This visualization shows your sticker at actual size relative to the MacBook Pro lid. 
              The sticker dimensions are calculated based on the real measurements of the MacBook.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}