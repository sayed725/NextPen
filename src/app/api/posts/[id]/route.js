// app/api/posts/[id]/route.js
import { connectDB } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const db = await connectDB();
    const post = await db.collection('posts').findOne({ _id: new ObjectId(id) });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}


export async function PATCH(request, { params }) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { title, content, tags, summary } = await request.json();
    const db = await connectDB();
    const result = await db.collection('posts').updateOne(
      { _id: new ObjectId(id), authorId: userId },
      { $set: { title, content, tags: tags || [], summary: summary || '' } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Post not found or unauthorized' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Post updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { title, content, tags, summary } = await request.json();
    const db = await connectDB();
    const result = await db.collection('posts').updateOne(
      { _id: new ObjectId(id), authorId: userId },
      { $set: { title, content, tags: tags || [], summary: summary || '' } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Post not found or unauthorized' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Post updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const db = await connectDB();
    const result = await db.collection('posts').deleteOne({ _id: new ObjectId(id), authorId: userId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Post not found or unauthorized' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Post deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}