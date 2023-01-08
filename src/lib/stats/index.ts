import type { Agent } from "@prisma/client";

import { Aggregate, CalculationField, Currency } from "./validation";

type RunningStats = { min: number; max: number; total: number; count: number };
type Stats = { min: string; max: string; avg: string; count: number };
type CalculateSummaryStatsReq = Readonly<{
  agents: Agent[];
  aggregates: Aggregate[];
  calculationField?: CalculationField;
  currency?: Currency;
}>;

// In real life, this would come from a reliable external API.
const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.95,
  INR: 82.61,
};

export function calculateSummaryStats({
  agents,
  aggregates,
  calculationField = "salary",
  currency,
}: CalculateSummaryStatsReq) {
  const stats: Record<string, RunningStats> = {};
  for (const agent of agents) {
    const group =
      aggregates.length > 0
        ? aggregates.map((a) => agent[a]).join(".")
        : "data";
    if (stats[group] == null) {
      stats[group] = { min: Infinity, max: -Infinity, total: 0, count: 0 };
    }

    // Salary is the only numeric field so `else` clause never executes.
    /* istanbul ignore next */
    const calcField =
      calculationField === "salary"
        ? convertCurrency(
            parseInt(agent.salary, 10),
            agent.currency as Currency,
            currency
          )
        : agent[calculationField];
    stats[group].min = Math.min(calcField, stats[group].min);
    stats[group].max = Math.max(calcField, stats[group].max);
    stats[group].total += calcField;
    stats[group].count += 1;
  }

  return nestStatsBasedOnAggregates(stats);
}

function nestStatsBasedOnAggregates(
  runningStats: Record<string, RunningStats>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stats: Record<string, any> = {};
  Object.keys(runningStats).forEach((group) => {
    const groups = group.split(".");
    const calc: Stats = {
      min: format(runningStats[group].min),
      max: format(runningStats[group].max),
      avg: format(runningStats[group].total / runningStats[group].count),
      count: runningStats[group].count,
    };

    if (groups.length === 1) {
      stats[group] = calc;
    } else if (groups.length === 2) {
      const [first, second] = groups;
      if (stats[first] == null) stats[first] = {};
      stats[first][second] = calc;
    } else if (groups.length === 3) {
      const [first, second, third] = groups;
      if (stats[first] == null) stats[first] = {};
      if (stats[first][second] == null) stats[first][second] = {};
      stats[first][second][third] = calc;
    }
  });

  return stats;
}

function format(val: number) {
  return val.toFixed(2);
}

function convertCurrency(amount: number, from: Currency, to?: Currency) {
  if (from === to || to == null) return amount;

  return (amount * EXCHANGE_RATES[to]) / EXCHANGE_RATES[from];
}
