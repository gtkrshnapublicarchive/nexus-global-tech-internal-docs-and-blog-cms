import { notFound, redirect } from "next/navigation";
import { auth } from "@/core/auth/auth";
import { db } from "@/core/database/db";
import { Navbar } from "@/shared/ui/navbar";
import { MarkdownStudio } from "@/features/editor/markdown_studio";
import { EditorTable } from "@/features/editor/editor_table";

export const metadata = {
  title: "Author Studio - Nexus Knowledge Base",
  description: "Internal split-screen markdown authoring and review portal",
};

interface EditorPageProps {
  searchParams: Promise<{
    id?: string;
  }>;
}

export default async function EditorPage({ searchParams }: EditorPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Anti-Pattern 2: Under no circumstances may non-editors access privileged routes
  if (session.user.role !== "EDITOR") {
    notFound();
  }

  const { id } = await searchParams;

  const [departments, allArticles, targetArticle] = await Promise.all([
    db.department.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    db.article.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        department: { select: { name: true } },
        author: { select: { name: true } },
      },
    }),
    id
      ? db.article.findUnique({
          where: { id },
          select: {
            id: true,
            title: true,
            excerpt: true,
            content: true,
            departmentId: true,
            documentType: true,
            coverImageUrl: true,
            isPinned: true,
            status: true,
          },
        })
      : null,
  ]);

  const managedArticles = allArticles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    status: a.status,
    documentType: a.documentType,
    aurumBounty: a.aurumBounty,
    isPinned: a.isPinned,
    department: a.department,
    author: a.author,
    createdAt: a.createdAt.toISOString(),
    publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
  }));

  return (
    <div className="min-h-screen bg-[#fbfbfa]">
      <Navbar user={session.user} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
        <MarkdownStudio
          departments={departments}
          initialArticle={targetArticle ?? undefined}
        />

        <EditorTable articles={managedArticles} />
      </main>
    </div>
  );
}
