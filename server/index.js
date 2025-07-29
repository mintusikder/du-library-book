const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const { ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function startServer() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("duLibraryBook");
    const booksCollection = db.collection("books");
    const usersCollection = db.collection("users");

    // ✅ Create new user
    app.post("/users", async (req, res) => {
      const { email, displayName, role = "user" } = req.body;

      if (!email || !displayName) {
        return res
          .status(400)
          .json({ message: "Email and DisplayName are required" });
      }

      try {
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
          return res.status(409).json({ message: "User already exists" });
        }

        const newUser = {
          email,
          displayName,
          role,
          createdAt: new Date(),
        };

        const result = await usersCollection.insertOne(newUser);
        res.status(201).json({ message: "User created", user: newUser });
      } catch (err) {
        console.error("Error saving user:", err);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // ✅ Get user role by email
    app.get("/users/role/:email", async (req, res) => {
      const email = req.params.email;

      try {
        const user = await usersCollection.findOne({ email });
        res.status(200).send({ role: user?.role || "user" });
      } catch (error) {
        console.error("Error fetching role:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // ✅ Middleware for admin verification (placeholder)
    const verifyAdmin = async (req, res, next) => {
      // You can enhance this using JWT/Firebase Admin Auth
      const { email } = req.body;
      const user = await usersCollection.findOne({ email });

      if (user?.role === "admin") {
        next();
      } else {
        return res.status(403).json({ message: "Access denied: Admins only" });
      }
    };

    // ✅ Update user role (Admin only)
    app.patch("/role", verifyAdmin, async (req, res) => {
      const { email, role } = req.body;

      try {
        const result = await usersCollection.updateOne(
          { email },
          { $set: { role } }
        );
        res.json({ message: "Role updated", result });
      } catch (err) {
        console.error("Role update error:", err);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // ✅ Get all books
    app.get("/books", async (req, res) => {
      try {
        const bookData = await booksCollection.find().toArray();
        res.status(200).json(bookData);
      } catch (err) {
        console.error("Error fetching books:", err);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // ✅ Add a book

    app.post("/books", async (req, res) => {
      const newBook = req.body;

      try {
        const result = await booksCollection.insertOne(newBook);
        res.status(201).json({ insertedId: result.insertedId });
      } catch (error) {
        console.error("Failed to add book:", error);
        res.status(500).json({ error: "Failed to add book" });
      }
    });

    // Delete Book
    app.delete("/books/:id", async (req, res) => {
      const { id } = req.params;

      try {
        const result = await booksCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
          res.json({ success: true });
        } else {
          res.status(404).json({ error: "Book not found" });
        }
      } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });


    // ✅ Start the server
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });

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
