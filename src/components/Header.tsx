import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "./ModeToggle";
import logoImg from "@/assets/logo.png";

// Newsletters, Resources and Podcasts are hidden until they hold real content.
// Their pages and routes are intact; restore the entries below to bring them back.
const navItems = [
  { label: "Articles", href: "/blog" },
  // { label: "Newsletters", href: "/newsletters" },
  // { label: "Resources & Data", href: "/resources" },
  // { label: "Podcasts", href: "/podcasts" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      {/* Tricolour Accent Bar (Saffron - Paper - Irish Green) */}
      <div className="tricolour-bar w-full" />
      
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-full overflow-hidden border border-border/80 shrink-0 bg-background shadow-sm">
              <img src={logoImg} alt="Deliberately Éire Diya Mark" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="type-h4 !leading-none font-bold text-foreground">
                Deliberately <span className="text-primary font-bold">Éire</span>
              </span>
              <span className="type-label font-semibold text-muted-foreground">
                Evidence Over Noise
              </span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`type-ui font-medium transition-colors ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Search"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </button>
          <ModeToggle />
          <a
            href="#newsletter"
            className="hidden sm:inline-flex items-center rounded-md bg-primary px-3.5 py-1.5 type-ui font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-105 active:scale-95"
          >
            Subscribe
          </a>
          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-secondary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border md:hidden bg-card"
          >
            <nav className="container flex flex-col gap-3 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="type-ui font-medium text-foreground hover:text-primary py-1"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href="#newsletter"
                onClick={() => setMobileOpen(false)}
                className="mt-2 text-center rounded-md bg-primary px-4 py-2 type-ui font-semibold text-primary-foreground"
              >
                Subscribe to Dispatch
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
