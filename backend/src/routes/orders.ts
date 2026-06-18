import { Router, Request, Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { authMiddleware, adminMiddleware, AuthRequest } from "../middleware/auth.js";

const router = Router();

const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().optional(),
    quantity: z.number().int().min(1),
    name: z.string(),
    price: z.number(),
  })),
  shippingName: z.string().min(1),
  shippingAddress: z.string().min(1),
  shippingCity: z.string().min(1),
  shippingState: z.string().min(1),
  shippingZip: z.string().min(1),
  paymentMethod: z.string().optional(),
  note: z.string().optional(),
  isCustomOrder: z.boolean().optional(),
  customConfig: z.record(z.string(), z.any()).optional(),
});

// POST /api/orders — authenticated user, create order
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const data = orderSchema.safeParse(req.body);
  if (!data.success) {
    return res.status(400).json({ error: "Invalid input", details: data.error.flatten() });
  }

  const total = data.data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await prisma.order.create({
    data: {
      userId: req.user!.userId,
      total,
      paymentMethod: data.data.paymentMethod ?? "cashapp",
      shippingName: data.data.shippingName,
      shippingAddress: data.data.shippingAddress,
      shippingCity: data.data.shippingCity,
      shippingState: data.data.shippingState,
      shippingZip: data.data.shippingZip,
      note: data.data.note,
      isCustomOrder: data.data.isCustomOrder ?? false,
      customConfig: data.data.customConfig ?? undefined,
      items: {
        create: data.data.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        })),
      },
    },
    include: { items: true },
  });

  res.status(201).json(order);
});

// GET /api/orders — authenticated user, list own orders; admin sees all
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const where = req.user!.role === "ADMIN" ? {} : { userId: req.user!.userId };
  const orders = await prisma.order.findMany({
    where,
    include: { items: true, user: { select: { id: true, email: true, firstName: true, lastName: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(orders);
});

// GET /api/orders/:id — authenticated, own order or admin
router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: true, user: { select: { id: true, email: true, firstName: true, lastName: true } } },
  });
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  if (req.user!.role !== "ADMIN" && order.userId !== req.user!.userId) {
    return res.status(403).json({ error: "Not authorized" });
  }
  res.json(order);
});

// PATCH /api/orders/:id — admin only, update status
router.patch("/:id", authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status },
    include: { items: true },
  });
  res.json(order);
});

export default router;
