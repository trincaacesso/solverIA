import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { WhatWeDo } from "@/components/sections/what-we-do";
import { HowWeHelp } from "@/components/sections/how-we-help";
import { Services } from "@/components/sections/services";
import { CompleteSolution } from "@/components/sections/complete-solution";
import { Industries } from "@/components/sections/industries";
import { WhySolverIA } from "@/components/sections/why-solveria";
import { Numbers } from "@/components/sections/numbers";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";
import { FinalCTA } from "@/components/sections/final-cta";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SolverIA",
  slogan: "We save time and increase sales using Artificial Intelligence.",
  description:
    "SolverIA builds AI WhatsApp agents, dashboards and automations that help companies sell more.",
  url: "https://solveria.com",
  sameAs: [
    "https://www.linkedin.com/company/solveria",
    "https://www.instagram.com/solveria",
  ],
};

export default function SolverIALanding() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <WhatWeDo />
        <HowWeHelp />
        <Services />
        <CompleteSolution />
        <Industries />
        <WhySolverIA />
        <Numbers />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
