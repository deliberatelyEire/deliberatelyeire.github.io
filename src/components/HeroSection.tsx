import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllPosts, getFeaturedPost } from "@/lib/posts";
import heroImg from "@/assets/ireland-india-ties.jpg";
import { BookOpen, ArrowRight, Clock, Feather, Sparkles, Share2 } from "lucide-react";

const HeroSection = () => {
  const allPosts = getAllPosts();
  const featuredArticle = getFeaturedPost() || allPosts[0];
  const featuredPosts = allPosts.filter((p) => p.id !== featuredArticle?.id).slice(0, 5);

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
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold font-sans-ui text-primary border border-primary/20">
              <Sparkles className="h-3.5 w-3.5" /> Ties older than either republic
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] text-foreground font-serif">
              Unearthing the Shared History, Policy &amp; Culture of Ireland &amp; India
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed font-serif max-w-xl">
              Welcome to <strong className="text-foreground">Deliberately Éire</strong>. An independent publication dedicated to comparative constitutional statecraft, archival chronicles, diaspora statistics, and literary kindred spirits.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3 font-sans-ui">
              <a
                href="#newsletter"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:scale-105 active:scale-95 transition-transform"
              >
                <Feather className="h-4 w-4" /> Subscribe to Dispatches
              </a>
              <Link
                to="/resources"
                className="inline-flex items-center gap-2 rounded-md bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground hover:bg-secondary/80 transition-colors"
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
              alt="Deliberately Éire - Ireland and India Ties"
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
              <h2 className="text-lg font-bold text-foreground font-serif">
                X Updates
              </h2>
            </div>
            <span className="text-xs font-semibold font-sans-ui text-primary uppercase tracking-wider">
              Follow
            </span>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground font-serif leading-relaxed pt-2">
              Follow us on X for real-time updates on Irish immigration policy, comparative citizenship analysis, and research insights.
            </p>
            <a
              href="https://x.com/delibratelyEire"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 w-full justify-center rounded-md bg-primary hover:bg-primary/90 px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Follow @delibratelyEire
            </a>
            <p className="text-xs text-muted-foreground font-sans-ui pt-2">
              New threads on citizenship pathways, policy analysis, and research findings published regularly.
            </p>
          </div>
        </motion.aside>
      </div>
    </section>
  );
};

export default HeroSection;
