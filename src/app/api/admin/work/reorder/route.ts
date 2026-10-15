import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { unauthorizedResponse, validateAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Body: { ids: string[] } — full list in the new display order. */
export async function PUT(request: NextRequest) {
  const session = await validateAdminRequest(request);
  if (!session) return unauthorizedResponse();

  try {
    const body = (await request.json()) as { ids?: unknown };
    if (!Array.isArray(body.ids) || body.ids.some((id) => typeof id !== "string")) {
      return NextResponse.json({ error: "ids must be a string array" }, { status: 400 });
    }
    const ids = body.ids as string[];

    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.workItem.update({ where: { id }, data: { sortOrder: index } }),
      ),
    );

    revalidatePath("/work");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}
