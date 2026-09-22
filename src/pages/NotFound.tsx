import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Header />
      <div className="container py-20 text-center space-y-4">
        <span className="type-label text-saffron font-bold">
          404 Error · Page Not Found
        </span>
        <h1 className="type-display font-bold text-foreground">
          Document or Chronicle Missing
        </h1>
        <p className="type-body text-muted-foreground max-w-md mx-auto">
          The requested page or research document could not be located. It may have been archived or moved.
        </p>
        <div className="pt-4">
          <Link to="/" className="inline-block rounded-md bg-primary px-6 py-2.5 type-ui font-semibold text-primary-foreground shadow-sm hover:scale-105 active:scale-95 transition-transform">
            Return to Homepage
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
