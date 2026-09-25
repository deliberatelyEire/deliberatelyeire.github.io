import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Headphones, Play, Pause, Clock, Mic } from "lucide-react";

const episodes: {
  id: number;
  title: string;
  guest: string;
  duration: string;
  date: string;
  description: string;
  image: string;
}[] = [];

const Podcasts = () => {
  const [playingId, setPlayingId] = useState<number | null>(null);

  const togglePlay = (id: number) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="container py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shrink-0">
              <Headphones className="h-7 w-7 text-primary" />
            </div>
            <div>
              <span className="type-label font-bold text-primary">
                Audio Archive &amp; Scholarly Interviews
              </span>
              <h1 className="type-display font-bold text-foreground">
                The Deliberately Éire Conversations
              </h1>
              <p className="mt-1 type-body text-muted-foreground">
                In-depth dialogues with historians, diplomats, legal scholars, and diaspora leaders on Irish law, policy, and history.
              </p>
            </div>
          </motion.div>

          <div className="mt-10 space-y-4">
            {episodes.map((ep, i) => {
              const isPlaying = playingId === ep.id;
              return (
                <motion.div
                  key={ep.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -2 }}
                  onClick={() => togglePlay(ep.id)}
                  className={`flex flex-col sm:flex-row gap-5 rounded-xl border p-5 group cursor-pointer transition-all shadow-sm ${
                    isPlaying
                      ? "border-primary/60 bg-primary/5 shadow-md"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className="relative shrink-0 w-full sm:w-36 h-36 sm:h-36 rounded-lg overflow-hidden border border-border/60">
                    <img src={ep.image} alt={ep.title} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 bg-foreground/40 flex items-center justify-center transition-opacity ${isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                      {isPlaying ? (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Pause className="h-5 w-5" />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                          <Play className="h-5 w-5 fill-current ml-0.5" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-2 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-3 type-meta text-muted-foreground">
                        <span className="font-bold text-primary">Episode {ep.id}</span>
                        <span>·</span>
                        <span>{ep.date}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{ep.duration}</span>
                      </div>
                      <h2 className="type-title font-bold text-foreground group-hover:text-primary transition-colors">
                        {ep.title}
                      </h2>
                      <p className="type-meta font-semibold text-primary/90 flex items-center gap-1">
                        <Mic className="h-3.5 w-3.5" /> Featuring: {ep.guest}
                      </p>
                      <p className="type-caption text-muted-foreground line-clamp-2">
                        {ep.description}
                      </p>
                    </div>

                    {isPlaying && (
                      <div className="pt-2 flex items-center gap-2 type-meta text-primary font-semibold animate-pulse">
                        <span>▶ Audio stream playing · Deliberately Éire Audio Player</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Podcasts;
