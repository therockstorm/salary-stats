import { Application } from "@prisma/client";
import { decode } from "jsonwebtoken";
import { createMocks } from "node-mocks-http";

import { hash } from "@/lib/crypto";
import prisma from "@/lib/storage/prisma";
import handleTokens from "@/pages/api/applications/[id]/tokens";

import {
  APPLICATION_KEY,
  APPLICATION_SECRET,
  cleanup,
  ERRORS,
  TOKEN_DATA,
} from "../../../../constants";

describe("POST /api/applications/:id/tokens", () => {
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

  test("returns 400 if invalid secret", async () => {
    const expected = ERRORS.badRequest("Invalid: 'secret'");
    const { req, res } = createMocks({
      body: { secret: "invalid" },
      method: "POST",
      query: { id: application.id },
    });

    await handleTokens(req, res);

    expect(res._getStatusCode()).toBe(expected.status);
    expect(JSON.parse(res._getData())).toEqual(expected);
  });

  test("returns 404 if not found", async () => {
    const expected = ERRORS.notFound;
    const { req, res } = createMocks({
      body: { secret: APPLICATION_SECRET },
      method: "POST",
      query: { id: 999_999 },
    });

    await handleTokens(req, res);

    expect(res._getStatusCode()).toBe(expected.status);
    expect(JSON.parse(res._getData())).toEqual(expected);
  });

  test("returns 415 if invalid method", async () => {
    const expected = ERRORS.unsupportedMediaType;
    const { req, res } = createMocks({ method: "PUT" });

    await handleTokens(req, res);

    expect(res._getStatusCode()).toBe(expected.status);
    expect(JSON.parse(res._getData())).toEqual(expected);
  });

  test("returns created token", async () => {
    const { req, res } = createMocks({
      body: { secret: APPLICATION_SECRET },
      method: "POST",
      query: { id: application.id },
    });

    await handleTokens(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(decode(JSON.parse(res._getData()).token)).toEqual(TOKEN_DATA);
  });
});
