'use client';
import { useGetPostsQuery } from '@/redux/features/postsApi';
import { SignedIn, SignedOut, SignOutButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const { data: posts, isLoading, error } = useGetPostsQuery();
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            NextPen
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/" className="hover:text-blue-200 transition">
              Home
            </Link>
            <SignedIn>
              <Link href="/posts/create" className="hover:text-blue-200 transition">
                Create Post
              </Link>
              <span className="text-sm">Welcome, {user?.firstName}</span>
              <SignOutButton>
                <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition">
                  Sign Out
                </button>
              </SignOutButton>
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in" className="hover:text-blue-200 transition">
                Sign In
              </Link>
              <Link href="/sign-up" className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition">
                Sign Up
              </Link>
            </SignedOut>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar - Advertisement */}
        <aside className="md:col-span-1 bg-white rounded-lg shadow-md p-4 hidden md:block">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Advertisement</h2>
          <div className="bg-gray-200 h-64 flex items-center justify-center rounded">
            <p className="text-gray-500">Ad Space 1</p>
          </div>
        </aside>

        {/* Center - Blog Posts */}
        <main className="md:col-span-2">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Latest Posts</h1>
          {isLoading ? (
            <div className="text-center">
              <p className="text-gray-600">Loading posts...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-500">Failed to load posts. Please try again later.</p>
            </div>
          ) : !posts || posts.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600">No posts available. Create one!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                >
                  <Link href={`/posts/${post._id}`}>
                    <h2 className="text-xl font-semibold text-blue-600 hover:text-blue-800 transition">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 mt-2">{post.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-600 text-sm px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Posted on {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Right Sidebar - Advertisement */}
        <aside className="md:col-span-1 bg-white rounded-lg shadow-md p-4 hidden md:block">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Advertisement</h2>
          <div className="bg-gray-200 h-64 flex items-center justify-center rounded">
            <p className="text-gray-500">Ad Space 2</p>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} AIscribe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}