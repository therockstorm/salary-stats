import { Prisma } from "@prisma/client";

import { ApplicationCreateInputObjectSchema } from "@/prisma/generated/schemas";

import prisma from "./prisma";

export function validateApplication(data: unknown) {
  return ApplicationCreateInputObjectSchema.parse(data);
}

export async function createApplication(data: Prisma.ApplicationCreateInput) {
  return await prisma.application.create({ data });
}
