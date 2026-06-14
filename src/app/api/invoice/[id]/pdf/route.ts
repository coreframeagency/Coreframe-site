import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const document = await prisma.document.findUnique({
      where: { id },
      include: { client: true },
    })

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://coreframe.agency"
    const url = `${baseUrl}/invoice/${id}?pdf=true`

    const puppeteer = await import("puppeteer")
    const browser = await puppeteer.default.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu",
      ],
    })

    const page = await browser.newPage()
    await page.setViewport({ width: 1200, height: 900 })
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 })
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    })

    await browser.close()

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${document.number}.pdf"`,
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json(
      { error: "PDF generation failed", details: String(error) },
      { status: 500 }
    )
  }
}
