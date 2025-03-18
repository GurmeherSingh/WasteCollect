import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertPickupSchema, insertRequirementSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Pickup routes
  app.post("/api/pickups", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const pickup = insertPickupSchema.parse({
      ...req.body,
      userId: req.user.id,
    });
    const created = await storage.createPickup(pickup);
    res.status(201).json(created);
  });

  app.get("/api/pickups/user", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const pickups = await storage.getPickupsByUser(req.user.id);
    res.json(pickups);
  });

  app.get("/api/pickups/collector", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.role !== "collector") return res.sendStatus(403);
    const pickups = await storage.getPickupsByCollector(req.user.id);
    res.json(pickups);
  });

  app.get("/api/pickups/available", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.role !== "collector") return res.sendStatus(403);
    const pickups = await storage.getAvailablePickups();
    res.json(pickups);
  });

  app.patch("/api/pickups/:id/assign", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.role !== "collector") return res.sendStatus(403);
    const pickup = await storage.assignPickup(parseInt(req.params.id), req.user.id);
    res.json(pickup);
  });

  app.patch("/api/pickups/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { status } = req.body;
    const pickup = await storage.updatePickupStatus(parseInt(req.params.id), status);

    // Award points for completed pickups
    if (status === 'completed') {
      await storage.addPoints(
        pickup.userId,
        50,
        'pickup_completed',
        'Pickup completed successfully'
      );

      // Check for achievements
      const userPickups = await storage.getPickupsByUser(pickup.userId);
      if (userPickups.length === 1) {
        await storage.unlockAchievement(pickup.userId, 'first_pickup', 100);
      } else if (userPickups.length === 10) {
        await storage.unlockAchievement(pickup.userId, 'ten_pickups', 500);
      }
    }

    res.json(pickup);
  });

  // Requirements routes
  app.post("/api/requirements", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.role !== "recycling") return res.sendStatus(403);
    const requirement = insertRequirementSchema.parse({
      ...req.body,
      recyclingCenterId: req.user.id,
    });
    const created = await storage.createRequirement(requirement);
    res.status(201).json(created);
  });

  app.get("/api/requirements", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const requirements = await storage.getRequirements();
    res.json(requirements);
  });

  // Users by role
  app.get("/api/users/:role", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.role !== "admin") return res.sendStatus(403);
    const users = await storage.getUsersByRole(req.params.role);
    res.json(users);
  });

  // Points and Achievements routes
  app.get("/api/points/history", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const history = await storage.getPointHistory(req.user.id);
    res.json(history);
  });

  app.get("/api/achievements", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const achievements = await storage.getAchievements(req.user.id);
    res.json(achievements);
  });

  const httpServer = createServer(app);
  return httpServer;
}