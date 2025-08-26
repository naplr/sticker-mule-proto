'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import Image from 'next/image';
import { STICKER_MULE_LOGO } from '@/shared/const';

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dataParam = searchParams.get('data');

  let data;
  try {
    data = dataParam ? JSON.parse(decodeURIComponent(dataParam)) : null;
  } catch {
    data = null;
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sticker-gray">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-sticker-brown mb-2">
              No Data Available
            </h1>
            <p className="text-sticker-text mb-6">
              We couldn&apos;t find any data to display. Please try again.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-sticker-orange hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sticker-gray py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-sticker-orange to-orange-600 px-6 py-8">
            <div className="flex justify-between items-center flex-col md:flex-row space-y-4 md:space-y-0">
              <div className="flex items-center flex-col md:flex-row text-center md:text-left">
                <div className="mb-4 md:mb-0 md:mr-6">
                  <Image
                    src={STICKER_MULE_LOGO}
                    alt="Sticker Mule Logo"
                    width={120}
                    height={36}
                    className="brightness-0 invert opacity-90"
                    unoptimized
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Processing Complete
                  </h1>
                  <p className="text-white text-opacity-90 mt-1">
                    Your URL has been successfully processed
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push('/')}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 border border-white border-opacity-30"
              >
                Process Another
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-green-50 border-l-4 border-green-400 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-green-800">
                    {data.message || 'Success'}
                  </h3>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-sticker-gray border border-gray-200 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-sticker-orange rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-sticker-brown">
                    URL
                  </h3>
                </div>
                <p className="text-sticker-text text-sm break-all">
                  {data.url}
                </p>
              </div>

              <div className="bg-sticker-gray border border-gray-200 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-sticker-brown rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-sticker-brown">
                    Processed At
                  </h3>
                </div>
                <p className="text-sticker-text text-sm">
                  {new Date(data.timestamp).toLocaleString()}
                </p>
              </div>

              {data.data && (
                <>
                  <div className="bg-sticker-gray border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-sticker-brown">
                        Domain
                      </h3>
                    </div>
                    <p className="text-sticker-text text-sm">
                      {data.data.domain}
                    </p>
                  </div>

                  <div className="bg-sticker-gray border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-sticker-brown">
                        Protocol
                      </h3>
                    </div>
                    <p className="text-sticker-text text-sm">
                      {data.data.protocol}
                    </p>
                  </div>

                  <div className="bg-sticker-gray border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-sticker-brown">
                        Status
                      </h3>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                      {data.data.status}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="bg-sticker-gray border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-sticker-brown mb-4 flex items-center">
                <div className="w-6 h-6 bg-gray-500 rounded-lg flex items-center justify-center mr-2">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                Raw Response Data
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <pre className="text-sm text-sticker-text overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <p className="text-sm text-gray-500">Powered by</p>
                <Image
                  src={STICKER_MULE_LOGO}
                  alt="Sticker Mule"
                  width={80}
                  height={24}
                  className="opacity-75"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}