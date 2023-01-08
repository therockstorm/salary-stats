import { createMocks } from "node-mocks-http";

import { ERRORS } from "@/__tests__/constants";
import handle404 from "@/pages/api/[[...404]]";

describe("GET /api/applications/:id", () => {
  test("returns 404", async () => {
    const expected = ERRORS.notFound;
    const { req, res } = createMocks({ method: "GET" });

    await handle404(req, res);

    expect(res._getStatusCode()).toBe(expected.status);
    expect(JSON.parse(res._getData())).toEqual(expected);
  });

  test("returns 415 if invalid method", async () => {
    const expected = ERRORS.unsupportedMediaType;
    const { req, res } = createMocks({ method: "PUT" });

    await handle404(req, res);

    expect(res._getStatusCode()).toBe(expected.status);
    expect(JSON.parse(res._getData())).toEqual(expected);
  });
});
