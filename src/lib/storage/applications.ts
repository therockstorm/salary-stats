import { Application, Prisma } from "@prisma/client";
import { z } from "zod";

import { ApplicationCreateInputObjectSchema } from "@/prisma/generated/schemas";

import { hash } from "../crypto";
import prisma from "./prisma";

const TokenCreateInputObjectSchema = z.object({ secret: z.string() });

export function validateApplication(data: unknown) {
  return ApplicationCreateInputObjectSchema.parse(data);
}

export function validateToken(data: unknown) {
  return TokenCreateInputObjectSchema.parse(data);
}

export async function createApplication(data: Prisma.ApplicationCreateInput) {
  const application = await prisma.application.create({
    data: { ...data, secret: await hash(data.secret) },
  });
  return filterSecret(application);
}

export async function getApplicationById(id: number) {
  const application = await getApplicationByIdWithSecret(id);
  return filterSecret(application);
}

export async function getApplicationByIdWithSecret(id: number) {
  const application = await prisma.application.findFirst({ where: { id } });
  return application;
}

export async function getApplications() {
  const applications = await prisma.application.findMany();
  return applications.map(filterSecret);
}

function filterSecret(application: Application | null) {
  if (application == null) return application;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { secret, ...rest } = application;
  return rest;
}
