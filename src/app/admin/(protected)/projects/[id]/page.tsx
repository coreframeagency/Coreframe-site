import { notFound } from "next/navigation";
import { ProjectDetailClient } from "@/components/admin/ProjectDetailClient";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ id: string }> };

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: true,
      sprintLogs: { orderBy: { date: "desc" } },
    },
  });

  if (!project) notFound();

  return (
    <ProjectDetailClient
      project={{
        id: project.id,
        name: project.name,
        phase: project.phase,
        value: project.value,
        notes: project.notes,
        startDate: project.startDate?.toISOString() ?? null,
        endDate: project.endDate?.toISOString() ?? null,
        client: project.client,
        sprintLogs: project.sprintLogs.map((log) => ({
          id: log.id,
          title: log.title,
          description: log.description,
          date: log.date.toISOString(),
        })),
      }}
    />
  );
}
