import { NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";

export enum StatusCode {
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  UnsupportedMediaType = 415,
  InternalServerError = 500,
}

export const ERRORS = {
  badRequest: (message: string) => new ApiError(StatusCode.BadRequest, message),
  notFound: new ApiError(StatusCode.NotFound, ""),
  unauthorizedInvalid: new ApiError(
    StatusCode.Unauthorized,
    "Invalid header: 'authorization'; expected 'Bearer <token>'"
  ),
  unauthorizedInvalidOrExpired: new ApiError(
    StatusCode.Unauthorized,
    "Invalid or expired: 'token'"
  ),
  unauthorizedMissingHeader: new ApiError(
    StatusCode.Unauthorized,
    "Required header: 'authorization'"
  ),
};

export type ApiErrorReq = Readonly<{
  errors?: Readonly<{ detail: string }>[];
  res: NextApiResponse;
  status: StatusCode;
}>;

export function badRequest({
  actual,
  expected,
  name,
}: Readonly<{
  actual: string;
  expected: readonly string[];
  name: string;
}>) {
  throw ERRORS.badRequest(
    `Invalid: '${name}'; expected one of '${expected.join(
      ","
    )}', received '${actual}'`
  );
}

export function apiError({ errors, res, status }: ApiErrorReq) {
  res.status(status).json({ code: StatusCode[status], status, errors });
}
