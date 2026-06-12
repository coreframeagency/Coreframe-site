import { prisma } from "./prisma";

export async function getSiteSettings() {
  const existing = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (existing) return existing;

  return prisma.siteSettings.create({
    data: { id: "singleton", availability: "OPEN" },
  });
}
