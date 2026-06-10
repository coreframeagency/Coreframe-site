import { SystemsHeader } from "./SystemsHeader";
import { SystemsIntro } from "./SystemsIntro";
import { ProcessTimeline } from "./ProcessTimeline";
import { TechStackGrid } from "./TechStackGrid";
import { SystemsTabs } from "./SystemsTabs";
import { ProblemFinder } from "./ProblemFinder";
import { SystemsClosing } from "./SystemsClosing";

export function SystemsPageContent() {
  return (
    <div className="systems-page">
      <div className="container">
        <SystemsHeader />
        <SystemsIntro />
        <ProcessTimeline />
        <TechStackGrid />
        <SystemsTabs />
      </div>
      <ProblemFinder />
      <SystemsClosing />
    </div>
  );
}
