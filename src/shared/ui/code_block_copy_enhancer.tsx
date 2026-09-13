"use client";

import { useEffect, useRef } from "react";

interface CodeBlockCopyEnhancerProps {
  children: React.ReactNode;
  className?: string;
}

export function CodeBlockCopyEnhancer({
  children,
  className = "",
}: CodeBlockCopyEnhancerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const pres = containerRef.current.querySelectorAll("pre");
    pres.forEach((pre) => {
      // Prevent duplicate buttons
      if (pre.querySelector(".code-copy-btn")) return;

      pre.style.position = "relative";

      const btn = document.createElement("button");
      btn.className =
        "code-copy-btn absolute top-3 right-3 flex items-center gap-1 rounded-lg border border-black/10 bg-white/90 px-2 py-1 text-[10px] font-semibold text-[#5c6158] backdrop-blur-sm transition hover:bg-white hover:text-[#20211f] shadow-sm";
      btn.type = "button";
      btn.innerHTML = `
        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
        <span>Copy</span>
      `;

      btn.addEventListener("click", async () => {
        const code = pre.querySelector("code")?.innerText || pre.innerText;
        try {
          await navigator.clipboard.writeText(code);
          btn.innerHTML = `
            <svg class="h-3 w-3 text-[#5a8357]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="text-[#5a8357]">Copied!</span>
          `;
          setTimeout(() => {
            btn.innerHTML = `
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              <span>Copy</span>
            `;
          }, 2000);
        } catch {
          // Clipboard write fallback
        }
      });

      pre.appendChild(btn);
    });
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
