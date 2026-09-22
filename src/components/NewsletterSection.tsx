import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, ShieldCheck, Loader2, AlertCircle } from "lucide-react";

// Web3Forms access key. Loaded from VITE_WEB3FORMS_ACCESS_KEY env var.
// This is a PUBLISHABLE key by design: it ships in the client bundle and
// only allows a submission to reach the registered inbox. It is safe to
// publish but should not be committed to git.
//
// Setup: copy .env.example to .env.local and paste your access key.
// Get a key at https://web3forms.com (free, takes ~1 minute).
// While empty, the form reports "not configured yet" instead of faking success.
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "";

type Status = "idle" | "submitting" | "success" | "error";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  // Honeypot: real people never see this field, bots fill it in.
  const [botField, setBotField] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "submitting") return;

    // Silently swallow bot submissions without hitting the API.
    if (botField) {
      setStatus("success");
      return;
    }

    if (!WEB3FORMS_ACCESS_KEY) {
      setErrorMessage("Sign-up is not configured yet. Please check back shortly.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "New Dispatch sign-up",
          from_name: "Deliberately Éire",
          email,
        }),
      });
      // Web3Forms can return a 200 with { success: false }, so check both.
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        setStatus("success");
      } else {
        setErrorMessage(data?.message || "That did not go through. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMessage("Could not reach the server. Please check your connection and try again.");
      setStatus("error");
    }
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
          <span className="type-label font-semibold text-primary-foreground/90 bg-primary-foreground/10 px-3 py-1 rounded-full inline-block">
            Deliberately Éire Dispatch
          </span>
          <h2 className="type-h1 font-bold">
            Ties older than either republic.
          </h2>
          <p className="type-body text-primary-foreground/85 max-w-xl mx-auto">
            Leave your address to hear when new archival findings, CSO data analysis, and legal comparative studies are published.
          </p>

          {status !== "success" ? (
            <div className="mt-8">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={status === "submitting"}
                  className="rounded-md border-2 border-primary-foreground/30 bg-primary-foreground/10 px-4 py-3 type-ui text-primary-foreground placeholder:text-primary-foreground/60 focus:border-primary-foreground/80 focus:outline-none flex-1 disabled:opacity-60"
                />
                {/* Honeypot; hidden from people and from screen readers. */}
                <input
                  type="text"
                  name="botcheck"
                  value={botField}
                  onChange={(e) => setBotField(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-foreground px-6 py-3 type-ui font-semibold text-primary transition-transform hover:scale-105 active:scale-95 shadow-md shrink-0 disabled:opacity-70 disabled:hover:scale-100"
                >
                  {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
                  {status === "submitting" ? "Sending" : "Join Dispatch"}
                </button>
              </form>

              {status === "error" && (
                <div role="alert" className="mt-3 flex items-center justify-center gap-1.5 type-meta text-primary-foreground bg-primary-foreground/15 border border-primary-foreground/25 rounded-md py-2 px-3 max-w-md mx-auto">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="mt-3 flex items-center justify-center gap-1.5 type-meta text-primary-foreground/75">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Your address is used only to send these dispatches. Ask anytime and it is removed.</span>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 flex items-center justify-center gap-2 type-h4 font-medium bg-primary-foreground/10 p-4 rounded-xl border border-primary-foreground/20"
            >
              <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
              <span>Go raibh maith agat! Your address is noted, and the next dispatch will reach you.</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
