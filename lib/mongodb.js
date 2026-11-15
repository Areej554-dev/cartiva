import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
console.log("MongoDB URI check:", {
  exists: !!MONGODB_URI,
  startsCorrectly: MONGODB_URI?.startsWith("mongodb+srv://"),
  containsSpaces: /\s/.test(MONGODB_URI || ""),
  containsQuotes: /["']/.test(MONGODB_URI || ""),
});
try {
  const parsed = new URL(MONGODB_URI);
  console.log("MongoDB URI structure:", {
    protocol: parsed.protocol,
    hostname: parsed.hostname,
    usernamePresent: !!parsed.username,
    passwordPresent: !!parsed.password,
    databasePresent: !!parsed.pathname.slice(1),
  });
} catch (error) {
  console.log("MongoDB URI parsing failed:", error.message);
}
if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;

  return cached.conn;
}

export default connectDB;