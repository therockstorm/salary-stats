import type { NextApiRequest, NextApiResponse } from "next";

import { parseBody } from "@/lib/api";
import { METHODS, withErrorHandling } from "@/lib/api/middleware";
import {
  createApplication,
  getApplications,
  validateApplication,
} from "@/lib/storage/applications";
import { verifyToken } from "@/lib/tokens";

export default withErrorHandling(
  async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === METHODS.post) return post(req, res);

    await verifyToken(req.headers.authorization);
    if (req.method === METHODS.get) return get(req, res);
  },
  [METHODS.get, METHODS.post]
);

async function post(req: NextApiRequest, res: NextApiResponse) {
  const application = await createApplication(
    validateApplication(parseBody(req.body))
  );
  return res.status(200).json(application);
}

async function get(_req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json(await getApplications());
}
