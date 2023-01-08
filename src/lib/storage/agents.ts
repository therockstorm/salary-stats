import { Prisma } from "@prisma/client";

import { AgentCreateInputObjectSchema } from "@/prisma/generated/schemas";

import prisma from "./prisma";

export function validateAgent(data: unknown) {
  return AgentCreateInputObjectSchema.parse(data);
}

export function createAgent(data: Prisma.AgentCreateInput) {
  return prisma.agent.create({ data });
}

export function getAgentById(id: number) {
  return prisma.agent.findFirst({ where: { id } });
}

export function getAgents() {
  return prisma.agent.findMany();
}

export function deleteAgent(id: number) {
  return prisma.agent.delete({ where: { id } });
}
