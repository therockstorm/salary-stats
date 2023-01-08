import { parseBody, toBool, toPathId } from "@/lib/api";

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

describe(toPathId, () => {
  it("returns parsed value", () => {
    const exp = 1;
    expect(toPathId(exp.toString())).toEqual(exp);
  });

  it("returns undefined if invalid", () => {
    const exp = "invalid";
    expect(() => toPathId(exp)).toThrow("");
  });
});

describe(toBool, () => {
  it("returns parsed value", () => {
    const exp = true;
    expect(toBool(exp.toString())).toBe(exp);
  });

  it("returns false if not true", () => {
    const exp = "invalid";
    expect(toBool(exp)).toBe(false);
  });
});
