'use client';
import { useGetPostsQuery } from '@/redux/features/postsApi';
import { SignedIn, SignedOut, SignOutButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Navbar from '@/components/shared/navbar';
import Add2 from '@/components/advertisements/Add2';
import Add from '@/components/advertisements/Add';
import { useState } from 'react';
import { FaSearch, FaRegCommentDots, FaShareAlt } from 'react-icons/fa';
import { LuArrowUpDown } from 'react-icons/lu';
import { BiReset } from 'react-icons/bi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import moment from 'moment';

export default function Home() {
  const { data: posts, isLoading, error } = useGetPostsQuery();
  const { user } = useUser();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
   const [expanded, setExpanded] = useState(false);

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
      <div className="py-8 mx-auto lg:grid lg:grid-cols-5 gap-6 px-4">
        {/* Left Sidebar - Advertisement */}
        <aside className="hidden lg:block lg:col-span-1">
          <Add2 />
          <Add2 />
        </aside>

        {/* Center - Blog Posts */}
        <main className="lg:col-span-3">
          {/* Search and Sort Functionality */}
          <Card className="mb-6">
            <CardContent className="flex flex-col space-y-4">
              <div className="relative flex flex-col sm:flex-row gap-4 sm:gap-2 items-center">
                <div className="relative w-full">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                  <Input
                    type="text"
                    name="search"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    placeholder="Search by tags without #..."
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setSort(sort === 'popularity' ? '' : 'popularity')}
                    variant={sort === 'popularity' ? 'default' : 'outline'}
                  >
                    <LuArrowUpDown className="mr-2 h-4 w-4" />
                    Popularity
                  </Button>
                  <Button onClick={resetAll} variant="outline">
                    <BiReset className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center text-sm">
                <span className="text-muted-foreground">Popular tags:</span>
                <Button
                  variant="link"
                  onClick={() => setSearch('smartphone')}
                  className="text-primary p-0 h-auto"
                >
                  #smartphone
                </Button>
                <Button
                  variant="link"
                  onClick={() => setSearch('macbook')}
                  className="text-primary p-0 h-auto"
                >
                  #macBook
                </Button>
                <Button
                  variant="link"
                  onClick={() => setSearch('bitcoin')}
                  className="text-primary p-0 h-auto"
                >
                  #bitCoin
                </Button>
              </div>
            </CardContent>
          </Card>

          <h1 className="text-3xl font-bold text-center mb-5">Latest Posts</h1>
          {isLoading ? (
            <Card className="text-center p-5">
              <CardContent>
                <p className="text-muted-foreground">Loading posts...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="text-center p-5">
              <CardContent>
                <p className="text-destructive">Failed to load posts. Please try again later.</p>
              </CardContent>
            </Card>
          ) : !sortedPosts || sortedPosts.length === 0 ? (
            <Card className="text-center p-5">
              <CardContent>
                <p className="text-muted-foreground">No posts available. Create one!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {sortedPosts.map((post) => {
               
                // Mock comment count since we don't have a comments API
                const comments = 0; // Replace with actual comment count if available

                return (
                  <Link key={post._id} href={`/posts/${post._id}`}>
                    <Card className="bg-white mb-5 dark:bg-[#20293d] dark:text-white shadow-lg rounded-lg p-5 hover:shadow-xl transition-shadow">
                      <CardContent className="p-0">
                        {/* Author Section */}
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage
                              src={post.authorImage}
                              alt={post.authorName || 'Author'}
                            />
                            <AvatarFallback>
                              {post.authorName?.charAt(0) || 'A'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{post.authorName || 'Anonymous'}</h3>
                            <p className="text-gray-500 dark:text-gray-300 text-sm">
                              {post.createdAt && moment(post.createdAt).fromNow()}
                            </p>
                          </div>
                        </div>

                        {/* Post Content */}
                        <p className="mt-3 text-xl font-semibold">{post.title}</p>
                        <p className="mt-3 text-gray-700 dark:text-white">
                          {expanded ? post.summary : `${post.summary.slice(0, 200)}...`}
                          {post.tags.map((tag, index) => (
                            <span key={index} className="ml-2 font-semibold">
                              #{tag}
                            </span>
                          ))}
                          {!expanded && post.summary.length > 200 && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setExpanded(true);
                              }}
                              className="text-blue-500 ml-2"
                            >
                              Read More
                            </button>
                          )}
                        </p>

                        {/* Post Image */}
                        {post.image && (
                          <div className="mt-4">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-[350px] object-cover rounded-lg"
                            />
                          </div>
                        )}

                        {/* Likes, Comments, and Share */}
                        <div className="flex items-center justify-between mt-4 text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex gap-2 dark:bg-[#20293d] dark:text-white dark:hover:text-blue-500 hover:text-blue-500"
                            >
                              <span>UpVote · {post.upvote}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex gap-2 dark:bg-[#20293d] dark:text-white dark:hover:text-blue-500 hover:text-blue-500"
                            >
                              <span>DownVote · {post.downvote}</span>
                            </Button>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center space-x-1 dark:hover:text-blue-500 hover:text-blue-500"
                            >
                              <FaRegCommentDots className="text-xl" />
                              <span>{comments}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center space-x-1 dark:hover:text-blue-500 hover:text-blue-500"
                            >
                              <FaShareAlt className="text-xl" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </main>

        {/* Right Sidebar - Advertisement */}
        <aside className="hidden lg:block lg:col-span-1">
          <Add />
        </aside>
      </div>
    </div>
  );
}