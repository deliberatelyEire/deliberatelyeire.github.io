import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { topicClusters } from "@/data/articles";
import { Scale, Landmark, Feather, Globe2 } from "lucide-react";

const icons = [Scale, Landmark, Feather, Globe2];

const TopicClusters = () => {
  return (
    <section className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="type-h3 font-bold text-foreground">
            Thematic Focus Areas
          </h2>
          <p className="type-ui text-muted-foreground mt-0.5">
            Explore research across four primary pillars of Ireland–India connection
          </p>
        </div>
        <Link to="/blog" className="type-meta font-semibold text-primary hover:underline">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topicClusters.map((topic, i) => {
          const Icon = icons[i % icons.length];
          return (
            <motion.div
              key={topic.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Link
                to={`/blog?category=${encodeURIComponent(topic.name)}`}
                className="flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-5 text-left transition-all hover:border-primary/50 hover:shadow-md h-full group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="type-caption font-bold text-foreground group-hover:text-primary transition-colors">
                    {topic.name}
                  </h3>
                  <span className="type-meta text-muted-foreground mt-1 block">
                    {topic.count} documents &amp; essays
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default TopicClusters;
