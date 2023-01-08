import argon2 from "argon2";

// See https://soatok.blog/2022/12/29/what-we-do-in-the-etc-shadow-cryptography-with-passwords/
// See https://github.com/ranisalt/node-argon2/wiki/Options
// Recommended defaults are set for all but parallelism
const OPTIONS: argon2.Options & { raw?: false } = { parallelism: 1 };

export function hash(secret: string) {
  return argon2.hash(secret, OPTIONS);
}

export function verify(hash: string, secret: string) {
  return argon2.verify(hash, secret, OPTIONS);
}
