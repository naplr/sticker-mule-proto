'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Hero from '@/app/components/Hero';
import StickerVisualizer from './components/StickerVisualizer';

function VisualizerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('sessionId');

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      setLoading(false);
      return;
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-white">
      <Hero />

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
            Error: {error || 'Failed to load session data'}
          </h2>
          <div className="max-w-2xl mx-auto text-center">
            <button
              onClick={() => router.push('/')}
              className="bg-sticker-orange hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-200 text-xl"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      { sessionId && (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <StickerVisualizer 
              sessionId={sessionId}
              setError={setError}
              setLoading={setLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-white">
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
      <div className="container text-center mx-auto px-4 py-16">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-700">
          Loading...
        </h2>
      </div>
    </div>
  );
}

export default function VisualizerPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VisualizerContent />
    </Suspense>
  );
}