export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export function extractTableOfContents(content: string): TocItem[] {
  if (!content) return [];

  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const hashes = match[1];
    const text = match[2].trim();
    const level = hashes.length as 2 | 3;
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    items.push({ id, text, level });
  }

  return items;
}
