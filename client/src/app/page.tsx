'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { STICKER_MULE_LOGO_SMALL } from '@/shared/const';
import { getStickerData } from '@/api/api';
import { ErrorIcon, LoadingIcon } from '@/app/components/svgs';

export default function Home() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return false;

    try {
      // Validate using a single regex for the full URL
      // Supports both formats:
      // https://www.stickermule.com/marketplace/item/123
      // https://www.stickermule.com/uk/herman/item/14591453
      const regex = /^https?:\/\/www\.stickermule\.com\/[^\/]+(?:\/[^\/]+)?\/item\/\d+(?:\?.*)?$/;
      return regex.test(url);
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateUrl(url)) {
      setError('The url is not valid');
      return;
    }

    setLoading(true);
    
    try {
      // const stickerData = await getStickerData(url);
      router.push(`/visualizer?url=${encodeURIComponent(url)}`);
      // router.push(`/visualizer?url=${encodeURIComponent(JSON.stringify(stickerData))}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); // ✅ Safe
      } else {
        setError(`Unknown error: ${err}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Orange Header Section */}
      <div className="bg-sticker-orange">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Sticker Visualizer
            </h1>
            <p className="text-xl md:text-2xl font-medium opacity-90">
              Enter a product URL below to get visualizer ...
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-lg font-semibold text-sticker-brown mb-2">
                Product URL
              </label>
              <div className="relative">
                <input
                  id="url"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-lg text-sticker-text placeholder-gray-400 focus:outline-none focus:border-sticker-orange focus:ring-0 transition-colors duration-200 text-lg"
                />
              </div>
              {error && (
                <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-medium flex items-center">
                    <ErrorIcon /> {error}
                  </p>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sticker-orange hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-sticker-orange text-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <LoadingIcon /> Processing...
                  </span>
                ) : (
                  "Let's Go ->"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}
