import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllPosts, getFeaturedPost } from "@/lib/posts";
import heroImg from "@/assets/DelibratelyEire.jpg";
import { BookOpen, ArrowRight, Clock, Feather, Sparkles, Share2 } from "lucide-react";

const HeroSection = () => {
  const allPosts = getAllPosts();
  const featuredArticle = getFeaturedPost() || allPosts[0];

  // If no posts exist yet, render a mission & welcome hero
  if (!featuredArticle) {
    return (
      <section className="container py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 type-meta font-semibold text-primary border border-primary/20">
              <Sparkles className="h-3.5 w-3.5" /> Evidence Over Noise
            </div>
            <h1 className="type-display font-bold text-foreground">
              Irish Citizenship, Immigration &amp; Policy, Read from the Sources
            </h1>
            <p className="type-body text-muted-foreground max-w-xl">
              Welcome to <strong className="text-foreground">Deliberately Éire</strong>. An independent publication dedicated to evidence-led research on Irish citizenship, immigration policy, and law.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#newsletter"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 type-ui font-semibold text-primary-foreground shadow-sm hover:scale-105 active:scale-95 transition-transform"
              >
                <Feather className="h-4 w-4" /> Subscribe to Dispatches
              </a>
              <Link
                to="/resources"
                className="inline-flex items-center gap-2 rounded-md bg-secondary px-5 py-2.5 type-ui font-semibold text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                Browse Data &amp; Reports
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="overflow-hidden rounded-2xl border border-border shadow-md bg-card"
          >
            <img
              src={heroImg}
              alt="Deliberately Éire"
              className="w-full aspect-[16/10] object-cover"
            />
          </motion.div>
        </div>
      </section>
    );
  }

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
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-0.5 type-meta font-semibold text-primary">
                  <BookOpen className="h-3 w-3" /> {featuredArticle.category}
                </span>
                <span className="type-meta text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {featuredArticle.readTime}
                </span>
              </div>
              <h1 className="type-h1 font-bold text-foreground group-hover:text-primary transition-colors">
                {featuredArticle.title}
              </h1>
              <p className="type-body text-muted-foreground max-w-2xl">
                {featuredArticle.excerpt}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-border/60 type-ui text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{featuredArticle.author}</span>
                  <span>·</span>
                  <span>{featuredArticle.date}</span>
                </div>
                <span className="type-meta font-semibold text-primary inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Analysis <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </motion.article>
        </Link>

        {/* X Updates Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              <h2 className="type-h4 font-bold text-foreground">
                X Updates
              </h2>
            </div>
            <span className="type-label font-semibold text-primary">
              Follow
            </span>
          </div>
          <div className="space-y-4">
            <p className="type-caption text-muted-foreground pt-2">
              Follow us on X for real-time updates on Irish immigration policy, comparative citizenship analysis, and research insights.
            </p>
            <a
              href="https://x.com/delibratelyEire"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 w-full justify-center rounded-md bg-primary hover:bg-primary/90 px-4 py-2.5 type-ui font-semibold text-primary-foreground transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Follow @delibratelyEire
            </a>
            <p className="type-meta text-muted-foreground pt-2">
              New threads on citizenship pathways, policy analysis, and research findings published regularly.
            </p>
          </div>
        </motion.aside>
      </div>
    </section>
  );
};

export default HeroSection;
