import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const alt = "COREFRAME Quotation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type PageProps = { params: Promise<{ id: string }> };

function DocumentOgImage({
  label,
  number,
  projectName,
  clientCompany,
}: {
  label: string;
  number: string;
  projectName: string;
  clientCompany: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0B0B0B",
        padding: "48px 56px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img
          src="https://coreframe.agency/logo-og.png"
          style={{ height: 32, objectFit: "contain" }}
          alt="coreframe."
        />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#FFFFFF" }}>{label}</div>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#A6FF00",
            }}
          />
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: "#1F1F1F", margin: "40px 0" }} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, color: "#A6FF00", lineHeight: 1.1 }}>
          {number}
        </div>
        <div style={{ fontSize: 28, color: "#FFFFFF", marginTop: 20 }}>{projectName}</div>
        <div style={{ fontSize: 24, color: "#555555", marginTop: 12 }}>{clientCompany}</div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#333333", fontSize: 14 }}>SYSTEMS</span>
          <span style={{ color: "#A6FF00", fontSize: 14 }}>/</span>
          <span style={{ color: "#333333", fontSize: 14 }}>STRATEGY</span>
          <span style={{ color: "#A6FF00", fontSize: 14 }}>/</span>
          <span style={{ color: "#333333", fontSize: 14 }}>DESIGN</span>
        </div>
        <div style={{ fontSize: 16, color: "#555555" }}>coreframe.agency</div>
      </div>
    </div>
  );
}

export default async function Image({ params }: PageProps) {
  const { id } = await params;

  const document = await prisma.document.findUnique({
    where: { id },
    include: { client: true },
  });

  if (!document || document.type !== "QUOTATION") {
    return new ImageResponse(
      (
        <DocumentOgImage
          label="QUOTATION"
          number="COREFRAME"
          projectName="Quotation"
          clientCompany="coreframe.agency"
        />
      ),
      { ...size },
    );
  }

  return new ImageResponse(
    (
      <DocumentOgImage
        label="QUOTATION"
        number={document.number}
        projectName={document.projectName}
        clientCompany={document.client.company}
      />
    ),
    { ...size },
  );
}
