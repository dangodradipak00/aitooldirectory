import { getDb } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import { deleteStoredObject, listStoredObjects } from '@/lib/storage/neon';

const ORPHAN_GRACE_MS = 24 * 60 * 60 * 1000;

export function blogMediaKeys(...sources: Array<string | null | undefined>) {
  const keys = new Set<string>();
  const pattern = /\/api\/media\/(blogs\/(?:covers|content)\/[^\s)"'<>?#]+)/g;
  for (const source of sources) {
    if (!source) continue;
    for (const match of source.matchAll(pattern)) {
      if (match[1]) keys.add(match[1]);
    }
  }
  return keys;
}

export async function deleteBlogStorageKeys(keys: Iterable<string>) {
  const failed: string[] = [];
  await Promise.all([...new Set(keys)].map(async (key) => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const response = await deleteStoredObject(key);
        if (response.ok || response.status === 404) return;
      } catch {
        // Retry transient storage failures before leaving the object alone.
      }
    }
    failed.push(key);
  }));
  if (failed.length) console.error('Unable to remove unused blog media:', failed);
  return failed;
}

async function referencedBlogMedia() {
  const posts = await getDb().select({
    content: blogPosts.content,
    coverImageUrl: blogPosts.coverImageUrl
  }).from(blogPosts);
  return blogMediaKeys(...posts.flatMap((post) => [post.content, post.coverImageUrl]));
}

export async function deleteUnreferencedBlogMedia(candidates: Iterable<string>) {
  const candidateKeys = [...new Set(candidates)];
  if (!candidateKeys.length) return [];
  const referenced = await referencedBlogMedia();
  return deleteBlogStorageKeys(candidateKeys.filter((key) => !referenced.has(key)));
}

export async function cleanupOldOrphanedBlogMedia() {
  try {
    const [referenced, objects] = await Promise.all([
      referencedBlogMedia(),
      listStoredObjects('blogs/')
    ]);
    const cutoff = Date.now() - ORPHAN_GRACE_MS;
    const orphanKeys = objects
      .filter((object) => object.lastModified.getTime() <= cutoff && !referenced.has(object.key))
      .map((object) => object.key);
    return deleteBlogStorageKeys(orphanKeys);
  } catch (error) {
    console.error('Unable to audit orphaned blog media:', error);
    return [];
  }
}
