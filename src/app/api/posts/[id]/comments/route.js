// app/api/posts/[id]/comments/route.js
import { connectDB } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function POST(request, { params }) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { content } = await request.json();
    if (!content) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    }

    const db = await connectDB();
    const result = await db.collection('posts').updateOne(
      { _id: new ObjectId(id) },
      { $push: { comments: { userId, content, createdAt: new Date() } } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Comment added' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}