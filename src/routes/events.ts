import { Router, Request, Response, NextFunction } from "express";
import { validateEventId } from "../middleware/validateEventId";
import { eventsListLimiter } from "../middleware/rateLimiter";
import {
  getEventById,
  getTiersByEventId,
  getTicketById,
  getSponsorshipsByEventId,
  getAllEvents,
  EventsUnavailableError,
} from "../services/eventsService";

const router = Router();

router.get("/", eventsListLimiter, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await getAllEvents();
    res.json(serializeBigInt(events));
  } catch (err) {
    if (err instanceof EventsUnavailableError) {
      res.status(503).json({ error: err.message });
      return;
    }
    next(err);
  }
});

router.get(
  "/:id",
  validateEventId,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const event = await getEventById(id);
      res.json(serializeBigInt(event));
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:id/tiers",
  validateEventId,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const tiers = await getTiersByEventId(id);
      res.json(serializeBigInt(tiers));
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:id/sponsorships",
  validateEventId,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const sponsorships = await getSponsorshipsByEventId(id);
      res.json(serializeBigInt(sponsorships));
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:id/tickets/:ticketId",
  validateEventId,
  async (req: Request, res: Response, next: NextFunction) => {
    const ticketId = Number(req.params.ticketId);
    if (!Number.isInteger(ticketId) || ticketId < 0) {
      res.status(400).json({ error: "ticket id must be a non-negative integer" });
      return;
    }
    try {
      const id = Number(req.params.id);
      const ticket = await getTicketById(id, ticketId);
      res.json(serializeBigInt(ticket));
    } catch (err) {
      next(err);
    }
  }
);

function serializeBigInt(value: unknown): unknown {
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) return value.map(serializeBigInt);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        serializeBigInt(v),
      ])
    );
  }
  return value;
}

export default router;
