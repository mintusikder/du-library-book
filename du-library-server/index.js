const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI and client setup
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
    const borrowedBooksCollection = db.collection("borrowedBooks");

    // Create new user
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

    // Get user role by email
    app.get("/users/role/:email", async (req, res) => {
      const email = req.params.email;

      try {
        const user = await usersCollection.findOne({ email });
        res.status(200).json({ role: user?.role || "user" });
      } catch (error) {
        console.error("Error fetching role:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Middleware for admin verification (placeholder)
    const verifyAdmin = async (req, res, next) => {
      const { email } = req.body;
      if (!email) {
        return res
          .status(400)
          .json({ message: "Email is required for admin check" });
      }

      const user = await usersCollection.findOne({ email });

      if (user?.role === "admin") {
        next();
      } else {
        return res.status(403).json({ message: "Access denied: Admins only" });
      }
    };

    // Update user role (Admin only)
    app.patch("/role", verifyAdmin, async (req, res) => {
      const { email, role } = req.body;

      if (!email || !role) {
        return res.status(400).json({ message: "Email and role are required" });
      }

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

    // Get all books
    app.get("/books", async (req, res) => {
      try {
        const bookData = await booksCollection.find().toArray();
        res.status(200).json(bookData);
      } catch (err) {
        console.error("Error fetching books:", err);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Add a book
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

    // Update book
    app.patch("/books/:id", async (req, res) => {
      const { id } = req.params;
      const updateData = { ...req.body };

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid book ID format" });
      }

      if (updateData._id) delete updateData._id;

      try {
        const result = await booksCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: "Book not found" });
        }

        res.status(200).json({
          message: "Book updated successfully",
          modifiedCount: result.modifiedCount,
        });
      } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ error: "Failed to update book" });
      }
    });

    // Borrow a book
    app.post("/borrowedBooks", async (req, res) => {
      const { name, phone, role, book_title, author, publisher } = req.body;

      if (!name || !phone || !role || !book_title || !author || !publisher) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      try {
        const book = await booksCollection.findOne({
          book_title,
          author,
          publisher,
        });

        if (!book) {
          return res.status(404).json({ error: "Book not found" });
        }

        if (book.quantity < 1) {
          return res.status(400).json({ error: "No copies available" });
        }

        const borrowRecord = {
          name,
          phone,
          role,
          book_title,
          author,
          publisher,
          borrowedAt: new Date(),
        };

        const insertResult = await borrowedBooksCollection.insertOne(
          borrowRecord
        );

        res.status(201).json({
          message: "Borrow successful",
          borrowId: insertResult.insertedId,
        });
      } catch (error) {
        console.error("Borrow failed:", error);
        res.status(500).json({ error: "Server error" });
      }
    });

    // Get all borrowed books
    app.get("/borrowedBooks", async (req, res) => {
      try {
        const data = await borrowedBooksCollection.find().toArray();
        res.status(200).json(data);
      } catch (error) {
        console.error("Error fetching borrowedBooks:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Return book (delete borrowed entry)
    app.delete("/borrowedBooks/:id", async (req, res) => {
      const { id } = req.params;
      if (!ObjectId.isValid(id))
        return res.status(400).json({ error: "Invalid ID" });

      try {
        const result = await borrowedBooksCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Borrowed record not found" });
        }
        res.status(200).json({ message: "Returned successfully" });
      } catch (error) {
        console.error("Error returning book:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Start server
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
