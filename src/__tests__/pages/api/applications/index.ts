import { Application } from "@prisma/client";
import { createMocks } from "node-mocks-http";

import { hash } from "@/lib/crypto";
import prisma from "@/lib/storage/prisma";
import { createToken } from "@/lib/tokens";
import handleApplications from "@/pages/api/applications/index";

import {
  APPLICATION_KEY,
  APPLICATION_SECRET,
  cleanup,
  ERRORS,
} from "../../../constants";

describe("POST /api/applications", () => {
  afterAll(async () => {
    await cleanup();
  });

  test("returns 400 on bad request", async () => {
    const expected = ERRORS.badRequest("Required: 'secret'");
    const { req, res } = createMocks({
      body: { key: APPLICATION_KEY },
      method: "POST",
    });

    await handleApplications(req, res);

    expect(res._getStatusCode()).toBe(expected.status);
    expect(JSON.parse(res._getData())).toEqual(expected);
  });

  test("returns created application without secret", async () => {
    const { req, res } = createMocks({
      body: { key: APPLICATION_KEY, secret: APPLICATION_SECRET },
      method: "POST",
    });

    await handleApplications(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData()).key).toEqual(APPLICATION_KEY);
  });
});

describe("GET /api/applications", () => {
  let application: Omit<Application, "secret">;

  beforeAll(async () => {
    const created = await prisma.application.create({
      data: { key: APPLICATION_KEY, secret: await hash(APPLICATION_SECRET) },
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
    const { req, res } = createMocks({ method: "GET" });

    await handleApplications(req, res);

    expect(res._getStatusCode()).toBe(expected.status);
    expect(JSON.parse(res._getData())).toEqual(expected);
  });

  test("returns 415 if invalid method", async () => {
    const expected = ERRORS.unsupportedMediaType;
    const { req, res } = createMocks({ method: "PUT" });

    await handleApplications(req, res);

    expect(res._getStatusCode()).toBe(expected.status);
    expect(JSON.parse(res._getData())).toEqual(expected);
  });

  test("returns applications without secrets", async () => {
    const { req, res } = createMocks({
      headers: { authorization: `Bearer ${createToken(APPLICATION_KEY)}` },
      method: "GET",
    });

    await handleApplications(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual([application]);
  });
});
