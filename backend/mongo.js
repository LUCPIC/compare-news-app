const { MongoClient, ServerApiVersion } = require('mongodb');

// IMPORTANT: Replace this with your actual MongoDB connection string.
// You should store this in an environment variable for security.
const uri = process.env.MONGODB_URI || "mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function connectDB() {
  if (db) return db;
  try {
    await client.connect();
    db = client.db("compare-app"); // You can name your database here
    console.log("Successfully connected to MongoDB!");
    return db;
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
    process.exit(1);
  }
}

module.exports = connectDB;
