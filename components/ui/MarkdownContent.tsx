import { marked } from "marked";

export function MarkdownContent({ markdown }: { markdown: string }) {
  const html = marked.parse(markdown, { async: false }) as string;
  return (
    <div
      className="prose-bop"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
