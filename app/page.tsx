import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Work from "@/components/Work";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Skills />
      <Work />
      <ReviewsSection />
      <Footer />
    </main>
  );
}
