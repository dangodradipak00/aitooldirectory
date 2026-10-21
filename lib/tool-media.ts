import { getDb } from '@/lib/db';
import { tools, toolSubmissions } from '@/lib/db/schema';
import { deleteStoredObject } from '@/lib/storage/neon';

function toolMediaKey(source: string | null | undefined) {
  return source?.match(/^\/api\/media\/(tools\/(?:logo|website)\/[^?#]+)/)?.[1] || null;
}

export async function deleteUnreferencedToolMedia(sources: Array<string | null | undefined>) {
  const candidates = [...new Set(sources.map(toolMediaKey).filter((key): key is string => Boolean(key)))];
  if (!candidates.length) return [];

  const db = getDb();
  const [adminTools, submissions] = await Promise.all([
    db.select({ logoUrl: tools.logoUrl, websiteImageUrl: tools.websiteImageUrl }).from(tools),
    db.select({ logoUrl: toolSubmissions.logoUrl, websiteImageUrl: toolSubmissions.websiteImageUrl }).from(toolSubmissions)
  ]);
  const referenced = new Set(
    [...adminTools, ...submissions]
      .flatMap((item) => [toolMediaKey(item.logoUrl), toolMediaKey(item.websiteImageUrl)])
      .filter((key): key is string => Boolean(key))
  );
  const failed: string[] = [];
  await Promise.all(candidates.filter((key) => !referenced.has(key)).map(async (key) => {
    try {
      const response = await deleteStoredObject(key);
      if (!response.ok && response.status !== 404) failed.push(key);
    } catch {
      failed.push(key);
    }
  }));
  if (failed.length) console.error('Unable to remove unused tool media:', failed);
  return failed;
}
