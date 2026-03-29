import { Request, Response, NextFunction } from "express"
import { ObjectSchema } from "joi";
/**
 * validateRequest(schema, property)

 * Validates req[property] against the given Joi schema.
 * @param {import('joi').ObjectSchema} schema - Joi schema to validate against
 * @param {"body"|"query"|"params"} property - property of req to validate

 * On success: assigns validated value to req[property] and calls next()
 * On failure: returns 400 with { success, message, errors } format
 */
type Property = "body" | "query" | "params";


export function validateRequest(schema: ObjectSchema, property: Property) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      const value = req[property];// "body" | "params"
      const validated = await schema.validateAsync(value, {
        abortEarly: false,
        stripUnknown: true,
      });
      req[property] = validated;
      next();
    } catch (error) {
      const err = error as {
        details?: Array<{ path: string[]; message: string }>
      }
      if (err.details && Array.isArray(err.details)) {
        const errors = err.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        }));
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors,
        });
      }
      next(error);
    }
  };
}
