import { randomUUID } from 'node:crypto';
import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { AwsClient } from 'aws4fetch';

type StorageConfig = {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
};

const IMAGE_TYPES = new Map([
  ['image/png', 'png'],
  ['image/jpeg', 'jpg'],
  ['image/webp', 'webp'],
  ['image/avif', 'avif']
]);

function storageConfig(): StorageConfig {
  const config = {
    endpoint: process.env.AWS_ENDPOINT_URL_S3 || '',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || '',
    bucket: process.env.NEON_STORAGE_BUCKET || ''
  };
  const missing = Object.entries(config).filter(([, value]) => !value).map(([key]) => key);
  if (missing.length) throw new Error(`Neon Object Storage is not configured. Missing: ${missing.join(', ')}.`);
  return config;
}

function objectUrl(config: StorageConfig, key: string) {
  const endpoint = config.endpoint.replace(/\/$/, '');
  const encodedKey = key.split('/').map(encodeURIComponent).join('/');
  return new URL(`${endpoint}/${encodeURIComponent(config.bucket)}/${encodedKey}`);
}

function storageClient(config: StorageConfig) {
  return new AwsClient({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    service: 's3',
    region: config.region
  });
}

function xmlText(value: string) {
  return value
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&amp;', '&');
}

function sendSignedStorageRequest(request: Request, body?: Uint8Array) {
  return new Promise<Response>((resolve, reject) => {
    const url = new URL(request.url);
    const send = url.protocol === 'http:' ? httpRequest : httpsRequest;
    const headers = Object.fromEntries(request.headers.entries());

    // S3-compatible storage expects a fixed-size payload. Next.js wraps the
    // global fetch implementation in development, which can otherwise turn
    // this upload into an unsupported streamed/chunked request.
    if (body) headers['content-length'] = String(body.byteLength);

    const outgoing = send(url, { method: request.method, headers }, (incoming) => {
      const chunks: Buffer[] = [];
      incoming.on('data', (chunk: Buffer | Uint8Array | string) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });
      incoming.on('end', () => {
        const responseHeaders = new Headers();
        for (const [name, value] of Object.entries(incoming.headers)) {
          if (Array.isArray(value)) value.forEach((item) => responseHeaders.append(name, item));
          else if (value !== undefined) responseHeaders.set(name, value);
        }
        const responseBody = Buffer.concat(chunks);
        resolve(
          new Response(responseBody.length ? responseBody : null, {
            status: incoming.statusCode ?? 500,
            statusText: incoming.statusMessage,
            headers: responseHeaders
          })
        );
      });
    });

    outgoing.on('error', reject);
    if (body) outgoing.write(Buffer.from(body));
    outgoing.end();
  });
}

async function storageRequest(method: 'GET' | 'PUT' | 'DELETE', key: string, body?: Uint8Array, contentType?: string) {
  const config = storageConfig();
  const url = objectUrl(config, key);
  const client = storageClient(config);
  const headers = new Headers();
  if (contentType) headers.set('content-type', contentType);
  if (method === 'GET') return client.fetch(url, { method, headers });

  const signedRequest = await client.sign(url, {
    method,
    headers,
    body: body ? Buffer.from(body) : undefined
  });
  return sendSignedStorageRequest(signedRequest, body);
}

export async function uploadToolImage(file: File, kind: 'logo' | 'website') {
  const extension = IMAGE_TYPES.get(file.type);
  if (!extension) throw new Error('Upload a PNG, JPG, WEBP or AVIF image.');
  const limit = kind === 'logo' ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
  if (file.size > limit) throw new Error(`${kind === 'logo' ? 'Logo' : 'Website image'} must be smaller than ${limit / 1024 / 1024} MB.`);

  const key = `tools/${kind}/${new Date().toISOString().slice(0, 7)}/${randomUUID()}.${extension}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const response = await storageRequest('PUT', key, bytes, file.type);
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    throw new Error(`Image upload failed (${response.status}). ${detail}`);
  }
  return `/api/media/${key}`;
}

async function uploadBlogImage(file: File, kind: 'covers' | 'content') {
  const extension = IMAGE_TYPES.get(file.type);
  if (!extension) throw new Error('Upload a PNG, JPG, WEBP or AVIF image.');
  const limit = 5 * 1024 * 1024;
  if (file.size > limit) throw new Error('Blog image must be smaller than 5 MB.');

  const key = `blogs/${kind}/${new Date().toISOString().slice(0, 7)}/${randomUUID()}.${extension}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const response = await storageRequest('PUT', key, bytes, file.type);
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    throw new Error(`Image upload failed (${response.status}). ${detail}`);
  }
  return `/api/media/${key}`;
}

export function uploadBlogCover(file: File) {
  return uploadBlogImage(file, 'covers');
}

export function uploadBlogContentImage(file: File) {
  return uploadBlogImage(file, 'content');
}

export async function getStoredObject(key: string) {
  return storageRequest('GET', key);
}

export async function deleteStoredObject(key: string) {
  return storageRequest('DELETE', key);
}

export type StoredObject = { key: string; size: number; lastModified: Date };

export async function listStoredObjects(prefix: string) {
  const config = storageConfig();
  const client = storageClient(config);
  const objects: StoredObject[] = [];
  let continuationToken = '';

  do {
    const url = objectUrl(config, '');
    url.searchParams.set('list-type', '2');
    url.searchParams.set('prefix', prefix);
    if (continuationToken) url.searchParams.set('continuation-token', continuationToken);

    const response = await client.fetch(url);
    if (!response.ok) {
      throw new Error(`Unable to list stored media (${response.status}). ${(await response.text()).slice(0, 300)}`);
    }
    const xml = await response.text();
    for (const match of xml.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)) {
      const block = match[1] || '';
      const key = block.match(/<Key>([\s\S]*?)<\/Key>/)?.[1];
      const lastModified = block.match(/<LastModified>([\s\S]*?)<\/LastModified>/)?.[1];
      const size = block.match(/<Size>(\d+)<\/Size>/)?.[1];
      if (key && lastModified) {
        objects.push({ key: xmlText(key), size: Number(size || 0), lastModified: new Date(lastModified) });
      }
    }

    const truncated = xml.match(/<IsTruncated>(true|false)<\/IsTruncated>/)?.[1] === 'true';
    const nextToken = xml.match(/<NextContinuationToken>([\s\S]*?)<\/NextContinuationToken>/)?.[1];
    continuationToken = truncated && nextToken ? xmlText(nextToken) : '';
  } while (continuationToken);

  return objects;
}
