const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI from .env file
const uri = process.env.MONGODB_URI;

// Create MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function startServer() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("duLibraryBook");
    const booksCollection = db.collection("books");
    const usersCollection = db.collection("users"); // Users collection

    // User data collection endpoint
    app.post("/users", async (req, res) => {
      const { email, displayName, role = "user" } = req.body;

      if (!email || !displayName) {
        return res.status(400).json({ message: "Email and DisplayName are required" });
      }

      try {
        // Check if user already exists by email
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
          return res.status(409).json({ message: "User already exists" });
        }

        // Insert new user document
        const newUser = {
          email,
          displayName,
          role,
          createdAt: new Date(),
        };

        const result = await usersCollection.insertOne(newUser);

        res.status(201).json({ message: "User created successfully", user: newUser });
      } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Route to get all books
    app.get("/books", async (req, res) => {
      try {
        const bookData = await booksCollection.find().toArray();
        res.status(200).json(bookData);
      } catch (err) {
        console.error("Error fetching books:", err);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Start server after DB connection is successful
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });

    // Optional: handle graceful shutdown
    process.on("SIGINT", async () => {
      console.log("Closing MongoDB connection");
      await client.close();
      process.exit(0);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

startServer();
