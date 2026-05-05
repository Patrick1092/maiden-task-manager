import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("tasks router", () => {
  it("should create a task successfully", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const task = await caller.tasks.create({
      title: "Test Task",
      description: "This is a test task",
      priority: "high",
    });

    expect(task).toBeDefined();
    expect(task.title).toBe("Test Task");
    expect(task.description).toBe("This is a test task");
    expect(task.priority).toBe("high");
    expect(task.userId).toBe(ctx.user!.id);
    expect(task.completed).toBe(0);
  });

  it("should list user tasks", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a task first
    await caller.tasks.create({
      title: "List Test Task",
      priority: "medium",
    });

    const tasks = await caller.tasks.list();

    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.length).toBeGreaterThan(0);
  });

  it("should toggle task completion", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a task
    const task = await caller.tasks.create({
      title: "Toggle Test Task",
      priority: "low",
    });

    expect(task.completed).toBe(0);

    // Toggle to completed
    const toggledTask = await caller.tasks.toggle({ id: task.id });

    expect(toggledTask).toBeDefined();
    expect(toggledTask!.completed).toBe(1);
    expect(toggledTask!.completedAt).toBeDefined();
  });

  it("should update a task", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a task
    const task = await caller.tasks.create({
      title: "Original Title",
      priority: "medium",
    });

    // Update the task
    const updatedTask = await caller.tasks.update({
      id: task.id,
      title: "Updated Title",
      priority: "high",
    });

    expect(updatedTask).toBeDefined();
    expect(updatedTask!.title).toBe("Updated Title");
    expect(updatedTask!.priority).toBe("high");
  });

  it("should delete a task", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a task
    const task = await caller.tasks.create({
      title: "Task to Delete",
      priority: "low",
    });

    // Delete the task
    const result = await caller.tasks.delete({ id: task.id });

    expect(result).toBe(true);
  });
});

describe("analytics router", () => {
  it("should return dashboard analytics", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const analytics = await caller.analytics.dashboard();

    expect(analytics).toBeDefined();
    expect(analytics.daily).toBeDefined();
    expect(analytics.weekly).toBeDefined();
    expect(analytics.monthly).toBeDefined();
    expect(analytics.allTasks).toBeDefined();

    expect(typeof analytics.daily.total).toBe("number");
    expect(typeof analytics.daily.completed).toBe("number");
    expect(typeof analytics.daily.score).toBe("number");

    expect(analytics.daily.score).toBeGreaterThanOrEqual(0);
    expect(analytics.daily.score).toBeLessThanOrEqual(100);
  });
});
