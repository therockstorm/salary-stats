import {
  validateAggregate,
  validateCalculationField,
  validateCurrency,
  validateFilters,
} from "@/lib/stats/validation";

describe(validateAggregate, () => {
  it("returns value if valid", () => {
    const exp = "department";
    expect(validateAggregate(exp)).toEqual([exp]);
  });

  it("throws if invalid", () => {
    const exp = "invalid";
    expect(() => validateAggregate(exp)).toThrow(
      `Invalid: 'aggregate'; expected one of 'currency,department,subDepartment', received '${exp}'`
    );
  });
});

describe(validateCalculationField, () => {
  it("returns value if valid", () => {
    const exp = "salary";
    expect(validateCalculationField(exp)).toEqual(exp);
  });

  it("throws if invalid", () => {
    const exp = "invalid";
    expect(() => validateCalculationField(exp)).toThrow(
      `Invalid: 'calculationField'; expected one of 'salary', received '${exp}'`
    );
  });
});

describe(validateCurrency, () => {
  it("returns value if valid", () => {
    const exp = "USD";
    expect(validateCurrency(exp)).toEqual(exp);
  });

  it("throws if invalid", () => {
    const exp = "invalid";
    expect(() => validateCurrency(exp)).toThrow(
      `Invalid: 'currency'; expected one of 'EUR,INR,USD', received '${exp}'`
    );
  });
});

describe(validateFilters, () => {
  it("returns value if valid", () => {
    const exp = { department: "Engineering", onContract: true };

    expect(
      validateFilters({
        "filter[department]": exp.department,
        "filter[onContract]": exp.onContract.toString(),
      })
    ).toEqual({ departments: [exp.department], onContract: exp.onContract });
  });

  it("returns value for multiple departments", () => {
    const exp = { department: "Engineering", department2: "HR" };

    expect(
      validateFilters({
        "filter[department]": [exp.department, exp.department2],
      })
    ).toEqual({ departments: [exp.department, exp.department2] });
  });

  it("throws if invalid", () => {
    const exp = "invalid";
    expect(() => validateFilters({ [`filter[${exp}]`]: "true" })).toThrow(
      `Invalid: 'filter'; expected one of 'department,onContract', received '${exp}'`
    );
  });
});
