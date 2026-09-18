import { useParams, Link } from "react-router-dom";
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs font-sans-ui font-semibold text-muted-foreground hover:text-foreground transition-colors">
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

            <span className="text-xs uppercase tracking-wider font-sans-ui font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md inline-block">
              {article.category}
            </span>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold text-foreground leading-[1.15] font-serif">
              {article.title}
            </h1>

            {/* Author & Meta Bar */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border font-sans-ui text-xs text-muted-foreground">
              <div>
                <span className="font-bold text-foreground block text-sm">{article.author}</span>
                <span className="text-muted-foreground">{article.role}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{article.date}</span>
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
            <div className="mt-10 font-serif text-lg leading-relaxed text-foreground/90 markdown-body">
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
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary pl-5 py-3 my-6 italic text-foreground font-medium bg-secondary/40 rounded-r-lg">
                      {children}
                    </blockquote>
                  ),
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
              <div className="mt-12 rounded-xl border border-border bg-card p-6 space-y-2 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-sans-ui font-bold text-primary uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" /> Primary Official Sourcing
                </div>
                <p className="text-xs font-sans-ui text-muted-foreground leading-normal">
                  <span className="font-semibold text-foreground">Verified Document Record:</span> {article.sources}
                </p>
              </div>
            )}

            {/* Dispatch Subscription Box */}
            <div className="mt-10 rounded-xl bg-card border-2 border-primary/25 p-8 text-center space-y-3">
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
        </article>
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Article;
