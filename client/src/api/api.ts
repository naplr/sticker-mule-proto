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

// TODO: Combine position with size, so we can share the interface.
// TODO: Include z-index (order) to save as well.

export interface Position {
  x: number,
  y: number
}

export interface SaveStickerData {
  stickerId: string
  url: string,
  size: Size,
  position: Position
}

export interface SessionDataDto {
  stickers: SaveStickerData[]
}

export interface SaveSessionDataRequest {
  sessionId: string,
  stickers: SaveStickerData[]
}

export async function getStickerData(url: string): Promise<StickerDataDto> {
  // TODO: Handle the case where it's 400, especially when the product is not a sticker.
  // Maybe do it in page.tsx.
  const response = await post<GetStickerDataRequest, StickerDataDto>('/process-sticker-url', { url });
  return response;
}

export async function saveSession(sessionData: SaveSessionDataRequest) {
  await post<SaveSessionDataRequest, null>('/save-session', sessionData);
}