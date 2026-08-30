import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllPosts, getFeaturedPost } from "@/lib/posts";
import { BookOpen, ArrowRight, Clock } from "lucide-react";

const HeroSection = () => {
  const allPosts = getAllPosts();
  const featuredArticle = getFeaturedPost() || allPosts[0];
  const featuredPosts = allPosts.filter((p) => p.id !== featuredArticle?.id).slice(0, 5);

  if (!featuredArticle) return null;

  return (
    <section className="container py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-start">
        {/* Main Featured Article */}
        <Link to={`/article/${featuredArticle.slug || featuredArticle.id}`} className="group block">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="cursor-pointer"
          >
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <motion.img
                src={featuredArticle.cover}
                alt={featuredArticle.title}
                className="w-full aspect-[16/9] object-cover"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-2 font-sans-ui">
                <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  <BookOpen className="h-3 w-3" /> {featuredArticle.category}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {featuredArticle.readTime}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors font-serif">
                {featuredArticle.title}
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed max-w-2xl font-serif">
                {featuredArticle.excerpt}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-border/60 text-sm font-sans-ui text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{featuredArticle.author}</span>
                  <span>·</span>
                  <span>{featuredArticle.date}</span>
                </div>
                <span className="text-xs font-semibold text-primary inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Analysis <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </motion.article>
        </Link>

        {/* Featured Posts Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="text-lg font-bold text-foreground font-serif">
              Chronicles &amp; Key Essays
            </h2>
            <span className="text-xs font-semibold font-sans-ui text-saffron uppercase tracking-wider">
              Essential
            </span>
          </div>
          <ul className="divide-y divide-border">
            {featuredPosts.map((post) => (
              <li key={post.id} className="py-3.5 group cursor-pointer">
                <Link to={`/article/${post.slug || post.id}`} className="block space-y-1.5">
                  <span className="text-[11px] font-sans-ui font-semibold text-primary uppercase tracking-wide">
                    {post.category}
                  </span>
                  <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors font-serif">
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs font-sans-ui text-muted-foreground pt-1">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </motion.aside>
      </div>
    </section>
  );
};

export default HeroSection;
