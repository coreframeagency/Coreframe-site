import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { unauthorizedResponse, validateAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseWorkPayload, slugify } from "@/lib/work";

export async function GET(request: NextRequest) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  const items = await prisma.workItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const parsed = parseWorkPayload(body);
    if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

    const base = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.name);
    let slug = base;
    for (let i = 2; await prisma.workItem.findUnique({ where: { slug } }); i++) {
      slug = `${base}-${i}`;
    }

    // New work goes to the top. Shift everything else down one.
    const item = await prisma.$transaction(async (tx) => {
      await tx.workItem.updateMany({ data: { sortOrder: { increment: 1 } } });
      return tx.workItem.create({ data: { ...parsed.data, slug, sortOrder: 0 } });
    });

    revalidatePath("/work");
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create work item" }, { status: 500 });
  }
}
