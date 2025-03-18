import { User, InsertUser, Pickup, Requirement } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsersByRole(role: string): Promise<User[]>;
  createPickup(pickup: Omit<Pickup, "id">): Promise<Pickup>;
  getPickupsByUser(userId: number): Promise<Pickup[]>;
  getPickupsByCollector(collectorId: number): Promise<Pickup[]>;
  updatePickupStatus(id: number, status: string): Promise<Pickup>;
  createRequirement(requirement: Omit<Requirement, "id">): Promise<Requirement>;
  getRequirements(): Promise<Requirement[]>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private pickups: Map<number, Pickup>;
  private requirements: Map<number, Requirement>;
  sessionStore: session.Store;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.pickups = new Map();
    this.requirements = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, rewardPoints: 0 };
    this.users.set(id, user);
    return user;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }

  async createPickup(pickup: Omit<Pickup, "id">): Promise<Pickup> {
    const id = this.currentId++;
    const newPickup: Pickup = { ...pickup, id };
    this.pickups.set(id, newPickup);
    return newPickup;
  }

  async getPickupsByUser(userId: number): Promise<Pickup[]> {
    return Array.from(this.pickups.values()).filter(
      pickup => pickup.userId === userId
    );
  }

  async getPickupsByCollector(collectorId: number): Promise<Pickup[]> {
    return Array.from(this.pickups.values()).filter(
      pickup => pickup.collectorId === collectorId
    );
  }

  async updatePickupStatus(id: number, status: string): Promise<Pickup> {
    const pickup = this.pickups.get(id);
    if (!pickup) throw new Error("Pickup not found");
    const updatedPickup = { ...pickup, status };
    this.pickups.set(id, updatedPickup);
    return updatedPickup;
  }

  async createRequirement(requirement: Omit<Requirement, "id">): Promise<Requirement> {
    const id = this.currentId++;
    const newRequirement: Requirement = { ...requirement, id };
    this.requirements.set(id, newRequirement);
    return newRequirement;
  }

  async getRequirements(): Promise<Requirement[]> {
    return Array.from(this.requirements.values());
  }
}

export const storage = new MemStorage();
