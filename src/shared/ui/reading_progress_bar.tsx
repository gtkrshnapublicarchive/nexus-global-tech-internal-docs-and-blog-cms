"use client";

import { useEffect, useState } from "react";

export function ReadingProgressBar() {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    function updateScrollProgress() {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setCompletion(Number((window.scrollY / scrollHeight).toFixed(3)) * 100);
      }
    }

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-0 z-50 h-[3px] w-full bg-transparent pointer-events-none"
    >
      <div
        className="h-full bg-[#5a8357] transition-all duration-75 ease-out"
        style={{ width: `${completion}%` }}
      />
    </div>
  );
}
