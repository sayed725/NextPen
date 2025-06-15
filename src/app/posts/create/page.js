'use client';
import { useState } from 'react';
import { useCreatePostMutation } from '@/redux/features/postsApi';
import { useRouter } from 'next/navigation';
import { SignedIn, useUser,  } from '@clerk/nextjs';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [createPost, { isLoading, error }] = useCreatePostMutation();
  const router = useRouter();
  const { isSignedIn } = useUser();

  // console.log(isSignedIn)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      alert('Please sign in to create a post.');
      router.push('/sign-in');
      return;
    }
    try {
      console.log('Creating post with:', { title, content, tags }); // Debug log
      await createPost({ title, content, tags: tags.split(',').map(tag => tag.trim()) }).unwrap();
      router.push('/');
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  return (
    // <SignedIn>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Create Post</h1>
        {error && (
          <p className="text-red-500 mb-4">
            {error.status === 401
              ? 'Please sign in to create a post.'
              : 'Failed to create post. Please try again.'}
          </p>
        )}
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
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
          >
            {isLoading ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>
    // </SignedIn>
  );
}