import { sign, verify } from "jsonwebtoken";

import { ERRORS } from "./api/errors";
import { required } from "./required";

const TOKEN_SECRET = required("TOKEN_SECRET", process.env.TOKEN_SECRET);

export function createToken(key: string) {
  return sign({ key }, TOKEN_SECRET, {
    expiresIn: "30m",
  });
}

export async function verifyToken(authorization?: string) {
  if (authorization == null) throw ERRORS.unauthorizedMissingHeader;

  if (authorization.startsWith("Bearer ")) {
    const parts = authorization?.split(" ");
    if (parts.length !== 2) throw ERRORS.unauthorizedInvalid;

    return new Promise((resolve, reject) =>
      verify(parts[1], TOKEN_SECRET, (err, token) => {
        return err
          ? reject(ERRORS.unauthorizedInvalidOrExpired)
          : resolve(token);
      })
    );
  } else throw ERRORS.unauthorizedInvalid;
}
