 
 'use client';
import { useGetPostsQuery } from '@/redux/features/postsApi';
import { SignedIn, SignedOut, SignOutButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {

      const { user } = useUser();
 

 return (
 <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
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
      </nav> )}