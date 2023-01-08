import type { NextApiRequest, NextApiResponse } from "next";

import { toPathId } from "@/lib/api";
import { ERRORS } from "@/lib/api/errors";
import { METHODS, withErrorHandling, withToken } from "@/lib/api/middleware";
import { head } from "@/lib/required";
import { getApplicationById } from "@/lib/storage/applications";

export default withErrorHandling(
  withToken(function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === METHODS.get) return get(req, res);
  }),
  [METHODS.get]
);

async function get(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json(await getApplication(req));
}

async function getApplication(req: NextApiRequest) {
  const id = head(req.query.id);
  const application = await getApplicationById(toPathId(id));
  if (application == null) throw ERRORS.notFound;

  return application;
}
