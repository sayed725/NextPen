import connectDB, { Post } from '@/lib/mongodb';
import { auth } from '@clerk/nextjs/server';

export async function POST(req, { params }) {
  const { userId } = auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });
  
  const { content } = await req.json();
  await connectDB();
  
  const post = await Post.findById(params.id);
  if (!post) return new Response('Not Found', { status: 404 });
  
  post.comments.push({ userId, content, createdAt: new Date() });
  await post.save();
  
  return new Response(JSON.stringify(post), { status: 201 });
}