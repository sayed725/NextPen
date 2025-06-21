import { MongoClient } from 'mongodb';

let dbInstance = null;

const connectDB = async () => {
  if (dbInstance) return dbInstance;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  try {
    await client.connect();
    console.log('MongoDB connected');
    dbInstance = client.db('myapp'); // Replace 'myapp' with your database name
    await initializePostCollection(dbInstance);
    return dbInstance;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// const postSchema = {
//   validator: {
//     $jsonSchema: {
//       bsonType: 'object',
//       required: ['title', 'content', 'authorId', 'createdAt'],
//       properties: {
//         title: { bsonType: 'string' },
//         content: { bsonType: 'string' },
//         tags: { bsonType: 'array', items: { bsonType: 'string' } },
//         summary: { bsonType: 'string' },
//         authorId: { bsonType: 'string' },
//         authorName: { bsonType: 'string' },
//         authorImage: { bsonType: 'string' },
//         authorEmail: { bsonType: 'string' },
//         image: { bsonType: 'string' },
//         createdAt: { bsonType: 'date' },
//         upvote: { bsonType: 'int', minimum: 0, default: 0 },
//         downvote: { bsonType: 'int', minimum: 0, default: 0 },
//         comments: {
//           bsonType: 'array',
//           items: {
//             bsonType: 'object',
//             required: ['userId', 'content', 'createdAt'],
//             properties: {
//               userId: { bsonType: 'string' },
//               content: { bsonType: 'string' },
//               createdAt: { bsonType: 'date' },
//             },
//           },
//         },
//       },
//     },
//   },
//   validationLevel: 'strict',
//   validationAction: 'error',
// };

const initializePostCollection = async (db) => {
  try {
    const collections = await db.listCollections().toArray();
    const collectionExists = collections.some((col) => col.name === 'posts');

    // if (!collectionExists) {
    //   await db.createCollection('posts', postSchema);
    //   console.log('Posts collection created with schema validation');
    // } else {
    //   await db.command({ collMod: 'posts', ...postSchema });
    //   console.log('Posts collection schema updated');
    // }

    await db.collection('posts').createIndex({ authorId: 1 });
    await db.collection('posts').createIndex({ tags: 1 });
    await db.collection('posts').createIndex({ upvote: 1 });
    await db.collection('posts').createIndex({ downvote: 1 });
  } catch (error) {
    console.error('Error initializing posts collection:', error);
  }
};

export { connectDB, initializePostCollection };