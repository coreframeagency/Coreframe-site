import type { Prisma, WorkItem } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PROJECTS, type BeforeAfter, type Project } from "@/components/work/projects";

/** DB row → the shape the public /work components already render. */
export function workItemToProject(item: WorkItem): Project {
  return {
    id: item.slug,
    name: item.name,
    url: item.url,
    category: item.category,
    tag: item.tag,
    year: item.year,
    headline: item.headline,
    problem: item.problem,
    built: item.built,
    result: item.result,
    status: item.inDevelopment ? "in-development" : undefined,
    beforeAfter: parseBeforeAfter(item.beforeAfter) ?? undefined,
  };
}

/**
 * Published work in admin-defined order.
 * Falls back to the static list if the table is empty or the DB is unreachable,
 * so /work never renders blank.
 */
export async function getPublishedWork(): Promise<Project[]> {
  try {
    const items = await prisma.workItem.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    const total = items.length ? items.length : await prisma.workItem.count();
    if (total === 0) return PROJECTS;
    return items.map(workItemToProject);
  } catch {
    return PROJECTS;
  }
}

export function parseBeforeAfter(value: unknown): BeforeAfter | null {
  if (!value || typeof value !== "object") return null;
  const rows = (value as { rows?: unknown }).rows;
  if (!Array.isArray(rows)) return null;
  const clean = rows
    .map((row) => {
      const r = (row ?? {}) as Record<string, unknown>;
      return {
        before: String(r.before ?? "").trim(),
        after: String(r.after ?? "").trim(),
        highlight: String(r.highlight ?? "").trim(),
      };
    })
    .filter((r) => r.before && r.after);
  if (clean.length !== 3) return null;
  return { rows: [clean[0], clean[1], clean[2]] };
}

export function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "work"
  );
}

type WorkInput = Omit<Prisma.WorkItemCreateInput, "slug" | "sortOrder"> & { slug?: string };

/** Validate an admin form payload. Returns data or an error message. */
export function parseWorkPayload(
  body: Record<string, unknown>,
): { data: WorkInput } | { error: string } {
  const str = (key: string) => String(body[key] ?? "").trim();
  const required = ["name", "category", "tag", "year", "headline", "problem", "built", "result"];
  for (const key of required) {
    if (!str(key)) return { error: `${key} is required` };
  }

  let url: string | null = str("url") || null;
  if (url && !/^https?:\/\//i.test(url)) url = `https://${url}`;

  const beforeAfter = parseBeforeAfter(body.beforeAfter);

  return {
    data: {
      slug: str("slug") || undefined,
      name: str("name"),
      url,
      category: str("category"),
      tag: str("tag").toUpperCase(),
      year: str("year"),
      headline: str("headline"),
      problem: str("problem"),
      built: str("built"),
      result: str("result"),
      inDevelopment: Boolean(body.inDevelopment),
      published: body.published === undefined ? true : Boolean(body.published),
      beforeAfter: beforeAfter ?? undefined,
    },
  };
}
