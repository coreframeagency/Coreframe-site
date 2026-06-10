"use client";

import { useCallback, useState } from "react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { MagneticCard } from "@/components/ui/MagneticCard";
import { WorkReel } from "@/components/ui/WorkReel";
import { WorkHeader } from "./WorkHeader";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import { PROJECTS } from "./projects";
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
    <div className="work-page">
      <div className="container">
        <WorkHeader />

        <WorkReel>
          {PROJECTS.map((project) => (
            <RevealOnScroll key={project.id} className="work-reel__card-wrap">
              <MagneticCard>
                <ProjectCard project={project} onViewDetails={handleViewDetails} />
              </MagneticCard>
            </RevealOnScroll>
          ))}
        </WorkReel>
      </div>

      <ProjectModal project={selectedProject} onClose={handleCloseModal} />
    </div>
  );
}
