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

      {project.status === "in-development" ? (
        <p
          style={{
            margin: "0 0 8px",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: "10px",
            color: "#555",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          In Development
        </p>
      ) : null}

      <h2 className="work-project-card__name">{project.name}</h2>

      {project.url && project.status !== "in-development" ? (
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
