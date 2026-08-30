import delibratelyImg from "@/assets/DelibratelyEire.jpg";
import lampImg from "@/assets/lamp.jpg";
import tiesImg from "@/assets/ireland-india-ties.jpg";
import article1 from "@/assets/article-1.jpg";
import article2 from "@/assets/article-2.jpg";
import article3 from "@/assets/article-3.jpg";
import article4 from "@/assets/article-4.jpg";

export interface MarkdownPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  role?: string;
  date: string;
  category: string;
  readTime?: string;
  cover?: string;
  sources?: string;
  featured?: boolean;
  order?: number;
  content: string;
}

const imageMap: Record<string, string> = {
  "DelibratelyEire.jpg": delibratelyImg,
  "lamp.jpg": lampImg,
  "ireland-india-ties.jpg": tiesImg,
  "article-1.jpg": article1,
  "article-2.jpg": article2,
  "article-3.jpg": article3,
  "article-4.jpg": article4,
};

// Parse simple YAML frontmatter without requiring heavy dependencies
function parseFrontmatter(fileContent: string): { metadata: Record<string, any>; content: string } {
  const frontmatterRegex = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);

  if (!match) {
    return { metadata: {}, content: fileContent.trim() };
  }

  const rawYaml = match[1];
  const bodyContent = match[2].trim();
  const metadata: Record<string, any> = {};

  const lines = rawYaml.split(/[\r\n]+/);
  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      // Clean quoted strings
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      } else if (value.toLowerCase() === "true") {
        value = true as any;
      } else if (value.toLowerCase() === "false") {
        value = false as any;
      } else if (!isNaN(Number(value)) && value !== "") {
        value = Number(value) as any;
      }

      metadata[key] = value;
    }
  }

  return { metadata, content: bodyContent };
}

// Automatically discover all .md files in src/content/posts
export function getAllPosts(): MarkdownPost[] {
  const modules = import.meta.glob<{ default: string }>("/src/content/posts/*.md", {
    query: "?raw",
    eager: true,
  });

  const posts: MarkdownPost[] = [];

  for (const [path, moduleData] of Object.entries(modules)) {
    const rawText = typeof moduleData === "string" ? moduleData : (moduleData as any).default || "";
    const filename = path.split("/").pop() || "";
    const slug = filename.replace(/\.md$/, "");

    const { metadata, content } = parseFrontmatter(rawText);

    // Resolve cover image
    const rawCover = metadata.cover || "";
    const resolvedCover = imageMap[rawCover] || rawCover || tiesImg;

    posts.push({
      id: metadata.id || slug,
      slug: slug,
      title: metadata.title || "Untitled Article",
      excerpt: metadata.excerpt || "",
      author: metadata.author || "Deliberately Éire Research",
      role: metadata.role || "Research & Analysis",
      date: metadata.date || "2026",
      category: metadata.category || "General",
      readTime: metadata.readTime || "5 min read",
      cover: resolvedCover,
      sources: metadata.sources || "",
      featured: Boolean(metadata.featured),
      order: typeof metadata.order === "number" ? metadata.order : 999,
      content: content,
    });
  }

  // Sort by order ascending, then by date descending
  return posts.sort((a, b) => (a.order || 999) - (b.order || 999));
}

export function getPostByIdOrSlug(identifier: string): MarkdownPost | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.id === identifier || p.slug === identifier);
}

export function getFeaturedPost(): MarkdownPost | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.featured) || posts[0];
}
