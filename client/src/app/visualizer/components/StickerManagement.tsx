import { StickerWithId } from '@/models/StickerWithId';
import Image from 'next/image';

interface StickerManagementProps {
  stickers: StickerWithId[];
  onMoveUp: (stickerId: string) => void;
  onMoveDown: (stickerId: string) => void;
  onRemoveSticker: (stickerId: string) => void;
}

export default function StickerManagement({
  stickers,
  onMoveUp,
  onMoveDown,
  onRemoveSticker
}: StickerManagementProps) {
  // Only show management panel if there are multiple stickers
  if (stickers.length <= 1) {
    return null;
  }

  return (
    <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
      <h4 className="text-md font-semibold text-yellow-900 mb-3">
        Manage Your Stickers
      </h4>
      <div className="space-y-3">
        {stickers.slice().reverse().map((sticker, index) => (
          <div key={sticker.id} className="flex items-center justify-between p-3 bg-white rounded border">
            <div className="flex items-center space-x-3">
              <Image 
                src={sticker.productImage} 
                alt={`Sticker ${stickers.length - index}`}
                width={32}
                height={32}
                className="w-8 h-8 object-cover rounded"
              />
              <div className="text-sm text-gray-500">
                <div className="font-medium">
                  Sticker #{sticker.id.slice(0, 8)}
                  <span className="text-xs text-gray-400 ml-1">
                    (Layer {index === 0 ? 'Top' : index === stickers.length - 1 ? 'Bottom' : stickers.length - index})
                  </span>
                </div>
                <div className="text-gray-500">{sticker.size.width}&quot; × {sticker.size.height}&quot;</div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {stickers.length > 1 && index > 0 && (
                <button
                  onClick={() => onMoveUp(sticker.id)}
                  className="p-1 text-blue-400 hover:text-blue-600 transition-colors"
                  title="Move up (forward)"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
              
              {stickers.length > 1 && index < stickers.length - 1 && (
                <button
                  onClick={() => onMoveDown(sticker.id)}
                  className="p-1 text-blue-400 hover:text-blue-600 transition-colors"
                  title="Move down (backward)"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}

              {stickers.length > 1 && (
                <button
                  onClick={() => onRemoveSticker(sticker.id)}
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
  );
}