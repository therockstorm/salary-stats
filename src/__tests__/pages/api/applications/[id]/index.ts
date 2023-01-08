import { Application } from "@prisma/client";
import { createMocks } from "node-mocks-http";

import {
  APPLICATION_KEY,
  AUTHORIZATION_HEADER,
  cleanup,
  ERRORS,
} from "@/__tests__/constants";
import { hash } from "@/lib/crypto";
import prisma from "@/lib/storage/prisma";
import handleApplicationsById from "@/pages/api/applications/[id]/index";

describe("GET /api/applications/:id", () => {
  let application: Omit<Application, "secret">;

  beforeAll(async () => {
    const created = await prisma.application.create({
      data: { key: APPLICATION_KEY, secret: await hash("secret") },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { secret, ...rest } = created;
    application = rest;
  });

  afterAll(async () => {
    await cleanup();
  });

  test("returns 401 if unauthorized", async () => {
    const expected = ERRORS.unauthorizedMissingHeader;
    const { req, res } = createMocks({ method: "GET", query: { id: 1 } });

    await handleApplicationsById(req, res);

    expect(res._getStatusCode()).toBe(expected.status);
    expect(JSON.parse(res._getData())).toEqual(expected);
  });

  test("returns 404 if not found", async () => {
    const expected = ERRORS.notFound;
    const { req, res } = createMocks({
      headers: { authorization: AUTHORIZATION_HEADER },
      method: "GET",
      query: { id: 999_999 },
    });

    await handleApplicationsById(req, res);

    expect(res._getStatusCode()).toBe(expected.status);
    expect(JSON.parse(res._getData())).toEqual(expected);
  });

  test("returns 415 if invalid method", async () => {
    const expected = ERRORS.unsupportedMediaType;
    const { req, res } = createMocks({ method: "PUT" });

    await handleApplicationsById(req, res);

    expect(res._getStatusCode()).toBe(expected.status);
    expect(JSON.parse(res._getData())).toEqual(expected);
  });

  test("returns application", async () => {
    const { req, res } = createMocks({
      headers: { authorization: AUTHORIZATION_HEADER },
      method: "GET",
      query: { id: application.id },
    });

    await handleApplicationsById(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(application);
  });
});
