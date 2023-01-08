import type { NextApiRequest, NextApiResponse } from "next";

import { toPathId } from "@/lib/api";
import { ERRORS } from "@/lib/api/errors";
import { METHODS, withErrorHandling, withToken } from "@/lib/api/middleware";
import { head } from "@/lib/required";
import { deleteAgent, getAgentById } from "@/lib/storage/agents";

export default withErrorHandling(
  withToken(function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === METHODS.get) return get(req, res);
    if (req.method === METHODS.delete) return del(req, res);
  }),
  [METHODS.delete, METHODS.get]
);

async function get(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json(await getAgent(req));
}

async function del(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json(await deleteAgent((await getAgent(req)).id));
}

async function getAgent(req: NextApiRequest) {
  const id = head(req.query.id);
  const agent = await getAgentById(toPathId(id));
  if (agent == null) throw ERRORS.notFound;

  return agent;
}
