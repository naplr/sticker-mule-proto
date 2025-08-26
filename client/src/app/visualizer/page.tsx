'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getStickerData, StickerDataDto } from '@/api/api';
import StickerVisualizer from './components/StickerVisualizer';

function VisualizerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productUrl = searchParams.get('url');
  const [stickerData, setStickerData] = useState<StickerDataDto | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productUrl) {
      setError('No product URL provided');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getStickerData(productUrl);
        setStickerData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productUrl]);

  return (
    <div className="min-h-screen bg-white">
      {/* Orange Header Section */}
      <div className="bg-sticker-orange">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Stickers Visualizer
            </h1>
            <p className="text-base md:text-lg font-medium opacity-90">
              See how your sticker looks on a MacBook Pro and drag it around to find the perfect placement
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="container text-center mx-auto px-4 py-16">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-700">
            Loading...
          </h2>
        </div>
      )}

      {error && !loading && (
        <div className="container mx-auto px-4 py-16 text-center text-white">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-700">
            Error: {error || 'Failed to load sticker data'}
          </h2>
          <div className="max-w-2xl mx-auto text-center">
            <button
              onClick={() => router.push('/')}
              className="bg-sticker-orange hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-200 text-xl"
            >
              ← Go Back
            </button>
          </div>
        </div>
      )}

      { stickerData && (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <StickerVisualizer stickerData={stickerData} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function VisualizerPage() {
  return <VisualizerContent />
}