import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Define the validation schema for the request body
const userSchema = Joi.object({
  id: Joi.string().required(),
  farmer: Joi.boolean().required(),
  buyer: Joi.boolean().required(),
  isRegistered: Joi.boolean().required(),
  isVerified: Joi.boolean().required(),
  governmentId: Joi.string().allow("").required(),
  treasuryBalance: Joi.number().allow(0).required(),
  claimTimestamp: Joi.number().required(),
});

type PropertySchemaMap = {
  [key: string]:
    | Joi.BooleanSchema<boolean>
    | Joi.NumberSchema<number>
    | Joi.StringSchema<string>;
};
const propertySchemaMap: PropertySchemaMap = {
  id: Joi.string().required(),
  farmer: Joi.boolean().required(),
  buyer: Joi.boolean().required(),
  registered: Joi.boolean().required(),
  verified: Joi.boolean().required(),
  governmentId: Joi.string().allow("").required(),
  treasuryBalance: Joi.number().allow(0).required(),
  claimTimestamp: Joi.number().required(),
};

// Middleware function for validating request body
export const validateRequestBodyUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    // Invalid request body
    return res.status(400).json({ error: error.details[0].message });
  }

  // Request body is valid
  next();
};

export const validateProperty = (property: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = propertySchemaMap[property].validate(req.body[property]);

    if (error) {
      // Invalid property value
      return res.status(400).json({ error: error.details[0].message });
    }

    // Property value is valid
    next();
  };
};
