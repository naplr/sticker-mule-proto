'use client';

import { useState } from 'react';

import { getStickerData } from '@/api/api';
import { LoadingIcon, ErrorIcon } from '@/app/components/svgs';
import { StickerWithId } from '@/models/StickerWithId';

interface Props {
  onAddSticker: (sticker: StickerWithId) => void;
}

export default function AddSticker({ onAddSticker }: Readonly<Props>) {
  const [newStickerUrl, setNewStickerUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

    const cleanedUrl = newStickerUrl.trim();

    if (!validateUrl(cleanedUrl)) {
      setError('The URL is not valid');
      return;
    }

    setLoading(true);
    try {
      const newStickerData = await getStickerData(cleanedUrl);
      const newSticker: StickerWithId = {
        ...newStickerData,
        id: crypto.randomUUID()
      };
      
      onAddSticker(newSticker);
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

  return (
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
                <LoadingIcon /> Adding...
              </span>
            ) : (
              'Add Sticker'
            )}
          </button>
        </div>
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 font-medium flex items-center">
              <ErrorIcon /> {error}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}