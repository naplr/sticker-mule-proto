'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorIcon, LoadingIcon } from '@/app/components/svgs';

function generateRandomSessionId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function Home() {
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmitSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!sessionId.trim()) {
      setError('Please enter a session ID');
      return;
    }

    setLoading(true);
    
    try {
      router.push(`/visualizer?sessionId=${encodeURIComponent(sessionId.trim())}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(`Unknown error: ${err}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewSession = () => {
    const newSessionId = generateRandomSessionId();
    router.push(`/visualizer?sessionId=${newSessionId}`);
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
              Start or continue your sticker design session
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-sticker-brown">Choose Your Session</h2>
            
            <form onSubmit={handleSubmitSession} className="space-y-6 mb-6">
              <div>
                <label htmlFor="sessionId" className="block text-lg font-semibold text-sticker-brown mb-2">
                  Enter Session ID
                </label>
                <div className="relative">
                  <input
                    id="sessionId"
                    type="text"
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                    placeholder="Enter your 8-character session ID"
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
                      <LoadingIcon /> Loading Session...
                    </span>
                  ) : (
                    "Load Session"
                  )}
                </button>
              </div>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleCreateNewSession}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-200 text-xl"
              >
                Create New Session
              </button>
              <p className="text-sm text-gray-500 mt-3 text-center">
                A random 8-character session ID will be generated for you
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
