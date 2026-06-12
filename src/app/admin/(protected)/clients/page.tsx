"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/admin-types";
import { StatusPill } from "@/components/admin/StatusPill";

type ClientRow = {
  id: string;
  name: string;
  email: string;
  company: string;
  country: string;
  address: string;
  notes: string | null;
  createdAt: string;
  _count: { documents: number };
  documents?: Array<{
    id: string;
    number: string;
    type: string;
    status: string;
    total: number;
    currency: string;
  }>;
};

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [selected, setSelected] = useState<ClientRow | null>(null);

  useEffect(() => {
    fetch("/api/admin/clients")
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch(() => setClients([]));
  }, []);

  async function openClient(client: ClientRow) {
    const response = await fetch("/api/admin/clients");
    const all = (await response.json()) as ClientRow[];
    const docsResponse = await fetch("/api/admin/documents");
    const docs = (await docsResponse.json()) as Array<{
      id: string;
      number: string;
      type: string;
      status: string;
      total: number;
      currency: string;
      clientId: string;
    }>;
    const full = all.find((item) => item.id === client.id) ?? client;
    setSelected({
      ...full,
      documents: docs.filter((doc) => doc.clientId === client.id),
    });
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 className="admin-page-title" style={{ margin: 0 }}>
          Clients
        </h1>
        <Link href="/admin/clients/new" className="admin-btn admin-btn--primary">
          New client
        </Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Country</th>
              <th>Documents</th>
              <th>Added</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="is-clickable" onClick={() => openClient(client)}>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.company}</td>
                <td>{client.country}</td>
                <td>{client._count.documents}</td>
                <td>{formatDate(client.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected ? (
        <div className="admin-slideover">
          <button
            type="button"
            className="admin-slideover__backdrop"
            aria-label="Close panel"
            onClick={() => setSelected(null)}
          />
          <div className="admin-slideover__panel">
            <h2 className="admin-page-title" style={{ fontSize: "1.5rem" }}>
              {selected.name}
            </h2>
            <p>{selected.email}</p>
            <p>{selected.company}</p>
            <p>{selected.address}</p>
            <p>{selected.country}</p>
            {selected.notes ? <p>{selected.notes}</p> : null}
            <div className="doc-hairline" />
            <h3 className="admin-form-label">Documents</h3>
            {selected.documents?.length ? (
              selected.documents.map((doc) => (
                <div key={doc.id} style={{ marginBottom: 8 }}>
                  <Link href={`/admin/documents/${doc.id}`} className="admin-btn--link">
                    {doc.number}
                  </Link>{" "}
                  <StatusPill status={doc.status} />
                </div>
              ))
            ) : (
              <p>No documents yet.</p>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
