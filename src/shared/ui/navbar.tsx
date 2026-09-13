"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Bookmark, PlusCircle } from "lucide-react";
import { NavUserMenu } from "./nav_user_menu";

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

        <NavUserMenu user={user} />
      </div>
    </header>
  );
}
