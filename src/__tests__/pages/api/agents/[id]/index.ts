import { Agent } from "@prisma/client";
import { createMocks } from "node-mocks-http";

import {
  AGENT,
  AUTHORIZATION_HEADER,
  cleanup,
  ERRORS,
} from "@/__tests__/constants";
import prisma from "@/lib/storage/prisma";
import handleAgentsById from "@/pages/api/agents/[id]/index";

describe("GET /api/agents/:id", () => {
  let agent: Agent;

  beforeAll(async () => {
    agent = await prisma.agent.create({ data: AGENT });
  });

  afterAll(async () => {
    await cleanup();
  });

  test("returns 401 if unauthorized", async () => {
    const expected = ERRORS.unauthorizedMissingHeader;
    const { req, res } = createMocks({ method: "GET", query: { id: 1 } });

    await handleAgentsById(req, res);

    expect(res._getStatusCode()).toBe(expected.status);
    expect(JSON.parse(res._getData())).toEqual(expected);
  });

  test("returns 404 if not found", async () => {
    const expected = ERRORS.notFound;
    const { req, res } = createMocks({
      headers: { authorization: AUTHORIZATION_HEADER },
      method: "GET",
      query: { id: 1 },
    });

    await handleAgentsById(req, res);

    expect(res._getStatusCode()).toBe(expected.status);
    expect(JSON.parse(res._getData())).toEqual(expected);
  });

  test("returns 415 if invalid method", async () => {
    const expected = ERRORS.unsupportedMediaType;
    const { req, res } = createMocks({ method: "PUT" });

    await handleAgentsById(req, res);

    expect(res._getStatusCode()).toBe(expected.status);
    expect(JSON.parse(res._getData())).toEqual(expected);
  });

  test("returns agent", async () => {
    const { req, res } = createMocks({
      headers: { authorization: AUTHORIZATION_HEADER },
      method: "GET",
      query: { id: agent.id },
    });

    await handleAgentsById(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(agent);
  });

  test("deletes agent", async () => {
    const { req, res } = createMocks({
      headers: { authorization: AUTHORIZATION_HEADER },
      method: "DELETE",
      query: { id: agent.id },
    });

    await handleAgentsById(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(agent);
  });
});
