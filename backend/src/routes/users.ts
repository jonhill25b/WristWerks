import { Router, Response } from "express";
import prisma from "../lib/prisma.js";
import { authMiddleware, adminMiddleware, AuthRequest } from "../middleware/auth.js";

const router = Router();

// GET /api/users — admin only, list all users
router.get("/", authMiddleware, adminMiddleware, async (_req: AuthRequest, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(users);
});

// GET /api/users/:id — admin only, get single user
router.get("/:id", authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
  });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

// PATCH /api/users/:id — admin only, update user (role, name, etc.)
router.patch("/:id", authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  const { firstName, lastName, role } = req.body;
  const data: Record<string, string> = {};
  if (firstName) data.firstName = firstName;
  if (lastName) data.lastName = lastName;
  if (role === "ADMIN" || role === "CUSTOMER") data.role = role;

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data,
    select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
  });
  res.json(user);
});

// DELETE /api/users/:id — admin only
router.delete("/:id", authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ message: "User deleted" });
});

export default router;
