'use client';
import { useGetPostQuery, useAddCommentMutation, useDeletePostMutation } from '@/redux/features/postsApi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignedIn, useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function Post({ params }) {
  const { data: post, isLoading } = useGetPostQuery(params.id);
  const [comment, setComment] = useState('');
  const [addComment, { isLoading: isCommenting }] = useAddCommentMutation();
  const [deletePost] = useDeletePostMutation();
  const { user } = useUser();
  const router = useRouter();

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await addComment({ id: params.id, comment: { userId: user.id, content: comment } }).unwrap();
      setComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="my-4">{post.content}</p>
      <p>Summary: {post.summary}</p>
      <p>Tags: {post.tags.join(', ')}</p>
      <SignedIn>
        {post.authorId === user?.id && (
          <div className="my-4">
            <Link href={`/posts/edit/${post._id}`} className="bg-yellow-500 text-white p-2 rounded mr-2">
              Edit
            </Link>
            <button
              onClick={async () => {
                await deletePost(params.id).unwrap();
                router.push('/');
              }}
              className="bg-red-500 text-white p-2 rounded"
            >
              Delete
            </button>
          </div>
        )}
        <form onSubmit={handleCommentSubmit} className="my-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border p-2 rounded"
            rows="3"
            placeholder="Add a comment..."
          />
          <button type="submit" disabled={isCommenting} className="bg-blue-500 text-white p-2 rounded">
            {isCommenting ? 'Commenting...' : 'Add Comment'}
          </button>
        </form>
      </SignedIn>
      <div>
        <h2 className="text-xl font-semibold">Comments</h2>
        {post.comments.map((c, index) => (
          <div key={index} className="border p-2 my-2 rounded">
            <p>{c.content}</p>
            <p className="text-sm text-gray-500">By {c.userId} on {new Date(c.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}