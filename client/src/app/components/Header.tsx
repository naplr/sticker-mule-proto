'use client';

import { useRouter } from 'next/navigation';
import { StickerMuleLogo } from './svgs';

export default function Header() {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <header className="w-full h-[55px] md:h-[42px] bg-sticker-brown shadow-sm">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <button
          onClick={handleLogoClick}
          className="flex items-center active:opacity-80 transition-opacity duration-200 focus:outline-none focus:opacity-80"
          style={{ cursor: 'pointer' }}
        >
          <StickerMuleLogo />
        </button>
      </div>
    </header>
  );
}