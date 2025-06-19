import mongoose from "mongoose";

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI!, {
        dbName: "ERdocdb",
      } as any)
      .then(() => console.log("Connected to MongoDB!"));
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
