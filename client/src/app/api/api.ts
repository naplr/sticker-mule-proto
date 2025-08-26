import { NextRequest, NextResponse } from 'next/server';
import { post } from './base';

// TODO: Split these models to a separated file and add appropriate validation for DTO.

export interface Size {
  width: number;
  height: number;
}

export interface StickerDataDto{
  productImage: string,
  size: Size
}

interface GetStickerDataRequest {
  url: string
}

export async function getStickerData(url: string): Promise<StickerDataDto> {
  // TODO: Handle the case where it's 400, especially when the product is not a sticker.
  // Maybe do it in page.tsx
  const response = await post<GetStickerDataRequest, StickerDataDto>('/process-sticker-url', { url });
  return response;
}