import type { AvailabilityStatus } from "@prisma/client";
import { prisma } from "./prisma";

const DEFAULT_SETTINGS = {
  id: "singleton",
  availability: "OPEN" as AvailabilityStatus,
  updatedAt: new Date(),
};

export async function getSiteSettings() {
  try {
    const existing = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    if (existing) return existing;

    return prisma.siteSettings.create({
      data: { id: "singleton", availability: "OPEN" },
    });
  } catch {
    return DEFAULT_SETTINGS;
  }
}
