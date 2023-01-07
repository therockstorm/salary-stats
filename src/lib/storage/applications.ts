import { Prisma } from "@prisma/client";

import prisma from "./prisma";

export function validateApplication(data: unknown) {
  return data as Prisma.ApplicationCreateInput;
}

export async function createApplication(data: Prisma.ApplicationCreateInput) {
  return await prisma.application.create({ data });
}
