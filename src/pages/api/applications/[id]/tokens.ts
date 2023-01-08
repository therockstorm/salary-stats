import type { NextApiRequest, NextApiResponse } from "next";

import { parseBody, toPathId } from "@/lib/api";
import { ERRORS } from "@/lib/api/errors";
import { METHODS, withErrorHandling } from "@/lib/api/middleware";
import { verify } from "@/lib/crypto";
import { head } from "@/lib/required";
import {
  getApplicationByIdWithSecret,
  validateToken,
} from "@/lib/storage/applications";
import { createToken } from "@/lib/tokens";

export default withErrorHandling(
  function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === METHODS.post) return post(req, res);
  },
  [METHODS.post]
);

async function post(req: NextApiRequest, res: NextApiResponse) {
  const body = validateToken(parseBody(req.body));
  const id = head(req.query.id);
  const application = await getApplicationByIdWithSecret(toPathId(id));
  if (application == null) throw ERRORS.notFound;

  if (await verify(application.secret, body.secret)) {
    return res.status(200).json({ token: createToken(application.key) });
  } else throw ERRORS.badRequest("Invalid: 'secret'");
}
