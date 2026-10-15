import { notFound } from "next/navigation";
import { WorkForm } from "@/components/admin/WorkForm";
import { prisma } from "@/lib/prisma";
import { parseBeforeAfter } from "@/lib/work";

export const dynamic = "force-dynamic";

export default async function EditWorkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.workItem.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <>
      <h1 className="admin-page-title">Edit — {item.name}</h1>
      <WorkForm
        initial={{
          id: item.id,
          name: item.name,
          url: item.url ?? "",
          category: item.category,
          tag: item.tag,
          year: item.year,
          headline: item.headline,
          problem: item.problem,
          built: item.built,
          result: item.result,
          inDevelopment: item.inDevelopment,
          published: item.published,
          beforeAfter: parseBeforeAfter(item.beforeAfter),
        }}
      />
    </>
  );
}
