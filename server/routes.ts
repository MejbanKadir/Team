import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertProjectSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Projects routes
  app.get("/api/projects", async (_req, res) => {
    const projects = await storage.getAllProjects();
    res.json(projects);
  });

  app.post("/api/projects", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const validation = insertProjectSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json(validation.error);
    }

    const project = await storage.createProject({
      ...validation.data,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json(project);
  });

  app.patch("/api/projects/:id/progress", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const { progress } = req.body;
    const project = await storage.updateProjectProgress(
      parseInt(req.params.id),
      progress
    );
    res.json(project);
  });

  app.post("/api/projects/:id/complete", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const project = await storage.completeProject(parseInt(req.params.id));
    
    // Distribute points to team members
    for (const memberId of project.teamMembers) {
      await storage.updateUserPoints(memberId, project.rewardPoints);
    }
    
    res.json(project);
  });

  // Users routes
  app.get("/api/users", async (_req, res) => {
    const users = await storage.getAllUsers();
    res.json(users);
  });

  app.get("/api/users/skill/:skill", async (req, res) => {
    const users = await storage.getUsersBySkill(req.params.skill);
    res.json(users);
  });

  const httpServer = createServer(app);
  return httpServer;
}
