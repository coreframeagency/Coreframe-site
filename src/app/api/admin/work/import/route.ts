import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { unauthorizedResponse, validateAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PROJECTS } from "@/components/work/projects";

/**
 * One-time import of the hard-coded work list into the database.
 * Skips any slug that already exists, so it is safe to run twice.
 */
export async function POST(request: NextRequest) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  try {
    const existing = await prisma.workItem.findMany({ select: { slug: true, sortOrder: true } });
    const taken = new Set(existing.map((e) => e.slug));
    let next = existing.reduce((max, e) => Math.max(max, e.sortOrder + 1), 0);

    let created = 0;
    for (const p of PROJECTS) {
      if (taken.has(p.id)) continue;
      await prisma.workItem.create({
        data: {
          slug: p.id,
          name: p.name,
          url: p.url,
          category: p.category,
          tag: p.tag,
          year: p.year,
          headline: p.headline,
          problem: p.problem,
          built: p.built,
          result: p.result,
          inDevelopment: p.status === "in-development",
          beforeAfter: p.beforeAfter ?? undefined,
          published: true,
          sortOrder: next++,
        },
      });
      created++;
    }

    revalidatePath("/work");
    return NextResponse.json({ ok: true, created });
  } catch {
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
