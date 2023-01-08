export function required<T>(name: string, val?: T): T | never {
  return val || thrw(`${name} required`);
}

export function head<T>(val?: T | readonly T[]): T | undefined {
  return Array.isArray(val) ? val[0] : val ?? undefined;
}

function thrw(error: string): never {
  throw new Error(error);
}
