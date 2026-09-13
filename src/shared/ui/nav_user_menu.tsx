"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  ChevronDown,
  User,
  ShieldCheck,
  Bookmark,
  PlusCircle,
  LogOut,
  BookOpen,
} from "lucide-react";

interface NavUserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: "READER" | "EDITOR";
    department?: string;
  };
}

export function NavUserMenu({ user }: NavUserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isEditor = user.role === "EDITOR";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative z-30">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-black/8 bg-[#fbfbfa] px-3 py-1.5 transition hover:border-black/20 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#668c63]/20"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eef2ec] text-[#5a8357]">
          {isEditor ? (
            <ShieldCheck className="h-3.5 w-3.5" />
          ) : (
            <User className="h-3.5 w-3.5" />
          )}
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-semibold text-[#20211f] leading-tight">
            {user.name ?? "Nexus Engineer"}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-[#737870] leading-tight">
            <span>{user.department ?? "Engineering"}</span>
            <span>•</span>
            <span
              className={
                isEditor ? "font-semibold text-[#5a8357]" : "text-[#737870]"
              }
            >
              {isEditor ? "Editor" : "Reader"}
            </span>
          </div>
        </div>
        <div
          className={`shrink-0 text-[#737870] transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#20211f]" : ""
          }`}
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </div>
      </button>

      {/* Warm Editorial Light Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-2xl border border-black/8 bg-white p-2 shadow-xl shadow-black/8 animate-in fade-in zoom-in-95 duration-100">
          {/* User Details Header */}
          <div className="border-b border-black/6 px-3 py-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#20211f]">
                {user.name ?? "Nexus Engineer"}
              </span>
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                  isEditor
                    ? "bg-[#e7f2e4] text-[#4c7649]"
                    : "bg-black/5 text-[#737870]"
                }`}
              >
                {isEditor ? "Editor" : "Reader"}
              </span>
            </div>
            <p className="mt-0.5 truncate text-[11px] text-[#737870]">
              {user.email ?? "engineer@nexus.internal"}
            </p>
            <p className="mt-0.5 text-[10px] text-[#a0a59e]">
              Dept: {user.department ?? "Engineering"}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1 space-y-0.5">
            <Link
              href="/feed"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#626760] transition hover:bg-[#f2f5f0] hover:text-[#20211f]"
            >
              <BookOpen className="h-3.5 w-3.5 text-[#737870]" />
              <span>Reader Feed</span>
            </Link>

            <Link
              href="/bookmarks"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#626760] transition hover:bg-[#f2f5f0] hover:text-[#20211f]"
            >
              <Bookmark className="h-3.5 w-3.5 text-[#737870]" />
              <span>Saved Bookmarks</span>
            </Link>

            {/* DOM Exclusion: Editorial links completely omitted for Readers */}
            {isEditor && (
              <Link
                href="/editor"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#626760] transition hover:bg-[#f2f5f0] hover:text-[#20211f]"
              >
                <PlusCircle className="h-3.5 w-3.5 text-[#5a8357]" />
                <span className="font-semibold text-[#20211f]">
                  Author Studio
                </span>
              </Link>
            )}
          </div>

          {/* Sign Out Action */}
          <div className="border-t border-black/6 pt-1">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-[#737870] transition hover:bg-black/5 hover:text-[#20211f]"
            >
              <LogOut className="h-3.5 w-3.5 text-[#737870]" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
