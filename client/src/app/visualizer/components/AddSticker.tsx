'use client';

import { useState } from 'react';
import { getStickerData } from '@/api/api';
import { StickerWithId } from '@/models/StickerWithId';

interface AddStickerProps {
  onAddSticker: (sticker: StickerWithId) => void;
}

export default function AddSticker({ onAddSticker }: AddStickerProps) {
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
  );
}