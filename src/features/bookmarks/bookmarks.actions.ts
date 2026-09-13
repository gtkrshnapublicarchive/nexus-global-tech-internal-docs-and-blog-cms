"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/core/auth/auth";
import { db } from "@/core/database/db";

export async function toggleBookmarkAction(articleId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Authentication required to bookmark articles.");
  }

  const userId = session.user.id;

  const existing = await db.bookmark.findUnique({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });

  if (existing) {
    await db.bookmark.delete({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });

    revalidatePath("/feed");
    revalidatePath("/bookmarks");
    return { bookmarked: false };
  }

  await db.bookmark.create({
    data: {
      userId,
      articleId,
    },
  });

  revalidatePath("/feed");
  revalidatePath("/bookmarks");
  return { bookmarked: true };
}
