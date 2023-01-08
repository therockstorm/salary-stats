import { createMocks } from "node-mocks-http";

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

  test("returns 415 if invalid method", async () => {
    const expected = ERRORS.unsupportedMediaType;
    const { req, res } = createMocks({ method: "PUT" });

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
