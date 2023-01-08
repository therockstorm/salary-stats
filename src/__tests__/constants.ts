import prisma from "@/lib/storage/prisma";
import { createToken } from "@/lib/tokens";

export const APPLICATION_KEY = "clipboard";
export const APPLICATION_SECRET = "secret";

export const AUTHORIZATION_HEADER = `Bearer ${createToken(APPLICATION_KEY)}`;

export const TOKEN_DATA = {
  exp: expect.any(Number),
  iat: expect.any(Number),
  key: APPLICATION_KEY,
};

export const AGENT = {
  name: "Abhishek",
  salary: "145000",
  currency: "USD",
  department: "Engineering",
  onContract: false,
  subDepartment: "Frontend",
};

export const ERRORS = {
  badRequest: (detail: string) => ({
    errors: [{ detail }],
    code: "BadRequest",
    status: 400,
  }),
  notFound: { code: "NotFound", status: 404 },
  unauthorizedMissingHeader: {
    code: "Unauthorized",
    errors: [{ detail: "Required header: 'authorization'" }],
    status: 401,
  },
  unsupportedMediaType: { code: "UnsupportedMediaType", status: 415 },
};

export async function cleanup() {
  await prisma.$transaction([
    prisma.agent.deleteMany(),
    prisma.application.deleteMany(),
  ]);
  await prisma.$disconnect();
}
