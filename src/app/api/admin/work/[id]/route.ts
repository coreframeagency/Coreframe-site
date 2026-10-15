import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { unauthorizedResponse, validateAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseWorkPayload, slugify } from "@/lib/work";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  const { id } = await context.params;
  const item = await prisma.workItem.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  try {
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;

    // Quick toggle from the list view: { published } only.
    const keys = Object.keys(body);
    if (keys.length === 1 && keys[0] === "published") {
      const item = await prisma.workItem.update({
        where: { id },
        data: { published: Boolean(body.published) },
      });
      revalidatePath("/work");
      return NextResponse.json(item);
    }

    const parsed = parseWorkPayload(body);
    if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

    const { slug: rawSlug, beforeAfter, ...rest } = parsed.data;
    const data: Prisma.WorkItemUpdateInput = {
      ...rest,
      beforeAfter: beforeAfter ?? Prisma.DbNull,
    };
    if (rawSlug) {
      const slug = slugify(rawSlug);
      const clash = await prisma.workItem.findFirst({ where: { slug, NOT: { id } } });
      if (clash) return NextResponse.json({ error: "Slug already in use" }, { status: 400 });
      data.slug = slug;
    }

    const item = await prisma.workItem.update({ where: { id }, data });
    revalidatePath("/work");
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to update work item" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  try {
    const { id } = await context.params;
    await prisma.workItem.delete({ where: { id } });
    revalidatePath("/work");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete work item" }, { status: 500 });
  }
}
