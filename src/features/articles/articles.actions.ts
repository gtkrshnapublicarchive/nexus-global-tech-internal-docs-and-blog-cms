"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/core/auth/auth";
import { db } from "@/core/database/db";
import { calculateReadTime } from "@/shared/lib/read_time";
import { CreateArticleSchema, UpdateArticleSchema } from "./articles.dto";
import { ArticleStatus } from "@prisma/client";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function saveArticleAction(formData: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      error: "Authentication required to perform this action.",
    };
  }

  // Anti-Pattern 1 & 2: Authoring Studio restricted exclusively to Editor role
  if (session.user.role !== "EDITOR") {
    return {
      success: false,
      error: "Unauthorized: Authoring privileges required.",
    };
  }

  const rawData = formData as Record<string, unknown>;
  const isUpdate = !!rawData.id;

  if (isUpdate) {
    const parseResult = UpdateArticleSchema.safeParse(rawData);
    if (!parseResult.success) {
      const issues = parseResult.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      }));
      return {
        success: false,
        error: "Please review and correct the marked items before updating.",
        issues,
      };
    }
    const validated = parseResult.data;
    const existing = await db.article.findUnique({
      where: { id: validated.id },
      select: { authorId: true, isPinned: true },
    });

    if (!existing) {
      return { success: false, error: "Article not found." };
    }

    // Anti-IDOR check
    if (session.user.role !== "EDITOR" && existing.authorId !== session.user.id) {
      return {
        success: false,
        error: "Forbidden: You do not have permission to modify this article.",
      };
    }

    const { minutes, wordCount } = calculateReadTime(validated.content ?? "");

    // Anti-Pattern 4: Enforce max 2 pinned invariant
    if (validated.isPinned && !existing.isPinned) {
      await db.$transaction(async (tx) => {
        const pinnedCount = await tx.article.count({
          where: { isPinned: true, id: { not: validated.id } },
        });

        if (pinnedCount >= 2) {
          const oldestPinned = await tx.article.findFirst({
            where: { isPinned: true, id: { not: validated.id } },
            orderBy: { pinnedAt: "asc" },
            select: { id: true },
          });

          if (oldestPinned) {
            await tx.article.update({
              where: { id: oldestPinned.id },
              data: { isPinned: false, pinnedAt: null },
            });
          }
        }

        await tx.article.update({
          where: { id: validated.id },
          data: {
            title: validated.title,
            excerpt: validated.excerpt,
            content: validated.content,
            departmentId: validated.departmentId,
            coverImageUrl: validated.coverImageUrl || null,
            status: validated.status as ArticleStatus,
            isPinned: true,
            pinnedAt: new Date(),
            readTimeMinutes: minutes,
            wordCount,
            publishedAt:
              validated.status === "PUBLISHED" ? new Date() : undefined,
          },
        });
      });
    } else {
      await db.article.update({
        where: { id: validated.id },
        data: {
          title: validated.title,
          excerpt: validated.excerpt,
          content: validated.content,
          departmentId: validated.departmentId,
          coverImageUrl: validated.coverImageUrl || null,
          status: validated.status as ArticleStatus,
          isPinned: validated.isPinned ?? existing.isPinned,
          pinnedAt: validated.isPinned ? new Date() : null,
          readTimeMinutes: minutes,
          wordCount,
          publishedAt:
            validated.status === "PUBLISHED" ? new Date() : undefined,
        },
      });
    }

    revalidatePath("/feed");
    revalidatePath("/editor");
    return { success: true, id: validated.id };
  }

  // Create Flow
  const parseResult = CreateArticleSchema.safeParse(rawData);
  if (!parseResult.success) {
    const issues = parseResult.error.issues.map((i) => ({
      field: i.path.join("."),
      message: i.message,
    }));
    return {
      success: false,
      error: "Please review and correct the marked items before saving.",
      issues,
    };
  }
  const validated = parseResult.data;
  const baseSlug = slugify(validated.title);
  let finalSlug = baseSlug;
  let counter = 1;

  while (await db.article.findUnique({ where: { slug: finalSlug } })) {
    finalSlug = `${baseSlug}-${counter++}`;
  }

  const { minutes, wordCount } = calculateReadTime(validated.content);

  let newArticleId = "";

  if (validated.isPinned) {
    await db.$transaction(async (tx) => {
      const pinnedCount = await tx.article.count({ where: { isPinned: true } });
      if (pinnedCount >= 2) {
        const oldestPinned = await tx.article.findFirst({
          where: { isPinned: true },
          orderBy: { pinnedAt: "asc" },
          select: { id: true },
        });
        if (oldestPinned) {
          await tx.article.update({
            where: { id: oldestPinned.id },
            data: { isPinned: false, pinnedAt: null },
          });
        }
      }

      const created = await tx.article.create({
        data: {
          title: validated.title,
          slug: finalSlug,
          excerpt: validated.excerpt,
          content: validated.content,
          departmentId: validated.departmentId,
          coverImageUrl: validated.coverImageUrl || null,
          status: validated.status as ArticleStatus,
          isPinned: true,
          pinnedAt: new Date(),
          readTimeMinutes: minutes,
          wordCount,
          authorId: session.user.id,
          publishedAt:
            validated.status === "PUBLISHED" ? new Date() : null,
        },
        select: { id: true },
      });
      newArticleId = created.id;
    });
  } else {
    const created = await db.article.create({
      data: {
        title: validated.title,
        slug: finalSlug,
        excerpt: validated.excerpt,
        content: validated.content,
        departmentId: validated.departmentId,
        coverImageUrl: validated.coverImageUrl || null,
        status: validated.status as ArticleStatus,
        isPinned: false,
        readTimeMinutes: minutes,
        wordCount,
        authorId: session.user.id,
        publishedAt: validated.status === "PUBLISHED" ? new Date() : null,
      },
      select: { id: true },
    });
    newArticleId = created.id;
  }

  revalidatePath("/feed");
  revalidatePath("/editor");
  return { success: true, id: newArticleId, slug: finalSlug };
}

export async function togglePinAction(articleId: string, shouldPin: boolean) {
  const session = await auth();
  if (session?.user?.role !== "EDITOR") {
    throw new Error("Unauthorized: Only editors may pin articles.");
  }

  if (shouldPin) {
    await db.$transaction(async (tx) => {
      const pinnedCount = await tx.article.count({
        where: { isPinned: true, id: { not: articleId } },
      });
      if (pinnedCount >= 2) {
        const oldest = await tx.article.findFirst({
          where: { isPinned: true, id: { not: articleId } },
          orderBy: { pinnedAt: "asc" },
          select: { id: true },
        });
        if (oldest) {
          await tx.article.update({
            where: { id: oldest.id },
            data: { isPinned: false, pinnedAt: null },
          });
        }
      }

      await tx.article.update({
        where: { id: articleId },
        data: { isPinned: true, pinnedAt: new Date() },
      });
    });
  } else {
    await db.article.update({
      where: { id: articleId },
      data: { isPinned: false, pinnedAt: null },
    });
  }

  revalidatePath("/feed");
  revalidatePath("/editor");
  return { success: true };
}

export async function updateArticleStatusAction(
  articleId: string,
  newStatus: ArticleStatus
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "EDITOR") {
    throw new Error("Unauthorized: Editorial privileges required.");
  }

  await db.article.update({
    where: { id: articleId },
    data: {
      status: newStatus,
      publishedAt: newStatus === "PUBLISHED" ? new Date() : undefined,
    },
  });

  revalidatePath("/feed");
  revalidatePath("/editor");
  return { success: true };
}

export async function deleteArticleAction(articleId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "EDITOR") {
    throw new Error("Unauthorized: Editorial privileges required.");
  }

  await db.article.delete({
    where: { id: articleId },
  });

  revalidatePath("/feed");
  revalidatePath("/editor");
  return { success: true };
}
