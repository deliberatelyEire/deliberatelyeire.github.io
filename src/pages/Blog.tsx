import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSection from "@/components/NewsletterSection";
import { getAllPosts } from "@/lib/posts";
import { Clock, Filter } from "lucide-react";

const categories = [
  "All",
  "Constitutional History",
  "Diplomatic History",
  "Literature & Thought",
  "Modern Diaspora",
  "Historical Figures",
  "Trade & Economy",
  "Culture & Symbols",
  "Higher Education",
];

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";
  const allArticles = getAllPosts();

  const filteredArticles = activeCategory === "All"
    ? allArticles
    : allArticles.filter((art) => art.category.toLowerCase() === activeCategory.toLowerCase());

  const handleSelectCategory = (cat: string) => {
    if (cat === "All") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="container py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <span className="type-label font-bold text-primary">
              Archival Essays &amp; Contemporary Studies
            </span>
            <h1 className="type-display font-bold text-foreground">
              Articles &amp; Chronicles
            </h1>
            <p className="mt-2 type-body text-muted-foreground max-w-2xl">
              Explore primary sources, legal frameworks, official data, and policy analysis on Ireland.
            </p>
          </motion.div>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center gap-2 pb-4 border-b border-border">
            <div className="flex items-center gap-1.5 type-meta font-semibold text-muted-foreground mr-2">
              <Filter className="h-3.5 w-3.5" /> Filter:
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleSelectCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 type-meta font-semibold transition-all ${
                  activeCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="mt-10">
            {filteredArticles.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-3 bg-card/40 my-8">
                <h3 className="type-h3 font-bold text-foreground">No Articles Published Yet</h3>
                <p className="type-caption text-muted-foreground max-w-md mx-auto">
                  {activeCategory === "All"
                    ? "Chronicles, archival essays, and demographic studies are in preparation. Drop your Markdown files in src/content/posts/ to publish."
                    : `No articles currently published under "${activeCategory}". Select another category or check back soon.`}
                </p>
                {activeCategory !== "All" && (
                  <button
                    onClick={() => handleSelectCategory("All")}
                    className="inline-block mt-2 type-meta font-semibold text-primary underline"
                  >
                    View All Categories
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredArticles.map((post, i) => (
                    <motion.article
                      key={post.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                      whileHover={{ y: -4 }}
                      className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-lg"
                    >
                      <Link to={`/article/${post.slug || post.id}`} className="block">
                        <div className="overflow-hidden rounded-lg border border-border/60 bg-secondary/30">
                          <img
                            src={post.cover}
                            alt={post.title}
                            className="w-full aspect-[16/10] object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between type-meta">
                            <span className="font-semibold text-primary">{post.category}</span>
                            {post.readTime && (
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {post.readTime}
                              </span>
                            )}
                          </div>
                          <h2 className="type-title font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h2>
                          <p className="type-caption text-muted-foreground line-clamp-3">
                            {post.excerpt}
                          </p>
                        </div>
                      </Link>
                      <div className="flex items-center justify-between type-meta text-muted-foreground pt-4 mt-3 border-t border-border/60">
                        <span className="font-semibold text-foreground">{post.author}</span>
                        <span>{post.dateModified ? `Last updated ${post.dateModified}` : post.date}</span>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
