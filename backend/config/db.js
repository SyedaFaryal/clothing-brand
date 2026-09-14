import mongoose from "mongoose";

// If MONGO_URI is set (local mongod or an Atlas connection string), we
// connect to that — this is what you want for real/persistent data.
//
// If MONGO_URI is NOT set, we spin up an in-memory MongoDB automatically
// (via mongodb-memory-server) so the app works immediately with zero setup.
// Note: an in-memory database resets every time the server restarts, so
// set MONGO_URI in backend/.env once you want your data to persist.
let memoryServer = null;

const connectDB = async () => {
  let uri = process.env.MONGO_URI;

  if (!uri) {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri();
    console.log("No MONGO_URI set — using a temporary in-memory MongoDB.");
    console.log("Data will NOT persist between restarts. Set MONGO_URI in backend/.env to fix this.");
  }

  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected: ${mongoose.connection.host || "in-memory"}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    console.error(
      "Make sure MongoDB is running locally, or set MONGO_URI to an Atlas connection string in backend/.env"
    );
    process.exit(1);
  }
};

export default connectDB;
