import type { Metadata } from "next";
import { AdaptersSection } from "@/components/home/adapters-section";
import { CtaSection } from "@/components/home/cta-section";
import { FeaturesBento } from "@/components/home/features-bento";
import { HeroSection } from "@/components/home/hero-section";
import { PrimitivesSection } from "@/components/home/primitives-section";
import { StatsSection } from "@/components/home/stats-section";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";

export const metadata: Metadata = {
  title: "Shelf UI — File UI Components for React",
  description:
    "Copy-paste file UI components for React. Upload, preview, manage, navigate — with first-class Supabase, S3, and Cloudinary support.",
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesBento />
        <AdaptersSection />
        <PrimitivesSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
