import { connectDB } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = await connectDB();
    const posts = await db.collection('posts').find({}).sort({  createdAt: -1 }).toArray();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, tags, summary, authorName, authorImage, authorEmail, image } = await request.json();
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const db = await connectDB();
    const post = {
      title,
      content,
      tags: tags ? tags.filter((tag) => tag) : [],
      summary: summary || '',
      authorId: userId,
      authorName: authorName || '',
      authorImage: authorImage || '',
      authorEmail: authorEmail || '',
      image: image || '',
      createdAt: new Date(),
      upvote: 0,
      downvote: 0,
      comments: [],
    };

    const result = await db.collection('posts').insertOne(post);
    return NextResponse.json({ ...post, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}