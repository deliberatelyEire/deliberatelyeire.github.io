import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
// Hidden until there are enough posts to fill the thematic pillars.
// import TopicClusters from "@/components/TopicClusters";
import ContentGrid from "@/components/ContentGrid";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import { SchemaOrg } from "@/components/SchemaOrg";

const Index = () => {
  const baseUrl = "https://deliberatelyeire.github.io";
  const homepageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}/#webpage`,
    "url": baseUrl,
    "name": "Deliberately Éire — Irish Citizenship, Immigration & Policy Research",
    "description": "Deliberately Éire: independent, evidence-led research on Irish citizenship, immigration policy, and law.",
    "isPartOf": { "@id": `${baseUrl}/#website` },
    "about": { "@id": `${baseUrl}/#organization` },
    "inLanguage": "en-IE",
    "datePublished": "2026-01-01",
  };

  return (
    <div className="min-h-screen bg-background">
      <SchemaOrg schemas={homepageSchema} />
      <Header />
      <main>
        <HeroSection />
        {/* <TopicClusters /> */}
        <ContentGrid />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
