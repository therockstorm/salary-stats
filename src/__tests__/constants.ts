import prisma from "@/lib/storage/prisma";

export const APPLICATION_KEY = "clipboard";
export const APPLICATION_SECRET = "secret";

export const ERRORS = {
  badRequest: (detail: string) => ({
    errors: [{ detail }],
    code: "BadRequest",
    status: 400,
  }),
  unsupportedMediaType: { code: "UnsupportedMediaType", status: 415 },
};

export async function cleanup() {
  await prisma.$transaction([
    prisma.agent.deleteMany(),
    prisma.application.deleteMany(),
  ]);
  await prisma.$disconnect();
}
