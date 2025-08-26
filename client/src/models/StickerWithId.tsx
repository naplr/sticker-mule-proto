import { StickerDataDto } from '@/api/api';

export interface StickerWithId extends StickerDataDto {
  id: string;
}
