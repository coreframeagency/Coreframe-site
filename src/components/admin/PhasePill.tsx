import type { ProjectPhase } from "@prisma/client";

const PHASE_CLASS: Record<ProjectPhase, string> = {
  MAP: "admin-phase-pill--map",
  DESIGN: "admin-phase-pill--design",
  BUILD: "admin-phase-pill--build",
  OPERATE: "admin-phase-pill--operate",
};

export function PhasePill({ phase }: { phase: ProjectPhase | string }) {
  const key = phase as ProjectPhase;
  return <span className={`admin-phase-pill ${PHASE_CLASS[key] ?? ""}`}>{phase}</span>;
}
