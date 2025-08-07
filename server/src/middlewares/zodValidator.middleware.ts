import { HTTPException } from "hono/http-exception";
import { zValidator as zv } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { ZodType } from "zod/v4";

export const customZValidator = <T extends ZodType, Target extends keyof ValidationTargets>(
  target: Target,
  schema: T
) => {
  return zv(target, schema, (result) => {
    if (!result.success) {
      const errorDetails = result.error.issues.map(issue => ({
        field: issue.path.join('.') || 'root',
        message: issue.message,
        code: issue.code
      }));

      console.error('Validation failed:', errorDetails);

      throw new HTTPException(400, {
        message: `Validation failed: ${errorDetails.map(e => `${e.field}: ${e.message}`).join(', ')}`
      });
    }
  })
};
