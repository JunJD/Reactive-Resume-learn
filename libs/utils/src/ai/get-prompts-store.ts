// import { awardsSummaryBuild } from "./builds/awards-summary-build";
// import { certificationsSummaryBuild } from "./builds/certifications-summary-build";
// import { experienceSummaryBuild } from "./builds/experience-summary-build";
// import { projectDescriptionBuild } from "./builds/projects-description-build";
// import { projectSummaryBuild } from "./builds/projects-summary-build";
import { summaryContentBuild } from "./builds/summary-content-build";

export const getPromptsStore = (origin: string) => {
  return [
    // awardsSummaryBuild,
    // certificationsSummaryBuild,
    // experienceSummaryBuild,
    // projectDescriptionBuild,
    // projectSummaryBuild,
    summaryContentBuild,
  ].map((promptComponent) => {
    return promptComponent(origin);
  });
};
