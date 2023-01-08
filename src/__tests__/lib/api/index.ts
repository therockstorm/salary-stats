import { parseBody } from "@/lib/api";

describe(parseBody, () => {
  it("returns parsed value", () => {
    const exp = { hi: "there" };
    expect(parseBody(JSON.stringify(exp))).toEqual(exp);
  });

  it("returns value if already parsed", () => {
    const exp = { hi: "there" };
    expect(parseBody(exp as unknown as string)).toBe(exp);
  });

  it("returns empty object if undefined", () => {
    expect(parseBody(undefined as unknown as string)).toEqual({});
  });
});
