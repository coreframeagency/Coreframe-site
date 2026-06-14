import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { renderToBuffer, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#0B0B0B",
    padding: 32,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  logo: {
    width: 120,
    height: 21,
    objectFit: "contain",
  },
  invoiceLabel: {
    fontSize: 20,
    color: "#F5F3EB",
    fontFamily: "Helvetica-Bold",
  },
  invoiceNumber: {
    fontSize: 13,
    color: "#A6FF00",
    fontFamily: "Courier",
    marginTop: 4,
  },
  dates: {
    fontSize: 11,
    color: "#555555",
    fontFamily: "Courier",
    marginTop: 2,
  },
  hairline: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#1F1F1F",
    marginVertical: 8,
  },
  twoCol: {
    flexDirection: "row",
    marginBottom: 8,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 9,
    color: "#555555",
    fontFamily: "Courier",
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    fontSize: 12,
    color: "#F5F3EB",
    fontFamily: "Helvetica-Bold",
    marginBottom: 1,
  },
  subValue: {
    fontSize: 10,
    color: "#555555",
    fontFamily: "Helvetica",
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#A6FF00",
  },
  tableHeaderText: {
    fontSize: 10,
    color: "#555555",
    fontFamily: "Courier",
    letterSpacing: 1,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1F1F1F",
  },
  tableDesc: { flex: 3, fontSize: 11, color: "#F5F3EB", fontFamily: "Helvetica" },
  tableQty: { flex: 1, fontSize: 11, color: "#555555", fontFamily: "Courier", textAlign: "center" },
  tableRate: { flex: 1, fontSize: 11, color: "#555555", fontFamily: "Courier", textAlign: "right" },
  tableAmt: { flex: 1, fontSize: 11, color: "#F5F3EB", fontFamily: "Courier", textAlign: "right" },
  subtotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 4,
  },
  subtotalLabel: { fontSize: 10, color: "#555555", fontFamily: "Courier", marginRight: 24 },
  subtotalValue: { fontSize: 10, color: "#F5F3EB", fontFamily: "Courier", width: 80, textAlign: "right" },
  limeLine: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#A6FF00",
    marginVertical: 2,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 6,
  },
  totalLabel: { fontSize: 14, color: "#F5F3EB", fontFamily: "Helvetica-Bold", marginRight: 24 },
  totalValue: { fontSize: 14, color: "#A6FF00", fontFamily: "Helvetica-Bold", width: 120, textAlign: "right" },
  scheduleLabel: {
    fontSize: 10,
    color: "#555555",
    fontFamily: "Courier",
    letterSpacing: 2,
    marginBottom: 4,
    marginTop: 8,
  },
  scheduleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1F1F1F",
  },
  scheduleDesc: { fontSize: 10, color: "#555555", fontFamily: "Helvetica" },
  scheduleAmt: { fontSize: 10, color: "#A6FF00", fontFamily: "Courier" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#1F1F1F",
  },
  footerLeft: { fontSize: 9, color: "#333333", fontFamily: "Courier" },
  footerRight: { fontSize: 9, color: "#333333", fontFamily: "Courier" },
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const doc = await prisma.document.findUnique({
      where: { id },
      include: { client: true },
    });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const lineItems = doc.lineItems as Array<{
      description: string;
      quantity: number;
      rate: number;
      amount: number;
    }>;
    const schedule = doc.paymentSchedule as Array<{
      label: string;
      description: string;
      amount: number;
    }>;
    const currency = doc.currency === "USD" ? "USD" : "LKR";
    const issueDate = new Date(doc.issueDate).toLocaleDateString("en-GB");
    const dueDate = doc.dueDate ? new Date(doc.dueDate).toLocaleDateString("en-GB") : null;

    const PdfDoc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <View>
              <Image src="public/logo-og.png" style={styles.logo} />
            </View>
            <View>
              <Text style={styles.invoiceLabel}>QUOTATION</Text>
              <Text style={styles.invoiceNumber}>{doc.number}</Text>
              <Text style={styles.dates}>
                Issued: {issueDate}
                {dueDate ? `   Due: ${dueDate}` : ""}
              </Text>
            </View>
          </View>

          <View style={styles.hairline} />

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <Text style={styles.label}>FROM</Text>
              <Text style={styles.value}>COREFRAME</Text>
              <Text style={styles.subValue}>coreframeagency@gmail.com</Text>
              <Text style={styles.subValue}>Colombo, Sri Lanka.</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>TO</Text>
              <Text style={styles.value}>{doc.client.name}</Text>
              <Text style={styles.subValue}>{doc.client.email}</Text>
              <Text style={styles.subValue}>{doc.client.company}</Text>
              <Text style={styles.subValue}>{doc.client.country}</Text>
            </View>
          </View>

          <View style={styles.hairline} />

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <Text style={styles.label}>PROJECT</Text>
              <Text style={styles.value}>{doc.projectName}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>CURRENCY</Text>
              <Text style={styles.value}>{currency}</Text>
            </View>
          </View>

          <View style={styles.hairline} />

          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 3 }]}>DESCRIPTION</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: "center" }]}>QTY</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: "right" }]}>RATE</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: "right" }]}>AMOUNT</Text>
          </View>

          {lineItems.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tableDesc}>{item.description}</Text>
              <Text style={styles.tableQty}>{item.quantity}</Text>
              <Text style={styles.tableRate}>{Number(item.rate).toLocaleString()}</Text>
              <Text style={styles.tableAmt}>{Number(item.amount).toLocaleString()}</Text>
            </View>
          ))}

          <View style={styles.subtotalRow}>
            <Text style={styles.subtotalLabel}>SUBTOTAL</Text>
            <Text style={styles.subtotalValue}>{Number(doc.subtotal).toLocaleString()}</Text>
          </View>

          <View style={styles.limeLine} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalValue}>
              {currency} {Number(doc.total).toLocaleString()}
            </Text>
          </View>

          {schedule && schedule.length > 0 && (
            <View>
              <Text style={styles.scheduleLabel}>PAYMENT SCHEDULE</Text>
              {schedule.map((m, i) => (
                <View key={i} style={styles.scheduleRow}>
                  <Text style={styles.scheduleDesc}>
                    {m.label}  {m.description}
                  </Text>
                  <Text style={styles.scheduleAmt}>
                    {currency} {Number(m.amount).toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {doc.notes && (
            <View style={{ marginTop: 16 }}>
              <Text style={styles.label}>NOTES</Text>
              <Text style={styles.subValue}>{doc.notes}</Text>
            </View>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerLeft}>SYSTEMS / STRATEGY / DESIGN</Text>
            <Text style={styles.footerRight}>coreframe.agency</Text>
          </View>
        </Page>
      </Document>
    );

    const buffer = await renderToBuffer(PdfDoc);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${doc.number}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "PDF generation failed", details: String(error) },
      { status: 500 },
    );
  }
}
