import { head, required } from "@/lib/required";

describe(required, () => {
  it("returns value if defined", () => {
    const exp = "value";
    expect(required("name", exp)).toBe(exp);
  });

  it("throws if undefined", () => {
    const name = "name";
    expect(() => required(name)).toThrowError(`${name} required`);
  });
});

describe(head, () => {
  it("returns head of array", () => {
    const exp = "value";
    expect(head([exp, "value2"])).toBe(exp);
  });

  it("returns value if not array", () => {
    const exp = "value";
    expect(head(exp)).toBe(exp);
  });

  it("returns undefined if undefined", () => {
    expect(head()).toBeUndefined();
  });
});
