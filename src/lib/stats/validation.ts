import type { Agent } from "@prisma/client";

import { toBool } from "../api";
import { badRequest } from "../api/errors";
import { head } from "../required";

const AGGREGATES = ["currency", "department", "subDepartment"] as const;
export type Aggregate = keyof Agent & typeof AGGREGATES[number];

const CALCULATION_FIELDS = ["salary"] as const;
export type CalculationField = keyof Agent & typeof CALCULATION_FIELDS[number];

const CURRENCIES = ["EUR", "INR", "USD"] as const;
export type Currency = typeof CURRENCIES[number];

const FILTERS = ["department", "onContract"] as const;
export type Filter = keyof Agent & typeof FILTERS[number];

const FILTER_REGEX = /^filter\[(.+)\]$/g;

type Query = Partial<{ [key: string]: string | string[] }>;

export function validateAggregate(val?: string | string[]) {
  const aggregate = head(val);
  const uniqueParts = Array.from(
    new Set(aggregate?.split(".") ?? [])
  ) as Aggregate[];
  for (const part of uniqueParts) {
    if (!AGGREGATES.includes(part)) {
      badRequest({ actual: part, expected: AGGREGATES, name: "aggregate" });
    }
  }

  return uniqueParts;
}

export function validateCalculationField(val?: string | string[]) {
  const calculationField = head(val) as CalculationField;
  if (
    calculationField != null &&
    !CALCULATION_FIELDS.includes(calculationField)
  ) {
    badRequest({
      actual: calculationField,
      expected: CALCULATION_FIELDS,
      name: "calculationField",
    });
  }

  return calculationField;
}

export function validateCurrency(val?: string | string[]) {
  const currency = head(val) as Currency;
  if (currency != null && !CURRENCIES.includes(currency)) {
    badRequest({ actual: currency, expected: CURRENCIES, name: "currency" });
  }

  return currency;
}

export function validateFilters(query: Query) {
  Object.keys(query).forEach((key) => {
    for (const match of Array.from(key.matchAll(FILTER_REGEX))) {
      const filter = match[1] as Filter;
      if (filter != null && !FILTERS.includes(filter)) {
        badRequest({ actual: filter, expected: FILTERS, name: "filter" });
      }
    }
  });

  const onContract = head(query["filter[onContract]"]);
  const departments = query["filter[department]"];
  return {
    departments: getDepartment(departments),
    onContract: onContract != null ? toBool(onContract) : undefined,
  };
}

function getDepartment(val?: string | string[]) {
  if (val == null) return undefined;
  if (Array.isArray(val)) return val;

  return [val];
}
