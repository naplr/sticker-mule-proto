import { useState, useRef } from 'react';
import Image from 'next/image';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Position } from '@/api/api';

interface Props {
  id: string;
  stickerImage: string;
  stickerSize: {
    width: number;
    height: number;
  };
  containerWidth: number;
  containerHeight: number;
  zIndex?: number;
  initialPosition: Position;
  onPositionChange?: (id: string, x: number, y: number) => void;
}

export default function DraggableSticker({
  id,
  stickerImage,
  stickerSize,
  containerWidth,
  containerHeight,
  zIndex = 10,
  initialPosition,
  onPositionChange
}: Props) {
  const [position, setPosition] = useState({ ...initialPosition });
  const nodeRef = useRef(null);

  // Calculate sticker display size based on real-world dimensions
  // Assuming MacBook Pro 14" lid usable area is approximately 12.3" x 8.5"
  // Convert sticker size from inches to pixels with appropriate scaling
  const MACBOOK_LID_WIDTH_INCHES = 12.3;
  const MACBOOK_LID_HEIGHT_INCHES = 8.5;
  
  const scaleX = containerWidth / MACBOOK_LID_WIDTH_INCHES;
  const scaleY = containerHeight / MACBOOK_LID_HEIGHT_INCHES;
  const scale = Math.min(scaleX, scaleY); // Use smaller scale to maintain aspect ratio
  
  const stickerDisplayWidth = stickerSize.width * scale;
  const stickerDisplayHeight = stickerSize.height * scale;
  
  // Calculate bounds to keep sticker within container
  const bounds = {
    left: 0,
    top: 0,
    right: containerWidth - stickerDisplayWidth,
    bottom: containerHeight - stickerDisplayHeight
  };

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    const newPosition = { x: data.x, y: data.y };
    setPosition(newPosition);
    onPositionChange?.(id, newPosition.x, newPosition.y);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onDrag={handleDrag}
      bounds={bounds}
      handle=".sticker-handle"
    >
      <div 
        ref={nodeRef}
        className="sticker-handle cursor-move absolute"
        style={{
          width: stickerDisplayWidth,
          height: stickerDisplayHeight,
          zIndex: zIndex,
        }}
      >
        <div className="relative w-full h-full group">
          <Image
            src={stickerImage}
            alt="Draggable Sticker"
            fill
            className="object-contain drop-shadow-lg transition-all duration-200 group-hover:drop-shadow-xl"
            unoptimized
          />
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-10 rounded">
            <div className="bg-white bg-opacity-80 rounded-full p-2">
              <Image
                src="/favicon.ico"
                alt="Sticker Mule"
                width={24}
                height={24}
                className="w-6 h-6"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
}