import { Agent } from "@prisma/client";
import { createMocks } from "node-mocks-http";

import prisma from "@/lib/storage/prisma";
import handleAgents from "@/pages/api/agents/index";

import {
  AGENT,
  AUTHORIZATION_HEADER,
  cleanup,
  ERRORS,
} from "../../../constants";

describe("POST /api/agents", () => {
  afterAll(async () => {
    await cleanup();
  });

  test("returns 401 if unauthorized", async () => {
    const expected = ERRORS.unauthorizedMissingHeader;
    const { req, res } = createMocks({ body: AGENT, method: "POST" });

    await handleAgents(req, res);

    expect(res._getStatusCode()).toBe(expected.status);
    expect(JSON.parse(res._getData())).toEqual(expected);
  });

  test("returns created agent", async () => {
    const { req, res } = createMocks({
      body: AGENT,
      headers: { authorization: AUTHORIZATION_HEADER },
      method: "POST",
    });

    await handleAgents(req, res);

    expect(res._getStatusCode()).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = JSON.parse(res._getData());
    expect(rest).toEqual(AGENT);
  });
});

describe("GET /api/agents", () => {
  let agent: Agent;

  beforeAll(async () => {
    agent = await prisma.agent.create({ data: AGENT });
  });

  afterAll(async () => {
    await cleanup();
  });

  test("returns 401 if unauthorized", async () => {
    const expected = ERRORS.unauthorizedMissingHeader;
    const { req, res } = createMocks({ method: "GET" });

    await handleAgents(req, res);

    expect(res._getStatusCode()).toBe(expected.status);
    expect(JSON.parse(res._getData())).toEqual(expected);
  });

  test("returns 415 if invalid method", async () => {
    const expected = ERRORS.unsupportedMediaType;
    const { req, res } = createMocks({ method: "PUT" });

    await handleAgents(req, res);

    expect(res._getStatusCode()).toBe(expected.status);
    expect(JSON.parse(res._getData())).toEqual(expected);
  });

  test("returns agents", async () => {
    const { req, res } = createMocks({
      headers: { authorization: AUTHORIZATION_HEADER },
      method: "GET",
    });

    await handleAgents(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual([agent]);
  });
});
