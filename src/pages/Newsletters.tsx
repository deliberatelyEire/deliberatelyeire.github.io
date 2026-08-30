import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Users, Calendar, ScrollText, Landmark, Globe, Feather, CheckCircle2 } from "lucide-react";

const newsletters = [
  {
    name: "The Celtic-Vedic Dispatch",
    description: "Weekly archival analysis exploring comparative constitutional design (Bunreacht & Part IV), anti-imperial solidarity, and early diplomatic treaties.",
    frequency: "Every Monday",
    subscribers: "8,400+",
    icon: ScrollText,
  },
  {
    name: "The Diaspora Monitor",
    description: "Bi-weekly demographic intelligence tracking CSO census data, HSE medical staffing, third-level student mobility, and Silicon Docks tech employment.",
    frequency: "Every other Wednesday",
    subscribers: "12,200+",
    icon: Globe,
  },
  {
    name: "Diplomatic & Trade Chronicles",
    description: "Monthly strategic brief on Ireland–India bilateral policy, aviation leasing finance, pharma supply chains, and EU–India trade developments.",
    frequency: "First Thursday of the month",
    subscribers: "6,700+",
    icon: Landmark,
  },
  {
    name: "Literary & Cultural Echoes",
    description: "Bi-monthly essays on the cross-pollination of Celtic and Bengal Renaissances—Tagore, Yeats, Margaret Noble, and contemporary collaborative arts.",
    frequency: "Bi-monthly",
    subscribers: "5,300+",
    icon: Feather,
  },
];

const pastIssues = [
  { title: "B.N. Rau's Dublin Diary: Notes from the 1947 Meeting with de Valera", newsletter: "The Celtic-Vedic Dispatch", date: "Feb 24, 2026" },
  { title: "CSO Census 2022 Deep-Dive: Indian Healthcare Workers in Regional Irish Hospitals", newsletter: "The Diaspora Monitor", date: "Feb 18, 2026" },
  { title: "Aircraft Leasing in 2026: Why 450+ New Commercial Jets in India Are Financed from Dublin", newsletter: "Diplomatic & Trade Chronicles", date: "Feb 12, 2026" },
  { title: "The Abbey Theatre's 1913 Staging of Tagore's 'The Post Office'", newsletter: "Literary & Cultural Echoes", date: "Feb 6, 2026" },
  { title: "From Brixton to Lahore: How Terence MacSwiney's 1920 Strike Reverberated in India", newsletter: "The Celtic-Vedic Dispatch", date: "Jan 29, 2026" },
  { title: "Stamp 1G Graduate Visa Trends: Retention Rates of Non-EU STEM Graduates in Ireland", newsletter: "The Diaspora Monitor", date: "Jan 21, 2026" },
];

const Newsletters = () => {
  const [subscribedNl, setSubscribedNl] = useState<string | null>(null);

  const handleSubscribe = (name: string) => {
    setSubscribedNl(name);
    setTimeout(() => setSubscribedNl(null), 3500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl text-center space-y-3">
              <div className="flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground/20 border border-primary-foreground/30">
                  <Mail className="h-7 w-7" />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold font-serif">Curated Research Dispatches</h1>
              <p className="mt-3 text-primary-foreground/85 text-base md:text-lg font-serif">
                Deliberately Éire publications delivered directly to your inbox. Select the research streams most relevant to your interests.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {newsletters.map((nl, i) => {
              const Icon = nl.icon;
              const isSubscribed = subscribedNl === nl.name;
              return (
                <motion.div
                  key={nl.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-border bg-card p-6 space-y-4 flex flex-col justify-between shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg md:text-xl font-bold text-foreground font-serif">{nl.name}</h2>
                        <p className="mt-1 text-xs md:text-sm text-muted-foreground font-serif leading-relaxed">{nl.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-sans-ui text-muted-foreground pt-1 border-t border-border/50">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{nl.frequency}</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{nl.subscribers} subscribers</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleSubscribe(nl.name)}
                    className={`w-full rounded-md px-4 py-2.5 text-sm font-semibold font-sans-ui transition-all ${
                      isSubscribed
                        ? "bg-primary/20 text-primary border border-primary/30 flex items-center justify-center gap-1.5"
                        : "bg-primary text-primary-foreground hover:scale-[1.01] active:scale-95 shadow-sm"
                    }`}
                  >
                    {isSubscribed ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" /> Subscribed!
                      </>
                    ) : (
                      `Subscribe to ${nl.name.split(" ")[0]}`
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="container pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground font-serif">Archived Issues &amp; Deep Dives</h2>
            <span className="text-xs font-sans-ui text-muted-foreground">Updated Weekly</span>
          </div>
          <div className="divide-y divide-border rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            {pastIssues.map((issue, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-secondary/40 transition-colors"
              >
                <div>
                  <p className="text-sm md:text-base font-semibold text-foreground font-serif hover:text-primary transition-colors cursor-pointer">
                    {issue.title}
                  </p>
                  <p className="text-xs text-muted-foreground font-sans-ui mt-0.5">{issue.newsletter}</p>
                </div>
                <span className="text-xs font-sans-ui text-muted-foreground shrink-0">{issue.date}</span>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Newsletters;
