import { Application, Prisma } from "@prisma/client";

import { ApplicationCreateInputObjectSchema } from "@/prisma/generated/schemas";

import { hash } from "../crypto";
import prisma from "./prisma";

export function validateApplication(data: unknown) {
  return ApplicationCreateInputObjectSchema.parse(data);
}

export async function createApplication(data: Prisma.ApplicationCreateInput) {
  const application = await prisma.application.create({
    data: { ...data, secret: await hash(data.secret) },
  });
  return filterSecret(application);
}

function filterSecret(application: Application | null) {
  if (application == null) return application;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { secret, ...rest } = application;
  return rest;
}
