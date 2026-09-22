import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSection from "@/components/NewsletterSection";
import { FileText, Download, BookOpen, BarChart3, Scale, GraduationCap, CheckCircle2 } from "lucide-react";

const resources = [
  {
    title: "Constitutional Concordance: Bunreacht na hÉireann & Part IV",
    type: "Legal Treatise",
    description: "Side-by-side comparative legal analysis of Article 45 (Directive Principles of Social Policy) and India's Articles 36–51, including Constituent Assembly debate transcripts.",
    downloads: "2,450+",
    icon: Scale,
  },
  {
    title: "Timeline of Ireland–India Relations (1857–2026)",
    type: "Chronicle Pack",
    description: "Chronological reference of diplomatic, literary, and political milestones from the 1857 revolt and 1913 Dublin Lockout to 2026 bilateral agreements.",
    downloads: "4,300+",
    icon: BookOpen,
  },
  {
    title: "CSO Demographic & Healthcare Workforce Report",
    type: "Statistical Brief",
    description: "Compiled CSO Census data, Medical Council registrations, and NMBI statistics detailing the Indian diaspora's footprint across Irish counties and hospitals.",
    downloads: "3,800+",
    icon: BarChart3,
  },
  {
    title: "Third-Level Graduate Scheme (Stamp 1G) Policy Guide",
    type: "Policy Brief",
    description: "Comprehensive guide for non-EU students navigating postgraduate degrees, 24-month graduate work permissions, and Critical Skills Employment Permits in Ireland.",
    downloads: "6,200+",
    icon: GraduationCap,
  },
  {
    title: "Bilateral Trade & Aviation Finance Data Pack (2020–2026)",
    type: "Trade Brief",
    description: "Key metrics on Ireland–India trade in pharmaceuticals, tech services, and Dublin-managed aircraft leasing portfolios serving Indian airlines.",
    downloads: "1,950+",
    icon: FileText,
  },
  {
    title: "Vexillology & Republican Symbols Guide",
    type: "Visual Guide",
    description: "High-resolution graphic assets, historical notes on flag evolution, and comparative heraldry of the Irish and Indian tricolours.",
    downloads: "3,100+",
    icon: BookOpen,
  },
];

const Resources = () => {
  const [downloadedItem, setDownloadedItem] = useState<string | null>(null);

  const handleDownload = (title: string) => {
    setDownloadedItem(title);
    setTimeout(() => setDownloadedItem(null), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="container py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <span className="type-label font-bold text-primary">
              Open Research &amp; Archival Tools
            </span>
            <h1 className="type-display font-bold text-foreground">
              Resources &amp; Data Packs
            </h1>
            <p className="mt-2 type-body text-muted-foreground max-w-2xl">
              Freely available datasets, constitutional concordances, policy briefs, and historical chronicles compiled by Deliberately Éire.
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, i) => {
              const Icon = resource.icon;
              const isDownloaded = downloadedItem === resource.title;
              return (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="rounded-xl border border-border bg-card p-6 space-y-4 flex flex-col justify-between shadow-sm hover:border-primary/40 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="type-meta font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        {resource.type}
                      </span>
                    </div>
                    <h2 className="type-h4 font-bold text-foreground">{resource.title}</h2>
                    <p className="type-caption text-muted-foreground">{resource.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <span className="type-meta text-muted-foreground flex items-center gap-1">
                      <Download className="h-3.5 w-3.5" />{resource.downloads} downloads
                    </span>
                    <button
                      onClick={() => handleDownload(resource.title)}
                      className={`rounded-md px-3.5 py-1.5 type-meta font-semibold transition-all ${
                        isDownloaded
                          ? "bg-primary/20 text-primary border border-primary/30 flex items-center gap-1"
                          : "bg-primary text-primary-foreground hover:scale-105 active:scale-95 shadow-sm"
                      }`}
                    >
                      {isDownloaded ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Downloading
                        </>
                      ) : (
                        "Access PDF"
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
