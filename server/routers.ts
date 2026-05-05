import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Task management router
  tasks: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserTasks } = await import("./db");
      return getUserTasks(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1, "Title is required").max(255),
          description: z.string().optional(),
          dueDate: z.date().optional(),
          priority: z.enum(["high", "medium", "low"]).default("medium"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { createTask } = await import("./db");
        return createTask({
          userId: ctx.user.id,
          title: input.title,
          description: input.description,
          dueDate: input.dueDate,
          priority: input.priority,
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).max(255).optional(),
          description: z.string().optional(),
          dueDate: z.date().optional(),
          priority: z.enum(["high", "medium", "low"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { updateTask } = await import("./db");
        const { id, ...updates } = input;
        return updateTask(id, ctx.user.id, updates);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { deleteTask } = await import("./db");
        return deleteTask(input.id, ctx.user.id);
      }),

    toggle: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { toggleTaskCompletion } = await import("./db");
        return toggleTaskCompletion(input.id, ctx.user.id);
      }),
  }),

  // Analytics router
  analytics: router({
    dashboard: protectedProcedure.query(async ({ ctx }) => {
      const { getUserTasks } = await import("./db");
      const allTasks = await getUserTasks(ctx.user.id);

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // Tâches créées ou à compléter aujourd'hui
      const todayEnd = new Date(today);
      todayEnd.setDate(todayEnd.getDate() + 1);
      const todayTasks = allTasks.filter(t => {
        const createdToday = t.createdAt >= today && t.createdAt < todayEnd;
        const dueToday = t.dueDate && new Date(t.dueDate) >= today && new Date(t.dueDate) < todayEnd;
        return createdToday || dueToday;
      });
      const weekTasks = allTasks.filter(t => t.createdAt >= weekStart);
      const monthTasks = allTasks.filter(t => t.createdAt >= monthStart);

      const calcScore = (tasks: typeof allTasks) => {
        if (tasks.length === 0) return 0;
        const completed = tasks.filter(t => t.completed === 1).length;
        return Math.round((completed / tasks.length) * 100);
      };

      return {
        daily: {
          total: todayTasks.length,
          completed: todayTasks.filter(t => t.completed === 1).length,
          score: calcScore(todayTasks),
        },
        weekly: {
          total: weekTasks.length,
          completed: weekTasks.filter(t => t.completed === 1).length,
          score: calcScore(weekTasks),
        },
        monthly: {
          total: monthTasks.length,
          completed: monthTasks.filter(t => t.completed === 1).length,
          score: calcScore(monthTasks),
        },
        allTasks: {
          total: allTasks.length,
          completed: allTasks.filter(t => t.completed === 1).length,
          highPriority: allTasks.filter(t => t.priority === "high" && t.completed === 0).length,
        },
      };
    }),

    history: protectedProcedure
      .input(
        z.object({
          period: z.enum(["daily", "weekly", "monthly"]),
          limit: z.number().default(7),
        })
      )
      .query(async ({ ctx, input }) => {
        const { getRecentAnalytics } = await import("./db");
        return getRecentAnalytics(ctx.user.id, input.period, input.limit);
      }),
  }),

  // Tags router
  tags: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserTags } = await import("./tagsDb");
      return getUserTags(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name is required").max(50),
          color: z.string().min(1, "Color is required"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { createTag } = await import("./tagsDb");
        return createTag({
          userId: ctx.user.id,
          name: input.name,
          color: input.color,
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { deleteTag } = await import("./tagsDb");
        return deleteTag(input.id, ctx.user.id);
      }),

    addToTask: protectedProcedure
      .input(
        z.object({
          taskId: z.number(),
          tagId: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { addTagToTask } = await import("./tagsDb");
        return addTagToTask(input.taskId, input.tagId);
      }),

    removeFromTask: protectedProcedure
      .input(
        z.object({
          taskId: z.number(),
          tagId: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { removeTagFromTask } = await import("./tagsDb");
        return removeTagFromTask(input.taskId, input.tagId);
      }),

    getTaskTags: protectedProcedure
      .input(z.object({ taskId: z.number() }))
      .query(async ({ ctx, input }) => {
        const { getTaskTags } = await import("./tagsDb");
        return getTaskTags(input.taskId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
