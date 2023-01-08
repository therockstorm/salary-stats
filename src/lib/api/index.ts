import { ERRORS } from "./errors";

export function parseBody(body: string) {
  if (body == null) return {};
  if (typeof body === "string") return JSON.parse(body);

  return body;
}

export function toPathId(val?: string) {
  const idAsNum = parseInt(val as string, 10);
  if (isNaN(idAsNum)) throw ERRORS.notFound;

  return idAsNum;
}

export function toBool(val?: string) {
  return val?.toLowerCase() === "true";
}
