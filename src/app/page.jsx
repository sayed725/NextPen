"use client";
import { useGetPostsQuery, useUpvotePostMutation, useDownvotePostMutation } from "@/redux/features/postsApi";
import { SignedIn, SignedOut, SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Add2 from "@/components/advertisements/Add2";
import Add from "@/components/advertisements/Add";
import { useState } from "react";
import { FaSearch, FaRegCommentDots, FaShareAlt } from "react-icons/fa";
import { LuArrowUpDown } from "react-icons/lu";
import { BiReset } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";
import toast from "react-hot-toast";


export default function Home() {
  const { data: posts, isLoading, error } = useGetPostsQuery();
  const { user } = useUser();
  const [upvotePost, { isLoading: isUpvoting }] = useUpvotePostMutation();
  const [downvotePost, { isLoading: isDownvoting }] = useDownvotePostMutation();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [expanded, setExpanded] = useState(false);

  const resetAll = () => {
    setSearch("");
    setSort("");
  };

  // Filter posts by tags
  const filteredPosts = posts
    ? posts.filter((post) =>
        search
          ? post.tags.some((tag) =>
              tag.toLowerCase().includes(search.toLowerCase())
            )
          : true
      )
    : [];

  // Sort posts by popularity (net votes: upvote - downvote)
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sort === "popularity") {
      const netA = (a.upvote || 0) - (a.downvote || 0);
      const netB = (b.upvote || 0) - (b.downvote || 0);
      return netB - netA; // Descending order
    }
    return 0; // Default: no sorting
  });

  // Handle upvote
  const handleUpvote = async (postId) => {
    try {
      await upvotePost(postId).unwrap();
      toast.success("Post upvoted successfully!");
    } catch (error) {
      toast.error(error?.data?.error || "Failed to upvote post");
    }
  };

  // Handle downvote
  const handleDownvote = async (postId) => {
    try {
      await downvotePost(postId).unwrap();
      toast.success("Post downvoted successfully!");
    } catch (error) {
      toast.error(error?.data?.error || "Failed to downvote post");
    }
  };

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
                    onClick={() =>
                      setSort(sort === "popularity" ? "" : "popularity")
                    }
                    variant={sort === "popularity" ? "default" : "outline"}
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
                  onClick={() => setSearch("smartphone")}
                  className="text-primary p-0 h-auto"
                >
                  #smartphone
                </Button>
                <Button
                  variant="link"
                  onClick={() => setSearch("macbook")}
                  className="text-primary p-0 h-auto"
                >
                  #macBook
                </Button>
                <Button
                  variant="link"
                  onClick={() => setSearch("bitcoin")}
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
                <p className="text-destructive">
                  Failed to load posts. Please try again later.
                </p>
              </CardContent>
            </Card>
          ) : !sortedPosts || sortedPosts.length === 0 ? (
            <Card className="text-center p-5">
              <CardContent>
                <p className="text-muted-foreground">
                  No posts available. Create one!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {sortedPosts.map((post) => {
                // Mock comment count since we don't have a comments API
                const comments = 0; // Replace with actual comment count if available

                return (
                  <Card
                    key={post._id}
                    className="bg-white mb-5 dark:bg-[#20293d] dark:text-white shadow-lg rounded-lg p-5 hover:shadow-xl transition-shadow"
                  >
                    <CardContent className="p-0">
                      {/* Author Section */}
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={post.authorImage}
                            alt={post.authorName || "Author"}
                          />
                          <AvatarFallback>
                            {post.authorName?.charAt(0) || "A"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">
                            {post.authorName || "Anonymous"}
                          </h3>
                          <p className="text-gray-500 dark:text-gray-300 text-sm">
                            {post.createdAt &&
                              moment(post.createdAt).fromNow()}
                          </p>
                        </div>
                      </div>

                      {/* Post Content */}
                      <p className="mt-3 text-xl font-semibold">
                        {post.title}
                      </p>
                      <p className="mt-3 text-gray-700 dark:text-white">
                        {expanded
                          ? post.content
                          : `${post.content.slice(0, 300)}...`}
                        {post.content.length > 300 && (
                          <Link
                            href={`/posts/${post._id}`}
                            className="text-blue-500 hover:underline ml-2"
                          >
                            Read More
                          </Link>
                        )}
                        {post.tags.map((tag, index) => (
                          <span key={index} className="ml-2 font-semibold">
                            #{tag}
                          </span>
                        ))}
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
                            onClick={() => handleUpvote(post._id)}
                            disabled={isUpvoting || !user} // Disable if upvoting or user not signed in
                            className="flex gap-2 dark:bg-[#20293d] dark:text-white dark:hover:text-blue-500 hover:text-blue-500"
                          >
                            <span>UpVote · {post.upVote || 0}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownvote(post._id)}
                            disabled={isDownvoting || !user} // Disable if downvoting or user not signed in
                            className="flex gap-2 dark:bg-[#20293d] dark:text-white dark:hover:text-blue-500 hover:text-blue-500"
                          >
                            <span>DownVote · {post.downVote || 0}</span>
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