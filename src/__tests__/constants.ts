import prisma from "@/lib/storage/prisma";

export const APPLICATION_KEY = "clipboard";
export const APPLICATION_SECRET = "secret";

export const TOKEN_DATA = {
  exp: expect.any(Number),
  iat: expect.any(Number),
  key: APPLICATION_KEY,
};

export const ERRORS = {
  badRequest: (detail: string) => ({
    errors: [{ detail }],
    code: "BadRequest",
    status: 400,
  }),
  notFound: { code: "NotFound", status: 404 },
  unsupportedMediaType: { code: "UnsupportedMediaType", status: 415 },
};

export async function cleanup() {
  await prisma.$transaction([
    prisma.agent.deleteMany(),
    prisma.application.deleteMany(),
  ]);
  await prisma.$disconnect();
}
