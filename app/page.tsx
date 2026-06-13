import Hero from "@/components/Hero";
import SkillsLazy from "@/components/SkillsLazy";
import WorkLazy from "@/components/WorkLazy";
import ReviewsSection from "@/components/ReviewsSection";
import FooterLazy from "@/components/FooterLazy";

export default function Home() {
  return (
    <main>
      <Hero />
      <SkillsLazy />
      <WorkLazy />
      <ReviewsSection />
      <FooterLazy />
    </main>
  );
}
