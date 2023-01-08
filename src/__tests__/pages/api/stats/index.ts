import { createMocks } from "node-mocks-http";

import prisma from "@/lib/storage/prisma";
import { createToken } from "@/lib/tokens";
import handleStats from "@/pages/api/stats/index";

import {
  AGENT,
  AGENT_2,
  APPLICATION_KEY,
  cleanup,
  ERRORS,
} from "../../../constants";

describe("GET /api/stats", () => {
  beforeAll(async () => {
    await prisma.agent.createMany({ data: [AGENT, AGENT_2] });
  });

  afterAll(async () => {
    await cleanup();
  });

  test("returns 401 if unauthorized", async () => {
    const expected = ERRORS.unauthorizedMissingHeader;
    const { req, res } = createMocks({ method: "GET" });

    await handleStats(req, res);

    expect(res._getStatusCode()).toBe(expected.status);
    expect(JSON.parse(res._getData())).toEqual(expected);
  });

  test("returns 415 if invalid method", async () => {
    const expected = ERRORS.unsupportedMediaType;
    const { req, res } = createMocks({ method: "PUT" });

    await handleStats(req, res);

    expect(res._getStatusCode()).toBe(expected.status);
    expect(JSON.parse(res._getData())).toEqual(expected);
  });

  test("returns stats in alternate currency", async () => {
    const { req, res } = createMocks({
      headers: { authorization: `Bearer ${createToken(APPLICATION_KEY)}` },
      method: "GET",
      query: { currency: "EUR" },
    });

    await handleStats(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      data: { avg: "111625.00", count: 2, max: "137750.00", min: "85500.00" },
    });
  });

  test("returns nested aggregated stats", async () => {
    const { req, res } = createMocks({
      headers: { authorization: `Bearer ${createToken(APPLICATION_KEY)}` },
      method: "GET",
      query: { aggregate: "department.subDepartment" },
    });

    await handleStats(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      Banking: {
        Loan: {
          avg: "90000.00",
          count: 1,
          max: "90000.00",
          min: "90000.00",
        },
      },
      Engineering: {
        Frontend: {
          avg: "145000.00",
          count: 1,
          max: "145000.00",
          min: "145000.00",
        },
      },
    });
  });

  test("returns triple nested aggregated stats", async () => {
    const { req, res } = createMocks({
      headers: { authorization: `Bearer ${createToken(APPLICATION_KEY)}` },
      method: "GET",
      query: { aggregate: "department.currency.subDepartment" },
    });

    await handleStats(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      Banking: {
        USD: {
          Loan: {
            avg: "90000.00",
            count: 1,
            max: "90000.00",
            min: "90000.00",
          },
        },
      },
      Engineering: {
        USD: {
          Frontend: {
            avg: "145000.00",
            count: 1,
            max: "145000.00",
            min: "145000.00",
          },
        },
      },
    });
  });

  test("returns filtered stats", async () => {
    const { req, res } = createMocks({
      headers: { authorization: `Bearer ${createToken(APPLICATION_KEY)}` },
      method: "GET",
      query: {
        ["filter[department]"]: "Banking",
        ["filter[onContract]"]: "true",
      },
    });

    await handleStats(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      data: {
        avg: "90000.00",
        count: 1,
        max: "90000.00",
        min: "90000.00",
      },
    });
  });
});
