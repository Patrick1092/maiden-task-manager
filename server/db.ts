import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Task management queries
import { analytics, InsertAnalytics, InsertTask, Task, tasks } from "../drizzle/schema";
import { and, desc, gte, lte, sql } from "drizzle-orm";

export async function createTask(task: InsertTask): Promise<Task> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(tasks).values(task);
  const insertedId = result[0].insertId;
  
  const [newTask] = await db.select().from(tasks).where(eq(tasks.id, Number(insertedId))).limit(1);
  if (!newTask) throw new Error("Failed to create task");
  
  return newTask;
}

export async function getUserTasks(userId: number): Promise<Task[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(tasks).where(eq(tasks.userId, userId)).orderBy(desc(tasks.createdAt));
}

export async function getTaskById(taskId: number, userId: number): Promise<Task | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const [task] = await db.select().from(tasks).where(and(eq(tasks.id, taskId), eq(tasks.userId, userId))).limit(1);
  return task;
}

export async function updateTask(taskId: number, userId: number, updates: Partial<InsertTask>): Promise<Task | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(tasks).set(updates).where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
  
  return getTaskById(taskId, userId);
}

export async function deleteTask(taskId: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.delete(tasks).where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
  return result[0].affectedRows > 0;
}

export async function toggleTaskCompletion(taskId: number, userId: number): Promise<Task | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const task = await getTaskById(taskId, userId);
  if (!task) return undefined;

  const newCompleted = task.completed === 1 ? 0 : 1;
  const completedAt = newCompleted === 1 ? new Date() : null;

  return updateTask(taskId, userId, { completed: newCompleted, completedAt });
}

// Analytics queries
export async function getAnalyticsByPeriod(
  userId: number,
  period: "daily" | "weekly" | "monthly",
  periodKey: string
) {
  const db = await getDb();
  if (!db) return undefined;

  const [result] = await db
    .select()
    .from(analytics)
    .where(
      and(
        eq(analytics.userId, userId),
        eq(analytics.period, period),
        eq(analytics.periodKey, periodKey)
      )
    )
    .limit(1);

  return result;
}

export async function upsertAnalytics(data: InsertAnalytics): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(analytics).values(data).onDuplicateKeyUpdate({
    set: {
      totalTasks: data.totalTasks,
      completedTasks: data.completedTasks,
      productivityScore: data.productivityScore,
      updatedAt: new Date(),
    },
  });
}

export async function getUserTasksInPeriod(
  userId: number,
  startDate: Date,
  endDate: Date
): Promise<Task[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        gte(tasks.createdAt, startDate),
        lte(tasks.createdAt, endDate)
      )
    );
}

export async function getRecentAnalytics(
  userId: number,
  period: "daily" | "weekly" | "monthly",
  limit: number = 7
) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(analytics)
    .where(
      and(
        eq(analytics.userId, userId),
        eq(analytics.period, period)
      )
    )
    .orderBy(desc(analytics.periodKey))
    .limit(limit);
}
