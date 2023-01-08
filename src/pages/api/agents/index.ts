import type { NextApiRequest, NextApiResponse } from "next";

import { parseBody } from "@/lib/api";
import { METHODS, withErrorHandling, withToken } from "@/lib/api/middleware";
import { createAgent, getAgents, validateAgent } from "@/lib/storage/agents";

export default withErrorHandling(
  withToken(function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === METHODS.post) return post(req, res);
    if (req.method === METHODS.get) return get(req, res);
  }),
  [METHODS.delete, METHODS.get, METHODS.post]
);

async function post(req: NextApiRequest, res: NextApiResponse) {
  const agent = await createAgent(validateAgent(parseBody(req.body)));
  return res.status(200).json(agent);
}

async function get(_req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json(await getAgents());
}
