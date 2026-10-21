import { getStoredObject } from '@/lib/storage/neon';

export async function GET(_request: Request, context: { params: Promise<{ key: string[] }> }) {
  try {
    const { key: segments } = await context.params;
    if (segments.some((segment) => !segment || segment === '.' || segment === '..')) return new Response('Not found', { status: 404 });
    const key = segments.join('/');
    if (!key.startsWith('tools/') && !key.startsWith('blogs/')) return new Response('Not found', { status: 404 });

    const stored = await getStoredObject(key);
    if (stored.status === 404) return new Response('Not found', { status: 404 });
    if (!stored.ok || !stored.body) return new Response('Unable to load media', { status: 502 });

    return new Response(stored.body, {
      headers: {
        'cache-control': 'public, max-age=31536000, immutable',
        'content-type': stored.headers.get('content-type') || 'application/octet-stream',
        'x-content-type-options': 'nosniff'
      }
    });
  } catch {
    return new Response('Unable to load media', { status: 500 });
  }
}
