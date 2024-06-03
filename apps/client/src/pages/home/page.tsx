import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Helmet } from "react-helmet-async";

import { FeaturesSection } from "./sections/features";
import { HeroSection } from "./sections/hero";
import { StatisticsSection } from "./sections/statistics";
import { SupportSection } from "./sections/support";
import { TemplatesSection } from "./sections/templates";
import { TestimonialsSection } from "./sections/testimonials";

export const HomePage = () => {
  const { i18n } = useLingui();

  return (
    <main className="relative isolate bg-background">
      <Helmet prioritizeSeoTags>
        <html lang={i18n.locale} />

        <title>
          {t`Reactive Resume`} - {t`Resume builder for new professionals`}
        </title>

        <meta
          name="description"
          content="A resume generator that supports ai agents, a large number of templates to choose from."
        />
      </Helmet>

      <HeroSection />
      {/* <LogoCloudSection /> */}
      <StatisticsSection />
      <FeaturesSection />
      <TemplatesSection />
      <TestimonialsSection />
      <SupportSection />
      {/* <FAQSection /> */}
      {/* <ContributorsSection /> */}
    </main>
  );
};
