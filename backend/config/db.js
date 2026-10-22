import mongoose from "mongoose";

/**
 * Serverless-safe connection cache.
 * Vercel reuses the process between warm invocations, so the connection
 * (or the in-flight promise) is kept on globalThis.
 */
const cache = globalThis.__prewiseMongo ?? { conn: null, promise: null };
globalThis.__prewiseMongo = cache;

const connectDB = async () => {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI is not set");

    cache.promise = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 10000 })
      .then((m) => m.connection);
  }

  try {
    cache.conn = await cache.promise;
    return cache.conn;
  } catch (error) {
    cache.promise = null;
    console.error("database not connected:", error.message);
    throw error;
  }
};

export default connectDB;
