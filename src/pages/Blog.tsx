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
            <span className="text-xs uppercase tracking-wider font-sans-ui font-bold text-primary">
              Archival Essays &amp; Contemporary Studies
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground font-serif">
              Articles &amp; Chronicles
            </h1>
            <p className="mt-2 text-muted-foreground text-base max-w-2xl font-serif">
              Explore primary sources, constitutional lineages, diplomatic records, and living diaspora narratives between Ireland and India.
            </p>
          </motion.div>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center gap-2 pb-4 border-b border-border font-sans-ui">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mr-2">
              <Filter className="h-3.5 w-3.5" /> Filter:
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleSelectCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
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
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                      <div className="flex items-center justify-between font-sans-ui text-xs">
                        <span className="font-semibold text-primary">{post.category}</span>
                        {post.readTime && (
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {post.readTime}
                          </span>
                        )}
                      </div>
                      <h2 className="text-base md:text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors font-serif line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-3 font-serif">
                        {post.excerpt}
                      </p>
                    </div>
                  </Link>
                  <div className="flex items-center justify-between text-xs font-sans-ui text-muted-foreground pt-4 mt-3 border-t border-border/60">
                    <span className="font-semibold text-foreground">{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </section>
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
