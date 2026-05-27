import { SystemsHeader } from "./SystemsHeader";
import { SystemsIntro } from "./SystemsIntro";
import { SystemsTabs } from "./SystemsTabs";
import { ProblemFinder } from "./ProblemFinder";
import { SystemsClosing } from "./SystemsClosing";

export function SystemsPageContent() {
  return (
    <div className="systems-page bg-[var(--cf-canvas)]">
      <div className="container">
        <SystemsHeader />
        <SystemsIntro />
        <SystemsTabs />
      </div>
      <ProblemFinder />
      <SystemsClosing />
    </div>
  );
}
