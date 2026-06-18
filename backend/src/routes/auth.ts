import { Router, Request, Response } from "express";
// eslint-disable-next-line @typescript-eslint/no-require-imports
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { signToken, authMiddleware, adminMiddleware, AuthRequest } from "../middleware/auth.js";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const data = registerSchema.safeParse(req.body);
    if (!data.success) {
      return res.status(400).json({ error: "Invalid input", details: data.error.flatten() });
    }

    const existing = await prisma.user.findUnique({ where: { email: data.data.email } });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(data.data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.data.email,
        passwordHash,
        firstName: data.data.firstName,
        lastName: data.data.lastName,
      },
    });

    const token = signToken({ userId: user.id, role: user.role });
    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
    });
  } catch (err: any) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Internal server error", message: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const data = loginSchema.safeParse(req.body);
    if (!data.success) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const user = await prisma.user.findUnique({ where: { email: data.data.email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(data.data.password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken({ userId: user.id, role: user.role });
    res.json({
      token,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error", message: err.message });
  }
});

// GET /api/auth/me
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
  });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

export default router;
