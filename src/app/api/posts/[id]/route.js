import connectDB, { Post } from '@/lib/mongodb';
import { auth } from '@clerk/nextjs/server';
import { generateSummary } from '@/lib/gemini';

export async function GET(req, { params }) {
  await connectDB();
  const post = await Post.findById(params.id);
  if (!post) return new Response('Not Found', { status: 404 });
  return new Response(JSON.stringify(post), { status: 200 });
}

export async function PUT(req, { params }) {
  const { userId } = auth();
  const { title, content, tags } = await req.json();
  await connectDB();
  
  const post = await Post.findById(params.id);
  if (!post) return new Response('Not Found', { status: 404 });
  if (post.authorId !== userId) return new Response('Unauthorized', { status: 401 });
  
  const summary = await generateSummary(content);
  const updatedPost = await Post.findByIdAndUpdate(
    params.id,
    { title, content, tags, summary },
    { new: true }
  );
  
  return new Response(JSON.stringify(updatedPost), { status: 200 });
}

export async function DELETE(req, { params }) {
  const { userId } = auth();
  await connectDB();
  
  const post = await Post.findById(params.id);
  if (!post) return new Response('Not Found', { status: 404 });
  if (post.authorId !== userId) return new Response('Unauthorized', { status: 401 });
  
  await Post.findByIdAndDelete(params.id);
  return new Response(null, { status: 204 });
}