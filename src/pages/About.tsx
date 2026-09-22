import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const obfuscated = "krkyvq.rzvu@tznvy.pbz";
    const decoded = obfuscated.split("").map((char) => {
      const code = char.charCodeAt(0);
      if (char >= "a" && char <= "z") {
        return String.fromCharCode(((code - 97 + 13) % 26) + 97);
      }
      if (char >= "A" && char <= "Z") {
        return String.fromCharCode(((code - 65 + 13) % 26) + 65);
      }
      return char;
    }).join("");
    setEmail(decoded);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <section className="container max-w-3xl mx-auto py-12 px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="space-y-2">
              <h1 className="type-display font-bold text-foreground">About Deliberately Éire</h1>
              <p className="type-h4 font-normal text-muted-foreground">Ties older than either republic.</p>
            </div>

            <div className="max-w-none space-y-6 type-body text-foreground/90">
              <p className="type-body">
                Deliberately Éire is an independent publication dedicated to exploring the historical, constitutional, diplomatic, and cultural connections between Ireland and India. We produce research-driven analysis on immigration policy, comparative law, diaspora demographics, and the lived experience of cross-border communities.
              </p>

              <div className="space-y-4">
                <h2 className="type-h2 font-bold text-foreground">Our Focus</h2>
                <ul className="space-y-2 type-body">
                  <li>📋 <strong>Immigration & Citizenship Policy</strong> — comparative analysis of naturalisation timelines, visa routes, and legal frameworks across jurisdictions</li>
                  <li>📚 <strong>Constitutional & Legal Lineage</strong> — the historical roots of Irish and Indian law and governance</li>
                  <li>🤝 <strong>Diplomatic History</strong> — Ireland–India relations from independence onward</li>
                  <li>👥 <strong>Diaspora & Demographics</strong> — data-driven research on Irish and Indian communities abroad</li>
                  <li>🎭 <strong>Literature, Art & Thought</strong> — cultural and intellectual exchanges across the Irish and Indian traditions</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="type-h2 font-bold text-foreground">Our Approach</h2>
                <p>
                  We rely on official sources — government documents, census data, legal frameworks, and peer-reviewed research. Every article is written from verified data; we do not fabricate statistics or anecdotes. We are transparent about our sources and acknowledge uncertainty where policy is still evolving.
                </p>
                <p>
                  We are independent and editorially separate from any government, institution, or advocacy organisation. We publish work that serves readers who want to understand Ireland–India connections more deeply.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="type-h2 font-bold text-foreground">Contact</h2>
                <p>
                  Have a question, correction, or research idea? Reach out at{" "}
                  {email && (
                    <a href={`mailto:${email}`} className="text-primary hover:underline font-semibold">
                      {email}
                    </a>
                  )}
                </p>
              </div>

              <div className="border-t border-border pt-6 mt-8">
                <p className="type-caption text-muted-foreground">
                  © {new Date().getFullYear()} Deliberately Éire. Articles are published under a{" "}
                  <a href="https://creativecommons.org/licenses/by/4.0/" className="text-primary hover:underline">
                    Creative Commons Attribution 4.0 License
                  </a>
                  . We welcome thoughtful sharing and discussion.
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
