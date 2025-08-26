import Image from 'next/image';
import { STICKER_MULE_LOGO } from '@/shared/const';

export default function Footer() {
  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-3">
          <p className="text-sticker-text">Powered by</p>
          <Image
            src={STICKER_MULE_LOGO}
            alt="Sticker Mule"
            width={120}
            height={36}
            className="opacity-75"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}