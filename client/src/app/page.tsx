'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { STICKER_MULE_LOGO_SMALL } from '@/shared/const';
import { getStickerData } from '@/api/api';

export default function Home() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return false;

    try {
      // Validate using a single regex for the full URL
      const regex = /^https?:\/\/www\.stickermule\.com\/[^\/]+\/item\/\d+(?:\?.*)?$/;
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
            <div className="mb-8">
              <Image
                src={STICKER_MULE_LOGO_SMALL}
                alt="Sticker Mule Logo"
                width={150}
                height={45}
                className="mx-auto mb-6 brightness-0 invert"
                priority
                unoptimized
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Sticker Visualizer
            </h1>
            <p className="text-xl md:text-2xl font-medium opacity-90">
              Enter a product URL below to get visualizer ...
            </p>
          </div>
        </div>
      </div>

      {/* White Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-sticker-brown mb-4">
              Process Any URL Instantly
            </h2>
            <p className="text-lg text-sticker-text">
            </p>
          </div> */}
          
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
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
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
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Let's Go →"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}
