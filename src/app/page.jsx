'use client';
import { useGetPostsQuery } from '@/redux/features/postsApi';
import { SignedIn, SignedOut, SignOutButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/shared/navbar';
import Add2 from '@/components/advertisements/Add2';
import Add from '@/components/advertisements/Add';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { LuArrowUpDown } from "react-icons/lu";
import { BiReset } from "react-icons/bi";


export default function Home() {
  const { data: posts, isLoading, error } = useGetPostsQuery();
  const { user } = useUser();
    const [search, setSearch] = useState("");
  // console.log(search)

   const resetAll = () => {
    setSearch("");
    // setSort("");
  };

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

          {/* search functionality  */}
          <div className="flex mb-6 flex-col bg-white p-5 rounded-md items-center justify-center text-white dark:bg-[#20293d]">
           <div className="relative w-full flex flex-col sm:flex-row gap-5 sm:gap-2 justify-center items-center">
            <input
              type="text"
              name="search"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              placeholder="Search by tags without #...."
              className="w-full bg-[#f5f5f5] dark:bg-[#060817] dark:text-white text-black rounded-lg py-3 px-5 pl-12 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-4 top-3 text-blue-500 text-xl" />
            <div className="flex sm:flex-none gap-5 sm:gap-2">
              {/* Popularity sort button  */}
              <h2
                // onClick={() => setSort("popularity")}
                className="text-black btn-sm sm:btn flex justify-center dark:bg-[#20293d] dark:text-white dark:hover:bg-[#005694] items-center gap-2 rounded-lg hover:bg-[#005694] hover:text-white"
              >
                <LuArrowUpDown /> <span>Popularity</span>
              </h2>
              {/* reset button  */}
              <h2
                onClick={resetAll}
                className="text-black btn-sm sm:btn flex justify-center items-center dark:bg-[#20293d] dark:text-white dark:hover:bg-[#005694] gap-2 rounded-lg hover:bg-[#005694] hover:text-white"
              >
                <BiReset /> <span>Reset</span>
              </h2>
            </div>
          </div>
          <div className="mt-4 text-sm flex">
            <span className="text-gray-700 dark:text-white">
              Most Popular tags:{" "}
            </span>
            <p
              onClick={() => setSearch("smartphone")}
              className="text-blue-400 hover:underline mx-1"
            >
              #smartphone
            </p>
            <p
              onClick={() => setSearch("macbook")}
              className="text-blue-400 hover:underline mx-1"
            >
              #macBook
            </p>
            <p
              onClick={() => setSearch("bitcoin")}
              className="text-blue-400 hover:underline mx-1"
            >
              #bitCoin
            </p>
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
        <aside className="hidden lg:block">
        <Add />
        </aside>
      </div>

    </div>
  );
}