import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Headphones, Play, Pause, Clock, Mic } from "lucide-react";
import delibratelyImg from "@/assets/DelibratelyEire.jpg";
import lampImg from "@/assets/lamp.jpg";
import tiesImg from "@/assets/ireland-india-ties.jpg";
import article1 from "@/assets/article-1.jpg";
import article2 from "@/assets/article-2.jpg";
import article3 from "@/assets/article-3.jpg";

const episodes = [
  {
    id: 1,
    title: "The 1947 Dublin Meetings: Sir B.N. Rau, de Valera, and Part IV of the Indian Constitution",
    guest: "Prof. Dermot Keogh & Dr. Niraja Gopal Jayal",
    duration: "48 min",
    date: "Feb 24, 2026",
    description: "An in-depth historical exploration into the declassified telegrams and notes of B.N. Rau's December 1947 mission to Dublin to consult with Irish drafters.",
    image: tiesImg,
  },
  {
    id: 2,
    title: "Healthcare Pioneers: The Oral History of Indian Doctors in Rural Ireland",
    guest: "Dr. Ramesh Nair (Irish Medical Organisation) & Dr. Sheila O'Connor",
    duration: "41 min",
    date: "Feb 17, 2026",
    description: "Personal accounts from physicians who moved from Kerala, Punjab, and Maharashtra to serve in Irish county hospitals in Mayo, Donegal, and Kerry.",
    image: article1,
  },
  {
    id: 3,
    title: "Renaissances in Dialogue: Tagore, Yeats, and the 1913 Abbey Theatre Staging",
    guest: "Prof. Declan Kiberd & Dr. Sukanta Chaudhuri",
    duration: "54 min",
    date: "Feb 10, 2026",
    description: "Tracing the literary currents between Dublin and Calcutta: how the Irish Celtic Revival and Bengal Renaissance shared symbols of anti-colonial yearning.",
    image: lampImg,
  },
  {
    id: 4,
    title: "Sister Nivedita's Journey: From Dungannon Schoolteacher to National Icon in Bengal",
    guest: "Dr. Liz Curtis & Reba Som (Biographers of Margaret Noble)",
    duration: "46 min",
    date: "Feb 3, 2026",
    description: "How Margaret Elizabeth Noble's upbringing in Northern Ireland shaped her fiery anti-imperial advocacy, plague relief work, and girls' education in Calcutta.",
    image: article2,
  },
  {
    id: 5,
    title: "Aircraft Leasing & Silicon Docks: Ireland–India's Modern Economic Spine",
    guest: "Sean Flannery (Aviation Finance Ireland) & Priya Venkatesh (IDA)",
    duration: "39 min",
    date: "Jan 27, 2026",
    description: "Unpacking the €5.8B economic corridor: why Indian airlines finance their fleets through Dublin and how Indian engineering talent powers Irish tech.",
    image: article3,
  },
  {
    id: 6,
    title: "Two Tricolours, Two Republics: Vexillology, Sacrifice, and Communal Peace",
    guest: "Dr. Matthew Kelly & Prof. Sugata Bose",
    duration: "52 min",
    date: "Jan 20, 2026",
    description: "Comparing the philosophical and revolutionary origins of the Irish and Indian flags, the symbolism of the white band, and shared republican aspirations.",
    image: delibratelyImg,
  },
];

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
              <span className="text-xs uppercase tracking-wider font-sans-ui font-bold text-primary">
                Audio Archive &amp; Scholarly Interviews
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground font-serif">
                The Delibrately Éire Conversations
              </h1>
              <p className="mt-1 text-muted-foreground font-serif text-sm md:text-base">
                In-depth dialogues with historians, diplomats, legal scholars, and diaspora leaders examining Ireland–India connections.
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
                      <div className="flex flex-wrap items-center gap-3 text-xs font-sans-ui text-muted-foreground">
                        <span className="font-bold text-primary">Episode {ep.id}</span>
                        <span>·</span>
                        <span>{ep.date}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{ep.duration}</span>
                      </div>
                      <h2 className="text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors font-serif leading-snug">
                        {ep.title}
                      </h2>
                      <p className="text-xs font-semibold font-sans-ui text-primary/90 flex items-center gap-1">
                        <Mic className="h-3.5 w-3.5" /> Featuring: {ep.guest}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 font-serif leading-relaxed">
                        {ep.description}
                      </p>
                    </div>

                    {isPlaying && (
                      <div className="pt-2 flex items-center gap-2 text-xs font-sans-ui text-primary font-semibold animate-pulse">
                        <span>▶ Audio stream playing · Delibrately Éire Audio Player</span>
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
