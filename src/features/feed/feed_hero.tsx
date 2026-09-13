"use client";

import Image from "next/image";
import { Search, Sparkles, Layers, Users, Clock } from "lucide-react";

interface FeedHeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function FeedHero({ searchQuery, onSearchChange }: FeedHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-black/8 bg-white p-6 sm:p-10 shadow-sm">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#e7f2e4] px-3 py-1 text-xs font-semibold text-[#4c7649]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Nexus Global Tech - Internal Engineering Hub</span>
          </div>

          <h1 className="font-['Fraunces'] text-3xl font-medium tracking-tight text-[#20211f] sm:text-5xl leading-tight">
            Centralized Architectural Knowledge & RFCs
          </h1>

          <p className="text-sm leading-relaxed text-[#626760] max-w-xl">
            The single source of truth for 200 software engineers across Aurelia City. Discover operational runbooks, system incident post-mortems, and architectural decision records.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2 rounded-xl bg-[#fbfbfa] border border-black/6 px-3 py-1.5 text-xs text-[#20211f]">
              <Users className="h-3.5 w-3.5 text-[#5a8357]" />
              <span className="font-semibold">200 Active Staff</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-[#fbfbfa] border border-black/6 px-3 py-1.5 text-xs text-[#20211f]">
              <Layers className="h-3.5 w-3.5 text-[#5a8357]" />
              <span className="font-semibold">4 Departments</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-[#fbfbfa] border border-black/6 px-3 py-1.5 text-xs text-[#20211f]">
              <Clock className="h-3.5 w-3.5 text-[#5a8357]" />
              <span className="font-semibold">Weekly RFC Cadence</span>
            </div>
          </div>

          <div className="pt-2">
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#81857e]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search guides, RFCs, authors, topics..."
                className="w-full rounded-xl border border-black/10 bg-[#fbfbfa] py-2.5 pl-10 pr-4 text-sm text-[#20211f] placeholder:text-[#81857e] shadow-sm focus:border-[#668c63] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#668c63]/20"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-black/8 bg-[#fbfbfa] shadow-sm">
            <Image
              src="/images/nexus_hero_banner.jpg"
              alt="Nexus Global Tech Architecture Network"
              fill
              priority
              className="object-cover transition duration-300 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
