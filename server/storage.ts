import { db } from "./firebase";
import { ref, get, set, push, child } from "firebase/database";
import { users, projects, type User, type Project, type InsertUser } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: number, points: number): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Project operations
  createProject(project: Omit<Project, "id" | "status" | "progress">): Promise<Project>;
  getProject(id: number): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
  updateProjectProgress(id: number, progress: number): Promise<Project>;
  completeProject(id: number): Promise<Project>;

  // Session store
  sessionStore: session.Store;
}

export class FirebaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24h
      stale: false,
      ttl: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }

  private generateId(): number {
    return Math.floor(Math.random() * 1000000) + 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const snapshot = await get(ref(db, `user-credit/users/${id}`));
      if (!snapshot.exists()) return undefined;
      return snapshot.val() as User;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const snapshot = await get(ref(db, 'user-credit/users'));
      const users = snapshot.val() || {};
      const user = Object.values(users).find((user: any) => user.username === username);
      return user as User | undefined;
    } catch (error) {
      console.error("Error getting user by username:", error);
      throw error;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const id = this.generateId();
      const user: User = {
        id,
        ...insertUser,
        role: "member",
        points: 0,
        avatar: insertUser.avatar || null,
      };

      await set(ref(db, `user-credit/users/${id}`), user);
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUserPoints(userId: number, points: number): Promise<User> {
    try {
      const user = await this.getUser(userId);
      if (!user) throw new Error("User not found");

      const updatedUser = {
        ...user,
        points: user.points + points,
      };

      await set(ref(db, `user-credit/users/${userId}`), updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Error updating user points:", error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const snapshot = await get(ref(db, 'user-credit/users'));
      const users = snapshot.val() || {};
      return Object.values(users) as User[];
    } catch (error) {
      console.error("Error getting all users:", error);
      throw error;
    }
  }

  async createProject(project: Omit<Project, "id" | "status" | "progress">): Promise<Project> {
    try {
      const id = this.generateId();
      const newProject: Project = {
        ...project,
        id,
        status: "active",
        progress: 0,
        teamMembers: project.teamMembers || [],
        tasks: project.tasks || [],
      };

      await set(ref(db, `user-credit/projects/${id}`), newProject);
      return newProject;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  async getProject(id: number): Promise<Project | undefined> {
    try {
      const snapshot = await get(ref(db, `user-credit/projects/${id}`));
      if (!snapshot.exists()) return undefined;
      return snapshot.val() as Project;
    } catch (error) {
      console.error("Error getting project:", error);
      throw error;
    }
  }

  async getAllProjects(): Promise<Project[]> {
    try {
      const snapshot = await get(ref(db, 'user-credit/projects'));
      const projects = snapshot.val() || {};
      return Object.values(projects) as Project[];
    } catch (error) {
      console.error("Error getting all projects:", error);
      throw error;
    }
  }

  async updateProjectProgress(id: number, progress: number): Promise<Project> {
    try {
      const project = await this.getProject(id);
      if (!project) throw new Error("Project not found");

      const updatedProject = {
        ...project,
        progress,
      };

      await set(ref(db, `user-credit/projects/${id}`), updatedProject);
      return updatedProject;
    } catch (error) {
      console.error("Error updating project progress:", error);
      throw error;
    }
  }

  async completeProject(id: number): Promise<Project> {
    try {
      const project = await this.getProject(id);
      if (!project) throw new Error("Project not found");

      const updatedProject = {
        ...project,
        status: "completed" as const,
        progress: 100,
      };

      await set(ref(db, `user-credit/projects/${id}`), updatedProject);
      return updatedProject;
    } catch (error) {
      console.error("Error completing project:", error);
      throw error;
    }
  }
}

export const storage = new FirebaseStorage();