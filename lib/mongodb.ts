import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/ERdocdb";

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      dbName: "ERdocdb",
    } as any).then(() => console.log("Connected to MongoDB!"));
    //.then((mongoose) => {return mongoose});
  }

  cached.conn = await cached.promise;
  return cached.conn;
}