

import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  summary: String,
  authorId: String,
  createdAt: { type: Date, default: Date.now },
  comments: [{ userId: String, content: String, createdAt: Date }],
});

export const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
export default connectDB;