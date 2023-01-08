import { NextApiResponse } from "next";

export enum StatusCode {
  BadRequest = 400,
  UnsupportedMediaType = 415,
  InternalServerError = 500,
}

export type ApiErrorReq = Readonly<{
  errors?: Readonly<{ detail: string }>[];
  res: NextApiResponse;
  status: StatusCode;
}>;

export function apiError({ errors, res, status }: ApiErrorReq) {
  res.status(status).json({ code: StatusCode[status], status, errors });
}
