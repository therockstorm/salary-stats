import { decode } from "jsonwebtoken";

import { ERRORS } from "@/lib/api/errors";
import { createToken, verifyToken } from "@/lib/tokens";

import { APPLICATION_KEY, TOKEN_DATA } from "../constants";

describe(createToken, () => {
  test("creates token", () => {
    expect(decode(createToken(APPLICATION_KEY))).toEqual(TOKEN_DATA);
  });
});

describe(verifyToken, () => {
  test("resolves to valid data", () => {
    const token = createToken(APPLICATION_KEY);

    return expect(verifyToken(`Bearer ${token}`)).resolves.toEqual(TOKEN_DATA);
  });

  test("rejects if missing authorization header", () => {
    return expect(verifyToken()).rejects.toEqual(
      ERRORS.unauthorizedMissingHeader
    );
  });

  test("rejects if invalid authorization header", () => {
    return expect(verifyToken("invalid")).rejects.toEqual(
      ERRORS.unauthorizedInvalid
    );
  });

  test("rejects if invalid or expired token", () => {
    return expect(verifyToken("Bearer invalid")).rejects.toEqual(
      ERRORS.unauthorizedInvalidOrExpired
    );
  });

  test("rejects if invalid or expired token", () => {
    return expect(verifyToken("Bearer not valid")).rejects.toEqual(
      ERRORS.unauthorizedInvalid
    );
  });
});
