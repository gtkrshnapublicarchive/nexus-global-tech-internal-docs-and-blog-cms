"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { BookOpen, Bookmark, PlusCircle, LogOut, ShieldCheck, User } from "lucide-react";

interface NavbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: "READER" | "EDITOR";
    department?: string;
  };
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const isEditor = user.role === "EDITOR";

  return (
    <header className="sticky top-0 z-40 border-b border-black/8 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/feed" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#252724] text-white transition group-hover:bg-[#3b3e39]">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-['Fraunces'] text-lg font-medium leading-none tracking-tight text-[#20211f]">
                Nexus
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737870]">
                Knowledge Base
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/feed"
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                pathname === "/feed"
                  ? "bg-[#eef2ec] text-[#20211f]"
                  : "text-[#626760] hover:bg-black/5 hover:text-[#20211f]"
              }`}
            >
              Feed
            </Link>
            <Link
              href="/bookmarks"
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                pathname === "/bookmarks"
                  ? "bg-[#eef2ec] text-[#20211f]"
                  : "text-[#626760] hover:bg-black/5 hover:text-[#20211f]"
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>Bookmarks</span>
            </Link>

            {/* DOM Exclusion: Editorial links completely omitted for Readers */}
            {isEditor && (
              <Link
                href="/editor"
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  pathname.startsWith("/editor")
                    ? "bg-[#252724] text-white"
                    : "text-[#626760] hover:bg-black/5 hover:text-[#20211f]"
                }`}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Author Studio</span>
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-black/8 bg-[#fbfbfa] px-3 py-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eef2ec] text-[#5a8357]">
              {isEditor ? (
                <ShieldCheck className="h-3.5 w-3.5" />
              ) : (
                <User className="h-3.5 w-3.5" />
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-[#20211f] leading-tight">
                {user.name ?? "Nexus Engineer"}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-[#737870] leading-tight">
                <span>{user.department ?? "Engineering"}</span>
                <span>•</span>
                <span className={isEditor ? "font-semibold text-[#5a8357]" : "text-[#737870]"}>
                  {user.role === "EDITOR" ? "Editor" : "Reader"}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Sign Out"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/8 text-[#737870] transition hover:border-black/20 hover:bg-black/5 hover:text-[#20211f]"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
