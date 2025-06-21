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
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const db = await connectDB();
    const postsCollection = db.collection('posts');

    const post = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.downvoters?.includes(userId)) {
      return NextResponse.json({ error: 'User already downvoted this post' }, { status: 400 });
    }

    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $inc: { downVote: 1 },
      $addToSet: { downvoters: userId },
    };

    const result = await postsCollection.updateOne(filter, updateDoc);

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Failed to downvote post' }, { status: 500 });
    }

    const updatedPost = await postsCollection.findOne({ _id: new ObjectId(id) });
    return NextResponse.json({
      message: 'Post downvoted successfully',
      downVote: updatedPost.downVote,
    }, { status: 200 });
  } catch (error) {
    console.error('Error downvoting post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}