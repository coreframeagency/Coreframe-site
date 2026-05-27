import type { Project } from "./projects";

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
}

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  return (
    <article className="work-project-card">
      <div className="work-project-card__meta">
        <span className="work-project-card__tag">{project.tag}</span>
        <span className="work-project-card__year">{project.year}</span>
      </div>

      <h2 className="work-project-card__name">{project.name}</h2>

      {project.url ? (
        <p className="work-project-card__url">{project.url}</p>
      ) : null}

      <p className="work-project-card__headline">{project.headline}</p>

      <button
        type="button"
        className="work-project-card__details"
        onClick={() => onViewDetails(project)}
      >
        View details
      </button>
    </article>
  );
}
