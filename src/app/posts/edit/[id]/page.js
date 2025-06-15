'use client';
import { useState, useEffect } from 'react';
import { useGetPostQuery, useUpdatePostMutation } from '@/redux/features/postsApi';
import { useRouter } from 'next/navigation';
import { SignedIn } from '@clerk/nextjs';

export default function EditPost({ params }) {
  const { data: post, isLoading } = useGetPostQuery(params.id);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const router = useRouter();

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setTags(post.tags.join(', '));
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePost({ id: params.id, title, content, tags: tags.split(',').map(tag => tag.trim()) }).unwrap();
      router.push(`/posts/${params.id}`);
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <SignedIn>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border p-2 rounded"
              rows="6"
              required
            />
          </div>
          <div>
            <label className="block">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <button type="submit" disabled={isUpdating} className="bg-blue-500 text-white p-2 rounded">
            {isUpdating ? 'Updating...' : 'Update Post'}
          </button>
        </form>
      </div>
    </SignedIn>
  );
}