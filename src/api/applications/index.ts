import type { NextApiRequest, NextApiResponse } from "next";

import { METHODS, parseBody } from "@/lib/api";
import {
  createApplication,
  validateApplication,
} from "@/lib/storage/applications";

export default function handleApplications(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === METHODS.post) return post(req, res);
}

async function post(req: NextApiRequest, res: NextApiResponse) {
  const application = await createApplication(
    validateApplication(parseBody(req.body))
  );
  return res.status(200).json(application);
}
