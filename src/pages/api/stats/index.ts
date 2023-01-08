import type { NextApiRequest, NextApiResponse } from "next";

import { METHODS, withErrorHandling, withToken } from "@/lib/api/middleware";
import { calculateSummaryStats } from "@/lib/stats";
import {
  validateAggregate,
  validateCalculationField,
  validateCurrency,
  validateFilters,
} from "@/lib/stats/validation";
import { getAgents } from "@/lib/storage/agents";

export default withErrorHandling(
  withToken(function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === METHODS.get) return get(req, res);
  }),
  [METHODS.get]
);

async function get(req: NextApiRequest, res: NextApiResponse) {
  const aggregates = validateAggregate(req.query["aggregate"]);
  const calculationField = validateCalculationField(
    req.query["calculationField"]
  );
  const currency = validateCurrency(req.query.currency);
  const filters = validateFilters(req.query);

  return res.status(200).json(
    calculateSummaryStats({
      aggregates,
      agents: await getAgents({ filters }),
      calculationField,
      currency,
    })
  );
}
