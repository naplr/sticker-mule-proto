'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import { STICKER_MULE_LOGO_SMALL } from '@/shared/const';
import { getStickerData, StickerDataDto } from '@/api/api';
import StickerVisualizer from '../components/StickerVisualizer';

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

  if (loading) {
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
                Loading...
              </h1>
              <p className="text-xl md:text-2xl font-medium opacity-90">
                Processing your sticker data
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stickerData) {
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
                Error
              </h1>
              <p className="text-xl md:text-2xl font-medium opacity-90">
                {error || 'Failed to load sticker data'}
              </p>
            </div>
          </div>
        </div>

        {/* White Content Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <button
              onClick={() => router.push('/')}
              className="bg-sticker-orange hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-200 text-xl"
            >
              ← Go Back
            </button>
          </div>
        </div>

      </div>
    );
  }

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
              Sticker Data Retrieved Successfully
            </p>
          </div>
        </div>
      </div>

      {/* White Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-sticker-brown mb-4">
              Interactive Sticker Preview
            </h2>
            <p className="text-lg text-sticker-text mb-6">
              See how your sticker looks on a MacBook Pro and drag it around to find the perfect placement
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-sticker-orange hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
            >
              ← Process Another URL
            </button>
          </div>

          {/* Interactive Sticker Visualizer */}
          <StickerVisualizer stickerData={stickerData} />
        </div>
      </div>

    </div>
  );
}

export default function VisualizerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-lg text-sticker-brown">Loading...</div>
      </div>
    }>
      <VisualizerContent />
    </Suspense>
  );
}