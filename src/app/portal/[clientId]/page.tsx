import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Wordmark } from "@/components/brand/Wordmark";
import { PhasePill } from "@/components/admin/PhasePill";
import { StatusPill } from "@/components/admin/StatusPill";
import { formatCurrency, formatDate } from "@/lib/admin-types";
import { prisma } from "@/lib/prisma";
import "../../admin/admin.css";

type PageProps = { params: Promise<{ clientId: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { clientId } = await params;
  const client = await prisma.client.findUnique({ where: { id: clientId } });

  if (!client) {
    return { title: "Client Portal" };
  }

  return {
    title: `${client.name} — Portal`,
    description: `Project portal for ${client.company}`,
    openGraph: {
      title: `${client.name} — COREFRAME Portal`,
      description: `Projects and documents for ${client.company}`,
      images: ["/og-image.png"],
    },
  };
}

const PHASES = ["MAP", "DESIGN", "BUILD", "OPERATE"] as const;

export default async function ClientPortalPage({ params }: PageProps) {
  const { clientId } = await params;

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      projects: {
        orderBy: { createdAt: "desc" },
        include: {
          sprintLogs: { orderBy: { date: "desc" }, take: 5 },
        },
      },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!client) notFound();

  return (
    <div className="doc-page">
      <div className="doc-page__inner">
        <div className="doc-header">
          <Wordmark />
          <div className="doc-header__meta">
            <div className="doc-header__type">
              Client Portal <span className="doc-header__dot" /> {client.company}
            </div>
            <div>Updated {formatDate(new Date())}</div>
          </div>
        </div>

        <div className="doc-hairline" />

        <div className="doc-parties">
          <div>
            <p className="doc-party__label">Your team</p>
            <p className="doc-party__name">{client.name}</p>
            <p className="doc-party__detail">{client.company}</p>
            <p className="doc-party__detail">{client.email}</p>
            <p className="doc-party__detail">{client.address}</p>
            <p className="doc-party__detail">{client.country}</p>
          </div>
          <div className="doc-parties__divider" aria-hidden="true" />
          <div>
            <p className="doc-party__label">Contact COREFRAME</p>
            <p className="doc-party__name">COREFRAME</p>
            <p className="doc-party__detail">coreframeagency@gmail.com</p>
            <p className="doc-party__detail">Colombo, Sri Lanka</p>
            <p className="doc-party__detail">Response within 24 hours</p>
          </div>
        </div>

        <div className="doc-hairline" />

        <p className="doc-party__label">Active projects</p>
        {client.projects.length ? (
          client.projects.map((project) => {
            const phaseIndex = PHASES.indexOf(project.phase);
            return (
              <div key={project.id} style={{ marginBottom: 32 }}>
                <div className="doc-project-row">
                  <div>
                    <p className="doc-project-row__label">Project</p>
                    <p className="doc-project-row__value">{project.name}</p>
                  </div>
                  <PhasePill phase={project.phase} />
                </div>

                <div className="admin-phase-tracker admin-phase-tracker--readonly" style={{ margin: "16px 0" }}>
                  {PHASES.map((phase, index) => (
                    <div
                      key={phase}
                      className={`admin-phase-tracker__step ${index === phaseIndex ? "is-active" : ""} ${index < phaseIndex ? "is-complete" : ""}`}
                    >
                      {phase}
                    </div>
                  ))}
                </div>

                {project.sprintLogs.length ? (
                  <>
                    <p className="doc-party__label">Recent updates</p>
                    <div className="admin-sprint-feed">
                      {project.sprintLogs.map((log) => (
                        <article key={log.id} className="admin-sprint-item">
                          <h3 className="admin-sprint-item__title">{log.title}</h3>
                          <p className="admin-sprint-item__date">{formatDate(log.date)}</p>
                          <p className="admin-sprint-item__body">{log.description}</p>
                        </article>
                      ))}
                    </div>
                  </>
                ) : null}
                <div className="doc-hairline" />
              </div>
            );
          })
        ) : (
          <p className="doc-notes">No active projects yet.</p>
        )}

        <p className="doc-party__label">Documents</p>
        {client.documents.length ? (
          <table className="doc-table">
            <thead>
              <tr>
                <th>Number</th>
                <th>Type</th>
                <th>Project</th>
                <th>Total</th>
                <th>Status</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {client.documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.number}</td>
                  <td>{doc.type}</td>
                  <td>{doc.projectName}</td>
                  <td>{formatCurrency(doc.total, doc.currency)}</td>
                  <td>
                    <StatusPill status={doc.status} />
                  </td>
                  <td>
                    <Link
                      href={doc.type === "QUOTATION" ? `/quotation/${doc.id}` : `/invoice/${doc.id}`}
                      className="admin-btn--link"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="doc-notes">No documents yet.</p>
        )}

        {client.notes ? (
          <>
            <div className="doc-hairline" />
            <p className="doc-party__label">Notes</p>
            <p className="doc-notes">{client.notes}</p>
          </>
        ) : null}

        <div className="doc-hairline" />

        <div className="doc-footer">
          <span>COREFRAME — Systems / Strategy / Design</span>
          <span>coreframe.agency</span>
        </div>
      </div>
    </div>
  );
}
