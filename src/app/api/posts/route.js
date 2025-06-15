import connectDB, { Post } from '@/lib/mongodb';


import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET /api/posts error:', error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
  try {
    const { userId } = auth();

    console.log('POST /api/posts auth:', { userId }); // Debug log
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const { title, content, tags } = await req.json();
    await connectDB();
    const summary = await generateSummary(content);
    const post = new Post({ title, content, tags, summary, 
      authorId: userId
     });
    await post.save();
    return new Response(JSON.stringify(post), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('POST /api/posts error:', error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}