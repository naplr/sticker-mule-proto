import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

import { StickerWithId } from '@/models/StickerWithId';
import { SaveSessionDataRequest, SaveStickerData, saveSession } from '@/api/api';

import DraggableSticker from './DraggableSticker';
import StickerManagement from './StickerManagement';
import Info from './Info';
import InstructionsOverlay from './InstructionsOverlay';
import AddSticker from './AddSticker';
import { Position, getSession } from '@/api/api';

interface StickerVisualizerProps {
  sessionId: string;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
}

export default function StickerVisualizer({ sessionId, setError, setLoading }: StickerVisualizerProps) {
  // TODO: Consolidate stickers and stickerPositions.
  const [stickers, setStickers] = useState<StickerWithId[]>([]);
  const [stickerPositions, setStickerPositions] = useState<Record<string, Position>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [sessionUrl, setSessionUrl] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);
  // const [sessionData, setSessionData] = useState<SessionDataDto | null>(null);

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

    const fetchData = async () => {
      try {
        console.log('jkjk')
        setLoading(true);
        const data = await getSession(sessionId);
        console.log(data)
        const newStickers: StickerWithId[] = [];
        const newStickerPositions: Record<string, Position> = {};
        data.stickers.forEach((sticker: SaveStickerData) => {
          newStickers.push({
            id: sticker.stickerId,
            productImage: sticker.url,
            size: sticker.size,
          });
          newStickerPositions[sticker.stickerId] = sticker.position;
        });

        setStickers(newStickers);
        setStickerPositions(newStickerPositions)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unknown error occurred');
        }
      } finally {
        console.log('akjkjk')
        setLoading(false);
      }
    };

    updateDimensions();
    fetchData();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [sessionId, setError, setLoading]);

  // Set session URL when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSessionUrl(window.location.href);
    }
  }, []);

  const handlePositionChange = (stickerId: string, x: number, y: number) => {
    setStickerPositions(prev => ({
      ...prev,
      [stickerId]: { x, y }
    }));
  };

  const handleRemoveSticker = (stickerId: string) => {
    setStickers(prev => prev.filter(sticker => sticker.id !== stickerId));
    setStickerPositions(prev => {
      const newPositions = { ...prev };
      delete newPositions[stickerId];
      return newPositions;
    });
  };

  const handleMoveUp = (stickerId: string) => {
    setStickers(prev => {
      const currentIndex = prev.findIndex(sticker => sticker.id === stickerId);
      if (currentIndex === prev.length - 1) {
        return prev; // Already at top
      }
      
      const newStickers = [...prev];
      [newStickers[currentIndex], newStickers[currentIndex + 1]] = [newStickers[currentIndex + 1], newStickers[currentIndex]];
      return newStickers;
    });
  };

  const handleMoveDown = (stickerId: string) => {
    setStickers(prev => {
      const currentIndex = prev.findIndex(sticker => sticker.id === stickerId);
      if (currentIndex === 0) {
        return prev;
      }
      
      const newStickers = [...prev];
      [newStickers[currentIndex], newStickers[currentIndex - 1]] = [newStickers[currentIndex - 1], newStickers[currentIndex]];
      return newStickers;
    });
  };

  const handleAddSticker = (sticker: StickerWithId) => {
    setStickers(prev => [...prev, sticker]);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(sessionUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleSaveSession = () => {
    const sessionData: SaveSessionDataRequest = {
      sessionId: sessionId,
      stickers: stickers.map(sticker => {
        return {
          stickerId: sticker.id,
          url: sticker.productImage,
          size: sticker.size,
          position: stickerPositions[sticker.id] || { x: 0, y: 0 }
        }
      })
    };

    saveSession(sessionData)
    
    console.log('=== Session Data ===');
    console.log('Session ID:', sessionId);
    console.log('Total Stickers:', sessionData.stickers.length);
    console.log('\nSticker Details:');
    sessionData.stickers.forEach((sticker, index) => {
      console.log(`\nSticker ${index + 1}:`);
      console.log('  ID:', sticker.stickerId);
      console.log('  Image URL:', sticker.url);
      console.log('  Size:', `${sticker.size.width}" × ${sticker.size.height}"`);
      console.log('  Position:', `x: ${sticker.position.x}px, y: ${sticker.position.y}px`);
    });
    console.log('\nFull Session JSON:');
    console.log(JSON.stringify(sessionData, null, 2));
    console.log('===================');
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto">

      <Info />

      {/* Session Info and Save Button */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600">
            Session ID: <span className="font-mono text-gray-800">{sessionId}</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">URL:</span>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded max-w-xs truncate">
              {sessionUrl || 'Loading...'}
            </code>
            <button
              onClick={handleCopyUrl}
              className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors duration-200"
              title="Copy URL to clipboard"
            >
              {copySuccess ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        <button
          onClick={handleSaveSession}
          className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
          disabled={stickers.length === 0}
        >
          Save Session
        </button>
      </div>

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
                  initialPosition={stickerPositions[sticker.id]}
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


    </div>
  );
}