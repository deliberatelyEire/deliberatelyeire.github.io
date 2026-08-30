import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllPosts } from "@/lib/posts";

const ContentGrid = () => {
  const posts = getAllPosts().slice(1, 5); // Show latest publications after featured

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
