import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientPortalCopyButton } from "@/components/admin/ClientPortalCopyButton";
import { StatusPill } from "@/components/admin/StatusPill";
import { formatCurrency, formatDate } from "@/lib/admin-types";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ id: string }> };

export default async function ClientDetailPage({ params }: PageProps) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      documents: { orderBy: { createdAt: "desc" } },
      projects: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!client) notFound();

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <h1 className="admin-page-title" style={{ margin: 0 }}>
          {client.name}
        </h1>
        <ClientPortalCopyButton clientId={client.id} />
      </div>

      <div className="admin-detail-grid" style={{ marginBottom: 32 }}>
        <div>
          <p className="admin-detail-field__label">Email</p>
          <p className="admin-detail-field__value">{client.email}</p>
        </div>
        <div>
          <p className="admin-detail-field__label">Company</p>
          <p className="admin-detail-field__value">{client.company}</p>
        </div>
        <div>
          <p className="admin-detail-field__label">Address</p>
          <p className="admin-detail-field__value">{client.address}</p>
        </div>
        <div>
          <p className="admin-detail-field__label">Country</p>
          <p className="admin-detail-field__value">{client.country}</p>
        </div>
        <div>
          <p className="admin-detail-field__label">Added</p>
          <p className="admin-detail-field__value">{formatDate(client.createdAt)}</p>
        </div>
        {client.notes ? (
          <div>
            <p className="admin-detail-field__label">Notes</p>
            <p className="admin-detail-field__value">{client.notes}</p>
          </div>
        ) : null}
      </div>

      <p className="admin-eyebrow">Projects</p>
      {client.projects.length ? (
        <div className="admin-table-wrap" style={{ marginBottom: 32 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phase</th>
              </tr>
            </thead>
            <tbody>
              {client.projects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <Link href={`/admin/projects/${project.id}`} className="admin-btn--link">
                      {project.name}
                    </Link>
                  </td>
                  <td>{project.phase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ marginBottom: 32 }}>No projects yet.</p>
      )}

      <p className="admin-eyebrow">Documents</p>
      {client.documents.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Number</th>
                <th>Type</th>
                <th>Project</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {client.documents.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <Link href={`/admin/documents/${doc.id}`} className="admin-btn--link">
                      {doc.number}
                    </Link>
                  </td>
                  <td>{doc.type}</td>
                  <td>{doc.projectName}</td>
                  <td className="admin-table__mono">{formatCurrency(doc.total, doc.currency)}</td>
                  <td>
                    <StatusPill status={doc.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No documents yet.</p>
      )}
    </>
  );
}
