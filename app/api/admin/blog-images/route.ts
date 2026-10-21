import { assertAdmin } from '@/lib/auth/admin';
import { cleanupOldOrphanedBlogMedia } from '@/lib/blog-media';
import { uploadBlogContentImage } from '@/lib/storage/neon';

export async function POST(request: Request) {
  try {
    await assertAdmin();
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File) || !file.size) {
      return Response.json({ error: 'Choose an image to upload.' }, { status: 400 });
    }
    await cleanupOldOrphanedBlogMedia();
    const url = await uploadBlogContentImage(file);
    return Response.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Image upload failed.';
    const status = message === 'Unauthorized' ? 401 : 400;
    return Response.json({ error: message }, { status });
  }
}
