'use client';
import { useGetPostsQuery } from '@/redux/features/postsApi';
import { SignedIn, SignedOut, SignOutButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Navbar from '@/components/shared/navbar';
import Add2 from '@/components/advertisements/Add2';
import Add from '@/components/advertisements/Add';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { LuArrowUpDown } from 'react-icons/lu';
import { BiReset } from 'react-icons/bi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary text-xl" />
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

          <h1 className="text-3xl font-bold text-center mb-6">Latest Posts</h1>
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
              {sortedPosts.map((post) => (
                <Card key={post._id} className="p-5 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>
                      <Link
                        href={`/posts/${post._id}`}
                        className="text-xl font-semibold text-primary hover:text-primary/80 transition"
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        width={300}
                        height={200}
                        className="rounded-md object-cover mb-4"
                      />
                    )}
                    <p className="text-muted-foreground mb-4">{post.summary}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage
                            src={post.authorImage}
                            alt={post.authorName || 'Author'}
                          />
                          <AvatarFallback>
                            {post.authorName?.charAt(0) || 'A'}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm text-muted-foreground">
                          By {post.authorName || 'Anonymous'}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Posted on {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                      <span>UpVotes: {post.upvote}</span>
                      <span>DownVotes: {post.downvote}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
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