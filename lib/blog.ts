import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const postsDirectory = path.join(process.cwd(), "content", "blog");

export type BlogPostListItem = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  coverImage?: string;
  readingMinutes: number;
};

export type BlogPost = BlogPostListItem & {
  contentHtml: string;
};

function parseFrontmatterTags(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map(String);
  }
  if (typeof raw === "string" && raw.trim()) {
    return [raw];
  }
  return [];
}

function readingMinutesFromMarkdown(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getAllPostsMeta(): BlogPostListItem[] {
  const slugs = getPostSlugs();
  const posts: BlogPostListItem[] = slugs.map((slug) => {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const file = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(file);
    return {
      slug,
      title: String(data.title ?? ""),
      description: String(data.description ?? ""),
      date: String(data.date ?? ""),
      author: String(data.author ?? "KreditScore Team"),
      tags: parseFrontmatterTags(data.tags),
      coverImage:
        typeof data.coverImage === "string" ? data.coverImage : undefined,
      readingMinutes: readingMinutesFromMarkdown(content),
    };
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const file = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(file);
  const processed = await remark().use(remarkHtml).process(content);
  const contentHtml = processed.toString();

  return {
    slug,
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    author: String(data.author ?? "KreditScore Team"),
    tags: parseFrontmatterTags(data.tags),
    coverImage:
      typeof data.coverImage === "string" ? data.coverImage : undefined,
    readingMinutes: readingMinutesFromMarkdown(content),
    contentHtml,
  };
}
