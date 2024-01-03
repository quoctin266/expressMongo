import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ValidateError, { errorObj } from "../custom/ValidationError";

export const validateError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validateResult = validationResult(req);
  if (!validateResult.isEmpty()) {
    const errorArray: errorObj[] = validateResult.array().map((error: any) => {
      return {
        message: error.msg,
        field: error.path,
      };
    });
    throw new ValidateError("Validation fail", 400, errorArray);
  }

  next();
};
