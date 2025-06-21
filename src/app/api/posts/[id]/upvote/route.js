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

    if (post.upvoters?.includes(userId)) {
      return NextResponse.json({ error: 'User already upvoted this post' }, { status: 400 });
    }

    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $inc: { upVote: 1 },
      $addToSet: { upvoters: userId },
    };

    const result = await postsCollection.updateOne(filter, updateDoc);

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Failed to upvote post' }, { status: 500 });
    }

    const updatedPost = await postsCollection.findOne({ _id: new ObjectId(id) });
    return NextResponse.json({
      message: 'Post upvoted successfully',
      upVote: updatedPost.upVote,
    }, { status: 200 });
  } catch (error) {
    console.error('Error upvoting post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}