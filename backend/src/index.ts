import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "./lib/prisma.js";
import bcrypt from "bcryptjs";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Debug endpoint — remove after testing
app.get("/api/debug", async (_req, res) => {
  try {
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    res.json({
      database: "connected",
      users: userCount,
      products: productCount,
      bcrypt: typeof bcrypt.hash === "function" ? "ok" : "broken",
    });
  } catch (err: any) {
    res.json({ database: "error", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Wrist Werks API running on http://localhost:${PORT}`);
});
