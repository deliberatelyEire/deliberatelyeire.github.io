import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSection from "@/components/NewsletterSection";
import { getPostByIdOrSlug, getFeaturedPost } from "@/lib/posts";
import { ArrowLeft, Clock, Calendar, Bookmark, ShieldCheck, Share2 } from "lucide-react";

const Article = () => {
  const { id } = useParams();
  const article = (id ? getPostByIdOrSlug(id) : undefined) || getFeaturedPost();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Update meta tags and schema markup for SEO
  useEffect(() => {
    if (!article) return;

    const baseUrl = "https://deliberatelyeire.github.io";
    const articleUrl = `${baseUrl}/article/${article.slug || article.id}`;

    // Update document title
    document.title = `${article.title} — Deliberately Éire`;

    // Helper to update or create meta tag
    const updateMeta = (name: string, content: string, property?: boolean) => {
      const attr = property ? "property" : "name";
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    // Update OG and Twitter meta tags
    updateMeta("og:title", article.title, true);
    updateMeta("og:description", article.excerpt, true);
    const coverUrl = article.cover ? new URL(article.cover, baseUrl).href : `${baseUrl}/DelibratelyEire.jpg`;
    updateMeta("og:image", coverUrl, true);
    updateMeta("og:url", articleUrl, true);
    updateMeta("og:type", "article", true);
    updateMeta("article:published_time", new Date(article.date).toISOString(), true);
    if (article.dateModified) {
      updateMeta("article:modified_time", new Date(article.dateModified).toISOString(), true);
    }
    updateMeta("description", article.excerpt);
    updateMeta("twitter:title", article.title);
    updateMeta("twitter:description", article.excerpt);
    updateMeta("twitter:image", coverUrl);

    // Add canonical tag
    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = articleUrl;

    // Add BlogPosting schema markup
    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": article.title,
      "description": article.excerpt,
      "image": coverUrl,
      "datePublished": new Date(article.date).toISOString(),
      ...(article.dateModified
        ? { dateModified: new Date(article.dateModified).toISOString() }
        : {}),
      "author": {
        "@type": "Organization",
        "name": article.author,
      },
      "publisher": {
        "@type": "Organization",
        "name": "Deliberately Éire",
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`,
        },
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": articleUrl,
      },
    };

    let schemaScript = document.querySelector("script[type='application/ld+json'][data-article-schema]") as HTMLScriptElement;
    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.type = "application/ld+json";
      schemaScript.setAttribute("data-article-schema", "true");
      document.head.appendChild(schemaScript);
    }
    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${baseUrl}/blog` },
        { "@type": "ListItem", "position": 3, "name": article.title, "item": articleUrl },
      ],
    };
    schemaScript.textContent = JSON.stringify([schema, breadcrumb]);

    return () => {
      // Cleanup: remove article-specific meta tags when component unmounts
      // Keep them for now as they'll be overwritten on next article load
    };
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Header />
        <main className="container max-w-3xl mx-auto py-20 px-6 text-center space-y-4">
          <h1 className="type-h1 font-bold text-foreground">Article Not Found</h1>
          <p className="type-body text-muted-foreground">The requested chronicle or research document does not exist.</p>
          <Link to="/blog" className="inline-block type-ui font-semibold text-primary hover:underline">
            ← Return to All Articles
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Reading Progress Indicator */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left" style={{ scaleX }} />
      <Header />
      
      <main>
        <article className="container max-w-3xl mx-auto py-12 px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <Link to="/blog" className="inline-flex items-center gap-1.5 type-meta font-semibold text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to All Articles
              </Link>
              <div className="flex items-center gap-2">
                <button aria-label="Share" className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary">
                  <Share2 className="h-4 w-4" />
                </button>
                <button aria-label="Bookmark" className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary">
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>
            </div>

            <span className="type-label font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md inline-block">
              {article.category}
            </span>
            <h1 className="mt-3 type-display font-bold text-foreground">
              {article.title}
            </h1>

            {/* Author & Meta Bar */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border type-meta text-muted-foreground">
              <div>
                <span className="type-ui font-bold text-foreground block">{article.author}</span>
                <span className="text-muted-foreground">{article.role}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{article.dateModified ? `Last updated ${article.dateModified}` : article.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{article.readTime}</span>
              </div>
            </div>

            {/* Cover Image */}
            {article.cover && (
              <div className="mt-8 overflow-hidden rounded-xl border border-border shadow-sm bg-card">
                <img src={article.cover} alt={article.title} className="w-full aspect-[16/9] object-cover" />
              </div>
            )}

            {/* Markdown Content Renderer */}
            <div className="mt-10 type-body text-foreground/90 markdown-body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ src, alt }) => {
                    // src is already resolved to a bundled asset URL by posts.ts.
                    //
                    // Not lazy. These figures render at w-full with no height, so before
                    // they load their box is 0x0 -- and a zero-area element never
                    // intersects the viewport, so the lazy observer never fires and the
                    // image never loads at all. Every figure in every article was silently
                    // blank. The card images elsewhere lazy-load fine because they sit in
                    // an aspect-ratio container and have a real box to observe.
                    return (
                      <img
                        src={src || ""}
                        alt={alt || ""}
                        className="w-full rounded-lg my-6 border border-border"
                        decoding="async"
                      />
                    );
                  },
                  h1: ({ children }) => (
                    <h1 className="type-h1 font-bold text-foreground mt-10 mb-4 pb-2 border-b border-border/60">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="type-h2 font-bold text-foreground mt-8 mb-3 pb-1 border-b border-border/40">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="type-h3 font-bold text-foreground mt-6 mb-2">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="my-4 type-body text-foreground/90">
                      {children}
                    </p>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary pl-5 py-3 my-6 italic text-foreground font-medium bg-secondary/40 rounded-r-lg">
                      {children}
                    </blockquote>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-1.5 my-4 type-body">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-1.5 my-4 type-body">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-foreground/90">{children}</li>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noreferrer" className="text-primary underline hover:text-primary/80">
                      {children}
                    </a>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-6 border border-border rounded-lg">
                      <table className="w-full type-ui text-left divide-y divide-border">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-2.5 bg-secondary/60 font-bold text-foreground">{children}</th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-2 text-foreground/90 border-t border-border/50">{children}</td>
                  ),
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>

            {/* Primary Sources & Citations Box */}
            {article.sources && (
              <div className="mt-12 rounded-xl border border-border bg-card p-6 space-y-2 shadow-sm">
                <div className="flex items-center gap-2 type-label font-bold text-primary">
                  <ShieldCheck className="h-4 w-4" /> Primary Official Sourcing
                </div>
                <p className="type-meta text-muted-foreground">
                  <span className="font-semibold text-foreground">Verified Document Record:</span> {article.sources}
                </p>
              </div>
            )}

            {/* Dispatch Subscription Box */}
            <div className="mt-10 rounded-xl bg-card border-2 border-primary/25 p-8 text-center space-y-3">
              <span className="type-label font-semibold text-primary">
                Deliberately Éire Community
              </span>
              <h3 className="type-h2 font-bold text-foreground">Want the next dispatch?</h3>
              <p className="type-caption text-muted-foreground max-w-md mx-auto">
                Leave your address and hear when new work on diplomatic records, constitutional milestones, and living diaspora research is published.
              </p>
              <div className="pt-2">
                <a href="#newsletter" className="inline-block rounded-md bg-primary px-6 py-2.5 type-ui font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-105 active:scale-95">
                  Subscribe to the Dispatch
                </a>
              </div>
            </div>
          </motion.div>
        </article>
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Article;
