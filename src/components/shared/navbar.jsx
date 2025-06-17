'use client';
import { SignedIn, SignedOut, SignOutButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function Navbar() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight">
          NextPen
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/" className="hover:text-blue-200 transition">
            Home
          </Link>
          <SignedIn>
            <Link href="/posts/create" className="hover:text-blue-200 transition">
              Create Post
            </Link>
            <span className="text-sm">Welcome, {user?.firstName}</span>
            <SignOutButton>
              <Button
                variant="destructive"
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Sign Out
              </Button>
            </SignOutButton>
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in" className="hover:text-blue-200 transition">
              Sign In
            </Link>
            <Button asChild variant="default" size="sm" className="bg-green-500 hover:bg-green-600 text-white">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </SignedOut>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle menu">
                {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-gray-100 border-none">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold">NextPen</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 px-5">
                <Link
                  href="/"
                  className="text-lg hover:text-blue-200 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <SignedIn>
                  <Link
                    href="/posts/create"
                    className="text-lg hover:text-blue-200 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Create Post
                  </Link>
                  <span className="text-sm">Welcome, {user?.firstName}</span>
                  <SignOutButton>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign Out
                    </Button>
                  </SignOutButton>
                </SignedIn>
                <SignedOut>
                  <Link
                    href="/sign-in"
                    className="text-lg hover:text-blue-200 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Button
                    asChild
                    variant="default"
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white w-full"
                  >
                    <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </SignedOut>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}