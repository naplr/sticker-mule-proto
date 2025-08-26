import { BASE_API } from '@/shared/const';

export async function post<TBody = void, TResponse = unknown>(path: string, body?: TBody): Promise<TResponse> {
  const url = `${BASE_API}${path}`;
  const fetchOptions: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Request failed');
  }
  return response.json();
}
