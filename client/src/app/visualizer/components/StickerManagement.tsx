import Image from 'next/image';
import { DownCaretIcon, RemoveIcon, UpCaretIcon } from '@/app/components/svgs';
import { StickerWithId } from '@/models/StickerWithId';

interface Props {
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
}: Readonly<Props>) {
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
                  <UpCaretIcon />
                </button>
              )}
              
              {stickers.length > 1 && index < stickers.length - 1 && (
                <button
                  onClick={() => onMoveDown(sticker.id)}
                  className="p-1 text-blue-400 hover:text-blue-600 transition-colors"
                  title="Move down (backward)"
                >
                  <DownCaretIcon />
                </button>
              )}

              {stickers.length > 1 && (
                <button
                  onClick={() => onRemoveSticker(sticker.id)}
                  className="p-1 text-red-400 hover:text-red-600 transition-colors"
                  title="Remove sticker"
                >
                  <RemoveIcon />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}