import { createBlog } from '../../actions';
import BlogEditor from '../BlogEditor';

export default function NewBlogPage() {
  return <BlogEditor action={createBlog} heading="Add New Blog" submitLabel="Save blog" />;
}
