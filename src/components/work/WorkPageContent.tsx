"use client";

import { useCallback, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { WorkHeader } from "./WorkHeader";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import { PROJECTS, PROJECT_REVEAL_DELAYS } from "./projects";
import type { Project } from "./projects";

export function WorkPageContent() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleViewDetails = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
  }, []);

  return (
    <div className="work-page bg-[var(--cf-canvas)]">
      <div className="container">
        <WorkHeader />

        <div className="work-page-grid">
          {PROJECTS.map((project, index) => (
            <Reveal key={project.id} delay={PROJECT_REVEAL_DELAYS[index]}>
              <ProjectCard project={project} onViewDetails={handleViewDetails} />
            </Reveal>
          ))}
        </div>
      </div>

      <ProjectModal project={selectedProject} onClose={handleCloseModal} />
    </div>
  );
}
