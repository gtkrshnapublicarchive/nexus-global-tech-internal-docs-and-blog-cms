import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: true,
});

export function compileMarkdownToHtml(markdown: string): string {
  if (!markdown) return "";
  
  // Custom renderer for heading anchors
  const renderer = new marked.Renderer();
  
  renderer.heading = ({ text, depth }) => {
    const slug = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    return `<h${depth} id="${slug}" class="scroll-mt-20">${text}</h${depth}>`;
  };

  return marked.parse(markdown, { renderer }) as string;
}
