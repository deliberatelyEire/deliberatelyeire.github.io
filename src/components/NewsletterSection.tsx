import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, ShieldCheck } from "lucide-react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section id="newsletter" className="bg-primary text-primary-foreground">
      <div className="container py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center space-y-4"
        >
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/15 border border-primary-foreground/25">
              <Mail className="h-6 w-6" />
            </div>
          </div>
          <span className="text-xs uppercase tracking-widest font-sans-ui font-semibold text-primary-foreground/90 bg-primary-foreground/10 px-3 py-1 rounded-full inline-block">
            Deliberately Éire Dispatch
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-serif">
            Ties older than either republic.
          </h2>
          <p className="text-primary-foreground/85 text-base font-serif max-w-xl mx-auto">
            Join historians, diplomats, researchers, and diaspora leaders receiving curated archival findings, CSO data analysis, and legal comparative studies.
          </p>

          {!submitted ? (
            <div className="mt-8">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="rounded-md border-2 border-primary-foreground/30 bg-primary-foreground/10 px-4 py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/60 focus:border-primary-foreground/80 focus:outline-none flex-1 font-sans-ui"
                />
                <button
                  type="submit"
                  className="rounded-md bg-primary-foreground px-6 py-3 text-sm font-semibold text-primary font-sans-ui transition-transform hover:scale-105 active:scale-95 shadow-md shrink-0"
                >
                  Join Dispatch
                </button>
              </form>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-primary-foreground/75 font-sans-ui">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>No spam. Sourced archival dispatches only. Unsubscribe anytime.</span>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 flex items-center justify-center gap-2 text-lg font-medium bg-primary-foreground/10 p-4 rounded-xl border border-primary-foreground/20"
            >
              <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
              <span>Go raibh maith agat! You're subscribed to the Deliberately Éire Dispatch.</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
