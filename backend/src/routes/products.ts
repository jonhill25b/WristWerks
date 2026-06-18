import { Router, Request, Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { authMiddleware, adminMiddleware, AuthRequest } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().min(0).optional(),
  category: z.string().optional(),
  active: z.boolean().optional(),
});

// GET /api/products — public, list active products
router.get("/", async (req: Request, res: Response) => {
  const { category, search } = req.query;
  const where: Record<string, unknown> = { active: true };

  if (category && typeof category === "string") {
    where.category = category;
  }
  if (search && typeof search === "string") {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const products = await prisma.product.findMany({ where, orderBy: { createdAt: "desc" } });
  res.json(products);
});

// GET /api/products/:id — public, single product
router.get("/:id", async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

// POST /api/products — admin only, create product
router.post("/", authMiddleware, adminMiddleware, upload.array("images", 5), async (req: AuthRequest, res: Response) => {
  const data = productSchema.safeParse(req.body);
  if (!data.success) {
    return res.status(400).json({ error: "Invalid input", details: data.error.flatten() });
  }

  const files = req.files as Express.Multer.File[];
  const images = files ? files.map(f => `/uploads/${f.filename}`) : [];

  const product = await prisma.product.create({
    data: {
      name: data.data.name,
      description: data.data.description,
      price: data.data.price,
      stock: data.data.stock ?? 0,
      category: data.data.category ?? "pre-made",
      active: data.data.active ?? true,
      images,
    },
  });
  res.status(201).json(product);
});

// PATCH /api/products/:id — admin only, update product
router.patch("/:id", authMiddleware, adminMiddleware, upload.array("images", 5), async (req: AuthRequest, res: Response) => {
  const data = productSchema.partial().safeParse(req.body);
  if (!data.success) {
    return res.status(400).json({ error: "Invalid input", details: data.error.flatten() });
  }

  const updateData: Record<string, unknown> = { ...data.data };

  const files = req.files as Express.Multer.File[];
  if (files && files.length > 0) {
    updateData.images = files.map(f => `/uploads/${f.filename}`);
  }

  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: updateData,
  });
  res.json(product);
});

// DELETE /api/products/:id — admin only
router.delete("/:id", authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.json({ message: "Product deleted" });
});

export default router;
