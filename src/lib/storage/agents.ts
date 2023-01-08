import { Prisma } from "@prisma/client";

import { AgentCreateInputObjectSchema } from "@/prisma/generated/schemas";

import prisma from "./prisma";

type Filters = Readonly<{
  departments?: string[];
  onContract?: boolean;
}>;

export function validateAgent(data: unknown) {
  return AgentCreateInputObjectSchema.parse(data);
}

export function createAgent(data: Prisma.AgentCreateInput) {
  return prisma.agent.create({ data });
}

export function getAgentById(id: number) {
  return prisma.agent.findFirst({ where: { id } });
}

export function getAgents({ filters }: Readonly<{ filters?: Filters }> = {}) {
  return prisma.agent.findMany({ where: buildWhere(filters) });
}

export function deleteAgent(id: number) {
  return prisma.agent.delete({ where: { id } });
}

function buildWhere(filters?: Filters): Prisma.AgentWhereInput | undefined {
  if (filters == null) return undefined;

  const { departments, onContract } = filters;
  return {
    onContract: onContract != null ? onContract : undefined,
    department: { in: departments != null ? departments : undefined },
  };
}
