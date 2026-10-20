import { randomUUID } from 'node:crypto';
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

async function storageRequest(method: 'GET' | 'PUT', key: string, body?: Uint8Array, contentType?: string) {
  const config = storageConfig();
  const url = objectUrl(config, key);
  const client = new AwsClient({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    service: 's3',
    region: config.region
  });
  const headers = new Headers();
  if (contentType) headers.set('content-type', contentType);
  return client.fetch(url, { method, headers, body: body ? Buffer.from(body) : undefined });
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

export async function getStoredObject(key: string) {
  return storageRequest('GET', key);
}
