'use client';
import { useGetPostsQuery } from '@/redux/features/postsApi';
import { SignedIn, SignedOut, SignOutButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
// import Image from 'next/image';
import Navbar from '@/components/shared/navbar';
import Add2 from '@/components/advertisements/Add2';
import Add from '@/components/advertisements/Add';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { LuArrowUpDown } from 'react-icons/lu';
import { BiReset } from 'react-icons/bi';

export default function Home() {
  const { data: posts, isLoading, error } = useGetPostsQuery();
  const { user } = useUser();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');

  const resetAll = () => {
    setSearch('');
    setSort('');
  };

  // Filter posts by tags
  const filteredPosts = posts
    ? posts.filter((post) =>
        search
          ? post.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
          : true
      )
    : [];

  // Sort posts by popularity (net votes: upvote - downvote)
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sort === 'popularity') {
      const netA = a.upvote - a.downvote;
      const netB = b.upvote - b.downvote;
      return netB - netA; // Descending order
    }
    return 0; // Default: no sorting
  });

  return (
    <div className="min-h-screen mx-auto">
      {/* Main Content */}
      <div className="py-8 mx-auto lg:grid sm:grid-cols-5 gap-6">
        {/* Left Sidebar - Advertisement */}
        <aside className="hidden lg:block">
          <Add2 />
          <Add2 />
        </aside>

        {/* Center - Blog Posts */}
        <main className="md:col-span-3">
          {/* Search and Sort Functionality */}
          <div className="flex mb-6 flex-col bg-white p-5 rounded-md items-center justify-center text-white dark:bg-[#20293d]">
            <div className="relative w-full flex flex-col sm:flex-row gap-5 sm:gap-2 justify-center items-center">
              <input
                type="text"
                name="search"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder="Search by tags without #..."
                className="w-full bg-[#f5f5f5] dark:bg-[#060817] dark:text-white text-black rounded-lg py-3 px-5 pl-12 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-4 top-3 text-blue-500 text-xl" />
              <div className="flex sm:flex-none gap-5 sm:gap-2">
                {/* Popularity sort button */}
                <button
                  onClick={() => setSort(sort === 'popularity' ? '' : 'popularity')}
                  className="text-black btn-sm sm:btn flex justify-center dark:bg-[#20293d] dark:text-white dark:hover:bg-[#005694] items-center gap-2 rounded-lg hover:bg-[#005694] hover:text-white"
                >
                  <LuArrowUpDown /> <span>Popularity</span>
                </button>
                {/* Reset button */}
                <button
                  onClick={resetAll}
                  className="text-black btn-sm sm:btn flex justify-center items-center dark:bg-[#20293d] dark:text-white dark:hover:bg-[#005694] gap-2 rounded-lg hover:bg-[#005694] hover:text-white"
                >
                  <BiReset /> <span>Reset</span>
                </button>
              </div>
            </div>
            <div className="mt-4 text-sm flex">
              <span className="text-gray-700 dark:text-white">Most Popular tags: </span>
              <button
                onClick={() => setSearch('smartphone')}
                className="text-blue-400 hover:underline mx-1"
              >
                #smartphone
              </button>
              <button
                onClick={() => setSearch('macbook')}
                className="text-blue-400 hover:underline mx-1"
              >
                #macBook
              </button>
              <button
                onClick={() => setSearch('bitcoin')}
                className="text-blue-400 hover:underline mx-1"
              >
                #bitCoin
              </button>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Latest Posts</h1>
          {isLoading ? (
            <div className="text-center">
              <p className="text-gray-600">Loading posts...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-500">Failed to load posts. Please try again later.</p>
            </div>
          ) : !sortedPosts || sortedPosts.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600">No posts available. Create one!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                >
                  <Link href={`/posts/${post._id}`}>
                    <h2 className="text-xl font-semibold text-blue-600 hover:text-blue-800 transition">
                      {post.title}
                    </h2>
                  </Link>
                  {post.image && (
                    <div className="mt-4">
                      <img
                        src={post.image}
                        alt={post.title}
                        width={300}
                        height={200}
                        className="rounded-md object-cover"
                      />
                    </div>
                  )}
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
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {post.authorImage && (
                        <img
                          src={post.authorImage}
                          alt={post.authorName || 'Author'}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      )}
                      <p className="text-sm text-gray-700">
                        By {post.authorName || 'Anonymous'}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Posted on {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-2 flex gap-4 text-sm text-gray-700">
                    <span>Upvotes: {post.upvote}</span>
                    <span>Downvotes: {post.downvote}</span>
                    
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Right Sidebar - Advertisement */}
        <aside className="hidden lg:block">
          <Add />
        </aside>
      </div>
    </div>
  );
}