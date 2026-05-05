import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import { tags, taskTags, InsertTag, InsertTaskTag, Tag, TaskTag } from "../drizzle/schema";

// Tag management queries
export async function createTag(tag: InsertTag): Promise<Tag> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(tags).values(tag);
  const insertedId = result[0].insertId;
  
  const [newTag] = await db.select().from(tags).where(eq(tags.id, Number(insertedId))).limit(1);
  if (!newTag) throw new Error("Failed to create tag");
  
  return newTag;
}

export async function getUserTags(userId: number): Promise<Tag[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(tags).where(eq(tags.userId, userId));
}

export async function deleteTag(tagId: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // D'abord supprimer toutes les associations task-tag
  await db.delete(taskTags).where(eq(taskTags.tagId, tagId));
  
  // Puis supprimer le tag
  const result = await db.delete(tags).where(and(eq(tags.id, tagId), eq(tags.userId, userId)));
  return result[0].affectedRows > 0;
}

// Task-Tag relationship queries
export async function addTagToTask(taskId: number, tagId: number): Promise<TaskTag> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(taskTags).values({ taskId, tagId });
  const insertedId = result[0].insertId;
  
  const [newTaskTag] = await db.select().from(taskTags).where(eq(taskTags.id, Number(insertedId))).limit(1);
  if (!newTaskTag) throw new Error("Failed to add tag to task");
  
  return newTaskTag;
}

export async function removeTagFromTask(taskId: number, tagId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.delete(taskTags).where(
    and(eq(taskTags.taskId, taskId), eq(taskTags.tagId, tagId))
  );
  return result[0].affectedRows > 0;
}

export async function getTaskTags(taskId: number): Promise<Tag[]> {
  const db = await getDb();
  if (!db) return [];

  // Joindre taskTags avec tags pour obtenir les tags d'une tâche
  const result = await db
    .select({
      id: tags.id,
      userId: tags.userId,
      name: tags.name,
      color: tags.color,
      createdAt: tags.createdAt,
    })
    .from(taskTags)
    .innerJoin(tags, eq(taskTags.tagId, tags.id))
    .where(eq(taskTags.taskId, taskId));

  return result;
}

export async function getTasksByTag(tagId: number, userId: number): Promise<number[]> {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({ taskId: taskTags.taskId })
    .from(taskTags)
    .where(eq(taskTags.tagId, tagId));

  return result.map(r => r.taskId);
}
