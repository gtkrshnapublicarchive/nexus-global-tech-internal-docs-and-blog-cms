export function calculateReadTime(content: string): {
  minutes: number;
  wordCount: number;
} {
  if (!content || !content.trim()) {
    return { minutes: 1, wordCount: 0 };
  }

  const cleanText = content.replace(/[#*`~_>[\]()]/g, " ").trim();
  const words = cleanText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));

  return { minutes, wordCount };
}
