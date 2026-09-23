import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSection from "@/components/NewsletterSection";
import { getPostByIdOrSlug, getFeaturedPost } from "@/lib/posts";
import { ArrowLeft, Clock, Calendar, Bookmark, ShieldCheck, Share2, Download } from "lucide-react";

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
          <h1 className="text-3xl font-bold font-serif text-foreground">Article Not Found</h1>
          <p className="text-muted-foreground font-serif">The requested chronicle or research document does not exist.</p>
          <Link to="/blog" className="inline-block text-primary hover:underline font-sans-ui text-sm font-semibold">
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
          
          {/* Title Page - only visible in PDF */}
          <section className="title-page print-only" aria-hidden="true">
            <div className="publisher-mark">
              Deliberately <span>Éire</span>
            </div>
            <img 
              src="/logo.png" 
              alt="Deliberately Éire Diya Mark" 
              className="diya-mark" 
            />
            <span className="category-tag">{article.category}</span>
            <h1>{article.title}</h1>
            {article.excerpt && (
              <p className="subtitle">{article.excerpt}</p>
            )}
            <div className="author-block">
              <div className="author-name">{article.author}</div>
              <div className="author-role">{article.role}</div>
            </div>
            <div className="meta-line">
              {article.dateModified ? `Last updated ${article.dateModified}` : `Published ${article.date}`}
            </div>
            <div className="meta-line">
              {article.readTime}
            </div>
            {article.cover && (
              <img src={article.cover} alt={article.title} className="cover-full" />
            )}
            <div className="colophon">
              <a href={typeof window !== 'undefined' ? window.location.href : ''}>
                deliberatelyeire.github.io/article/{article.slug || article.id}
              </a>
            </div>
          </section>

          {/* Content starts on next page in print */}
          <div className="content-start">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <Link to="/blog" className="back-link inline-flex items-center gap-1.5 text-xs font-sans-ui font-semibold text-muted-foreground hover:text-foreground transition-colors no-print">
                <ArrowLeft className="h-4 w-4" /> Back to All Articles
              </Link>
              <div className="flex items-center gap-2">
                <button aria-label="Share" className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary no-print">
                  <Share2 className="h-4 w-4" />
                </button>
                <button aria-label="Bookmark" className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary no-print">
                  <Bookmark className="h-4 w-4" />
                </button>
                <button
                  aria-label="Download PDF"
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary no-print"
                  onClick={() => window.print()}
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>

            <span className="category-badge text-xs uppercase tracking-wider font-sans-ui font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md inline-block">
              {article.category}
            </span>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold text-foreground leading-[1.15] font-serif">
              {article.title}
            </h1>

            {/* Author & Meta Bar */}
            <div className="meta-bar mt-6 flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border font-sans-ui text-xs text-muted-foreground">
              <div className="author-block">
                <span className="author-name font-bold text-foreground block text-sm">{article.author}</span>
                <span className="author-role text-muted-foreground">{article.role}</span>
              </div>
              <div className="meta-items flex items-center gap-4">
                <span className="meta-item flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{article.dateModified ? `Last updated ${article.dateModified}` : article.date}</span>
                <span className="meta-item flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{article.readTime}</span>
              </div>
            </div>

            {/* Cover Image */}
            {article.cover && (
              <div className="mt-8 overflow-hidden rounded-xl border border-border shadow-sm bg-card">
                <img src={article.cover} alt={article.title} className="cover-image w-full aspect-[16/9] object-cover" />
              </div>
            )}

            {/* Markdown Content Renderer */}
            <div className="markdown-body mt-10 font-serif text-lg leading-relaxed text-foreground/90 markdown-body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ src, alt }) => {
                    // Resolve relative image paths - src should already be resolved by posts.ts
                    return (
                      <img
                        src={src || ""}
                        alt={alt || ""}
                        className="w-full rounded-lg my-6 border border-border"
                        loading="lazy"
                      />
                    );
                  },
                  h1: ({ children }) => (
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground font-serif mt-10 mb-4 pb-2 border-b border-border/60">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif mt-8 mb-3 pb-1 border-b border-border/40">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl md:text-2xl font-bold text-foreground font-serif mt-6 mb-2">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="my-4 leading-relaxed font-serif text-base md:text-lg text-foreground/90">
                      {children}
                    </p>
                  ),
                  blockquote: ({ children }) => {
                    // Check if this is a Key Takeaways blockquote
                    const isKeyTakeaways = React.Children.toArray(children).some(child => 
                      typeof child === 'object' && child !== null && 
                      'props' in child && child.props.children &&
                      typeof child.props.children === 'string' && 
                      child.props.children.includes('Key Takeaways')
                    ) || (typeof children === 'string' && children.includes('Key Takeaways'));
                    
                    return (
                      <blockquote className={`border-l-4 border-primary pl-5 py-3 my-6 italic text-foreground font-medium bg-secondary/40 rounded-r-lg ${isKeyTakeaways ? 'key-takeaways' : ''}`}>
                        {children}
                      </blockquote>
                    );
                  },
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-1.5 my-4 text-base md:text-lg">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-1.5 my-4 text-base md:text-lg">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-foreground/90 leading-relaxed">{children}</li>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noreferrer" className="text-primary underline hover:text-primary/80">
                      {children}
                    </a>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-6 border border-border rounded-lg">
                      <table className="w-full text-sm font-sans-ui text-left divide-y divide-border">
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
              <div className="sources-box mt-12 rounded-xl border border-border bg-card p-6 space-y-2 shadow-sm">
                <div className="sources-header flex items-center gap-2 text-xs font-sans-ui font-bold text-primary uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" /> Primary Official Sourcing
                </div>
                <p className="sources-text text-xs font-sans-ui text-muted-foreground leading-normal">
                  <span className="font-semibold text-foreground">Verified Document Record:</span> {article.sources}
                </p>
              </div>
            )}

            {/* Print Footer - only visible in PDF */}
            <div className="print-footer screen-hidden" aria-hidden="true">
              <div className="tricolour-bar" />
              <p>
                Published by <strong>Deliberately Éire</strong> — {article.title}
              </p>
              <p className="mt-1">
                {article.dateModified ? `Last updated ${article.dateModified}` : `Published ${article.date}`} · {article.author}
              </p>
              <p className="mt-1">
                <a href={typeof window !== 'undefined' ? window.location.href : ''} className="text-primary underline">
                  deliberatelyeire.github.io/article/{article.slug || article.id}
                </a>
              </p>
            </div>

            {/* Dispatch Subscription Box */}
            <div className="mt-10 rounded-xl bg-card border-2 border-primary/25 p-8 text-center space-y-3 no-print">
              <span className="text-xs uppercase tracking-wider font-sans-ui font-semibold text-primary">
                Deliberately Éire Community
              </span>
              <h3 className="text-2xl font-bold text-foreground font-serif">Want the next dispatch?</h3>
              <p className="text-sm text-muted-foreground font-serif max-w-md mx-auto">
                Leave your address and hear when new work on diplomatic records, constitutional milestones, and living diaspora research is published.
              </p>
              <div className="pt-2">
                <a href="#newsletter" className="inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-semibold font-sans-ui text-primary-foreground shadow-sm transition-transform hover:scale-105 active:scale-95">
                  Subscribe to the Dispatch
                </a>
              </div>
            </div>
          </motion.div>
        </div>
        </article>
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Article;
