import { ERRORS } from "@/lib/api/errors";
import { METHODS, withErrorHandling } from "@/lib/api/middleware";

export default withErrorHandling(() => {
  throw ERRORS.notFound;
}, [METHODS.delete, METHODS.get, METHODS.post]);
