import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllPosts } from "@/lib/posts";
import { BookOpen } from "lucide-react";

const ContentGrid = () => {
  const allPosts = getAllPosts();
  const posts = allPosts.slice(1, 5); // Show latest publications after featured

  if (allPosts.length === 0) {
    return (
      <section className="container py-12">
        <div className="rounded-xl border border-dashed border-border p-10 text-center space-y-3 bg-card/50">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto text-primary">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold font-serif text-foreground">Archival Publications in Preparation</h3>
          <p className="text-sm font-serif text-muted-foreground max-w-md mx-auto">
            Our upcoming research chronicles and demographic briefs will appear here. Add Markdown files to <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">src/content/posts/</code> to publish.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground font-serif">
            Recent Publications &amp; Chronicles
          </h2>
          <p className="text-sm text-muted-foreground font-sans-ui mt-0.5">
            Archival explorations, biographical sketches, and socio-economic briefs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((article, i) => (
          <Link key={article.id} to={`/article/${article.slug || article.id}`} className="group block">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer h-full flex flex-col justify-between"
            >
              <div>
                <div className="overflow-hidden rounded-xl border border-border bg-card">
                  <img
                    src={article.cover}
                    alt={article.title}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="mt-3 space-y-1.5">
                  <span className="text-[11px] font-sans-ui font-semibold text-primary uppercase tracking-wide">
                    {article.category}
                  </span>
                  <h3 className="text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors font-serif line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 font-serif">
                    {article.excerpt}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-sans-ui text-muted-foreground pt-3 mt-2 border-t border-border/50">
                <span className="font-medium">{article.author}</span>
                <span>{article.date}</span>
              </div>
            </motion.article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ContentGrid;
