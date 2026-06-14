import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { parseLineItems, parsePaymentSchedule } from "@/lib/admin-types";
import { prisma } from "@/lib/prisma";
import "../../admin/admin.css";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pdf?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const document = await prisma.document.findUnique({
    where: { id },
    include: { client: true },
  });

  if (!document || document.type !== "INVOICE") {
    return { title: "Invoice" };
  }

  return {
    title: document.number,
    description: `${document.projectName} — ${document.client.company}`,
    openGraph: {
      title: document.number,
      description: `${document.projectName} — ${document.client.company}`,
    },
  };
}

const labelStyle = {
  fontFamily: "monospace",
  fontSize: "10px",
  color: "#555",
  textTransform: "uppercase" as const,
  letterSpacing: "2px",
  marginBottom: "8px",
};

const valueStyle = {
  fontFamily: "var(--font-display)",
  fontSize: "14px",
  color: "#F5F3EB",
  fontWeight: "bold" as const,
  wordBreak: "break-word" as const,
  overflowWrap: "break-word" as const,
};

const subValueStyle = {
  fontFamily: "Inter, sans-serif",
  fontSize: "12px",
  color: "#555",
  lineHeight: 1.5,
  wordBreak: "break-word" as const,
  overflowWrap: "break-word" as const,
};

export default async function PublicInvoicePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { pdf } = await searchParams;

  const document = await prisma.document.findUnique({
    where: { id },
    include: { client: true },
  });

  if (!document || document.type !== "INVOICE") notFound();

  const lineItems = parseLineItems(document.lineItems);
  const schedule = parsePaymentSchedule(document.paymentSchedule);
  const currency = document.currency === "USD" ? "USD" : "LKR";
  const issueDate = new Date(document.issueDate).toLocaleDateString("en-GB");
  const dueDate = document.dueDate ? new Date(document.dueDate).toLocaleDateString("en-GB") : null;
  const validUntilDate = document.validUntil
    ? new Date(document.validUntil).toLocaleDateString("en-GB")
    : null;
  const pdfUrl = `/api/invoice/${document.id}/pdf`;
  const showActions = pdf !== "true";

  return (
    <div className="doc-page" style={{ background: "#0B0B0B", minHeight: "100vh", padding: "0" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "clamp(24px, 5vw, 64px)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "24px",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <img
            src="https://coreframe.agency/logo-og.png"
            style={{ height: "28px", width: "auto", objectFit: "contain" }}
            alt="coreframe."
          />
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "18px",
                  color: "#F5F3EB",
                  fontWeight: "bold",
                }}
              >
                INVOICE
              </span>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#A6FF00",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "18px",
                  color: "#F5F3EB",
                  fontWeight: "bold",
                }}
              >
                {document.number}
              </span>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#555", marginTop: "4px" }}>
              Issued {issueDate}
              {dueDate ? ` · Due ${dueDate}` : ""}
              {validUntilDate ? ` · Valid until ${validUntilDate}` : ""}
            </div>
          </div>
        </div>

        <div style={{ height: "0.5px", background: "#1F1F1F", margin: "16px 0" }} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "32px",
            margin: "16px 0",
          }}
        >
          <div style={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
            <div style={labelStyle}>FROM</div>
            <div style={valueStyle}>COREFRAME</div>
            <div style={subValueStyle}>coreframeagency@gmail.com</div>
            <div style={subValueStyle}>Colombo, Sri Lanka.</div>
          </div>
          <div style={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
            <div style={labelStyle}>TO</div>
            <div style={valueStyle}>{document.client.name}</div>
            <div style={subValueStyle}>{document.client.email}</div>
            <div style={subValueStyle}>{document.client.company}</div>
            {document.client.address ? (
              <div style={subValueStyle}>{document.client.address}</div>
            ) : null}
            <div style={subValueStyle}>{document.client.country}</div>
          </div>
        </div>

        <div style={{ height: "0.5px", background: "#1F1F1F", margin: "16px 0" }} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "16px",
            margin: "16px 0",
          }}
        >
          <div>
            <div style={labelStyle}>PROJECT</div>
            <div style={valueStyle}>{document.projectName}</div>
          </div>
          <div>
            <div style={labelStyle}>CURRENCY</div>
            <div style={valueStyle}>{currency}</div>
          </div>
          <div>
            <div style={labelStyle}>STATUS</div>
            <div style={{ ...valueStyle, fontSize: "13px" }}>{document.status}</div>
          </div>
        </div>

        <div style={{ height: "0.5px", background: "#1F1F1F", margin: "16px 0" }} />

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #A6FF00" }}>
              <th
                style={{
                  textAlign: "left",
                  fontFamily: "monospace",
                  fontSize: "10px",
                  color: "#555",
                  padding: "8px 4px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Description
              </th>
              <th
                style={{
                  textAlign: "center",
                  fontFamily: "monospace",
                  fontSize: "10px",
                  color: "#555",
                  padding: "8px 4px",
                  textTransform: "uppercase",
                }}
              >
                Qty
              </th>
              <th
                style={{
                  textAlign: "right",
                  fontFamily: "monospace",
                  fontSize: "10px",
                  color: "#555",
                  padding: "8px 4px",
                  textTransform: "uppercase",
                }}
              >
                Rate
              </th>
              <th
                style={{
                  textAlign: "right",
                  fontFamily: "monospace",
                  fontSize: "10px",
                  color: "#555",
                  padding: "8px 4px",
                  textTransform: "uppercase",
                }}
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item, i) => (
              <tr key={i} style={{ borderBottom: "0.5px solid #1F1F1F" }}>
                <td
                  style={{
                    padding: "10px 4px",
                    fontSize: "13px",
                    color: "#F5F3EB",
                    fontFamily: "Inter, sans-serif",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    maxWidth: "300px",
                  }}
                >
                  {item.description}
                </td>
                <td
                  style={{
                    padding: "10px 4px",
                    fontSize: "12px",
                    color: "#555",
                    fontFamily: "monospace",
                    textAlign: "center",
                  }}
                >
                  {item.quantity}
                </td>
                <td
                  style={{
                    padding: "10px 4px",
                    fontSize: "12px",
                    color: "#555",
                    fontFamily: "monospace",
                    textAlign: "right",
                  }}
                >
                  {Number(item.rate).toLocaleString()}
                </td>
                <td
                  style={{
                    padding: "10px 4px",
                    fontSize: "12px",
                    color: "#F5F3EB",
                    fontFamily: "monospace",
                    textAlign: "right",
                  }}
                >
                  {Number(item.amount).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "48px",
            padding: "10px 4px",
            borderBottom: "0.5px solid #1F1F1F",
          }}
        >
          <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#555" }}>SUBTOTAL</span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "11px",
              color: "#F5F3EB",
              minWidth: "100px",
              textAlign: "right",
            }}
          >
            {Number(document.subtotal).toLocaleString()}
          </span>
        </div>

        <div style={{ height: "0.5px", background: "#A6FF00", margin: "4px 0" }} />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "48px",
            padding: "12px 4px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "20px",
              color: "#F5F3EB",
              fontWeight: "bold",
            }}
          >
            TOTAL
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "20px",
              color: "#A6FF00",
              fontWeight: "bold",
              minWidth: "100px",
              textAlign: "right",
            }}
          >
            {currency} {Number(document.total).toLocaleString()}
          </span>
        </div>

        <div style={{ height: "0.5px", background: "#1F1F1F", margin: "16px 0" }} />

        {schedule.length > 0 ? (
          <div style={{ margin: "16px 0" }}>
            <div style={labelStyle}>PAYMENT SCHEDULE</div>
            {schedule.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "8px 0",
                  borderBottom: "0.5px solid #1F1F1F",
                  gap: "16px",
                }}
              >
                <div style={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      color: "#F5F3EB",
                      fontWeight: "bold",
                    }}
                  >
                    {m.label}
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#555" }}>
                    {m.description}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "13px",
                    color: "#A6FF00",
                    flexShrink: 0,
                  }}
                >
                  {currency} {Number(m.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {document.notes ? (
          <div style={{ margin: "16px 0" }}>
            <div style={labelStyle}>NOTES</div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                color: "#555",
                lineHeight: "1.6",
                wordBreak: "break-word",
              }}
            >
              {document.notes}
            </div>
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "16px",
            marginTop: "24px",
            borderTop: "0.5px solid #1F1F1F",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#333" }}>SYSTEMS</span>
            <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#A6FF00" }}>/</span>
            <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#333" }}>STRATEGY</span>
            <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#A6FF00" }}>/</span>
            <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#333" }}>DESIGN</span>
          </div>
          <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#333" }}>coreframe.agency</span>
        </div>

        {showActions ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: "12px",
              marginTop: "32px",
              flexWrap: "wrap",
            }}
          >
            <a
              href={pdfUrl}
              style={{
                background: "#A6FF00",
                color: "#0B0B0B",
                fontFamily: "monospace",
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "2px",
                padding: "10px 24px",
                borderRadius: "3px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Download PDF →
            </a>
            <Link
              href="/"
              style={{
                background: "transparent",
                border: "0.5px solid #1F1F1F",
                color: "#F5F3EB",
                fontFamily: "monospace",
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "2px",
                padding: "10px 24px",
                borderRadius: "3px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Visit coreframe.agency
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
