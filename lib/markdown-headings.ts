export type MarkdownHeading = {
  level: 2 | 3;
  text: string;
  id: string;
};

export function cleanMarkdownHeading(value: string) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

export function uniqueMarkdownHeadingId(text: string, counts: Map<string, number>) {
  const base = cleanMarkdownHeading(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section';
  const count = counts.get(base) || 0;
  counts.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

export function extractMarkdownHeadings(content: string): MarkdownHeading[] {
  const counts = new Map<string, number>();
  return Array.from(content.matchAll(/^(#{2,3})\s+(.+?)\s*#*\s*$/gm), (match) => {
    const level = match[1].length as 2 | 3;
    const text = cleanMarkdownHeading(match[2]);
    return { level, text, id: uniqueMarkdownHeadingId(text, counts) };
  }).filter((heading) => heading.text.length > 0);
}
