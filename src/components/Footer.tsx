import { Link } from "react-router-dom";
import logoImg from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/60">
      <div className="container py-12">
        {/* Bilingual Mottos Band */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-border">
          <div className="space-y-1">
            <p className="type-deva font-bold text-foreground">
              सर्वे भवन्तु सुखिनः
            </p>
            <p className="type-meta italic text-muted-foreground">
              "May all beings be happy, healthy, and free from harm"
            </p>
          </div>
          <div className="space-y-1 md:text-right">
            <p className="type-h4 font-bold italic text-primary">
              Is ar scáth a chéile a mhaireann na daoine
            </p>
            <p className="type-meta italic text-muted-foreground">
              "Under each other's shelter, the people flourish"
            </p>
          </div>
        </div>

        {/* Main Footer Row */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full overflow-hidden border border-border shrink-0">
              <img src={logoImg} alt="Deliberately Éire Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <span className="type-title font-bold text-foreground">
                Deliberately <span className="text-primary">Éire</span>
              </span>
              <span className="type-meta block text-muted-foreground">
                @delibratelyEire · Ties older than either republic
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 type-ui text-muted-foreground">
            <Link to="/blog" className="hover:text-primary transition-colors">Articles</Link>
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
            {/* Hidden until they hold real content; pages and routes are intact.
            <Link to="/newsletters" className="hover:text-primary transition-colors">Newsletters</Link>
            <Link to="/resources" className="hover:text-primary transition-colors">Resources &amp; Data</Link>
            <Link to="/podcasts" className="hover:text-primary transition-colors">Podcasts</Link> */}
            <a href="https://x.com/delibratelyEire" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">X (@delibratelyEire)</a>
          </div>

          <p className="type-meta text-muted-foreground">
            © {new Date().getFullYear()} Deliberately Éire. Independent &amp; Open Research.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
