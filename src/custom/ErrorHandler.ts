import { NextFunction, Request, Response } from "express";
import AppError from "./AppError";
import { MongooseError } from "mongoose";

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      error: error.message,
      data: null,
    });
  } else if (error instanceof MongooseError) {
    return res.status(400).json({
      status: 400,
      error: error.message,
      data: null,
    });
  } else {
    console.log(error);
    return res.status(500).json({
      status: 500,
      error: "Internal Server Error",
      data: null,
    });
  }
};

export default errorHandler;
