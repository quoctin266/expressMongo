import jwt from "jsonwebtoken";
import { IUser } from "../user/user.interface";
import { NextFunction, Request, Response } from "express";
import AppError from "../custom/AppError";
require("dotenv").config();

const nonSecurePaths = [
  { path: "/players", method: "GET" },
  { path: "/nations", method: "GET" },
  { path: "/comments", method: "GET" },

  { path: "/auth/login", method: "POST" },
  { path: "/auth/register", method: "POST" },
  { path: "/auth/google-login", method: "POST" },
  { path: "/auth/refresh", method: "POST" },
  { path: "/auth/check-otp", method: "POST" },
  { path: "/auth/resend-otp", method: "GET" },
  { path: "/auth/forget-password", method: "POST" },
  { path: "/auth/verify-request", method: "GET" },
  { path: "/auth/reset-password", method: "POST" },
  { path: "/categories", method: "GET" },
  { path: "/payment/checkout", method: "GET" },
  { path: "/courses", method: "GET" },
  { path: "/users", method: "GET" },
  { path: "/readings", method: "GET" },
  { path: "/videos", method: "GET" },
  { path: "/quizes", method: "GET" },
  { path: "/feedbacks", method: "GET" },
  { path: "/sections", method: "GET" },
];

const extractToken = (req: Request) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

export const createJWT = (
  payload: IUser,
  secret: string,
  expireTime: string
) => {
  let token = null;
  try {
    token = jwt.sign(payload, secret, { expiresIn: expireTime });
  } catch (e) {
    console.log(e);
  }

  return token;
};

export const verifyJWT = (token: string, secret: string) => {
  let data = null;
  try {
    data = jwt.verify(token, secret, { ignoreExpiration: false });
    delete (data as any).exp;
    delete (data as any).iat;
  } catch (e) {
    console.log(e);
  }

  return data as IUser;
};

export const checkUserJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let allow = nonSecurePaths.some((item) => {
    return req.path.startsWith(item.path) && item.method === req.method;
  });
  if (allow) return next();
  if ((req as any).public) return next();
  const accessToken = extractToken(req);

  if (accessToken) {
    let decoded = verifyJWT(
      accessToken,
      process.env.JWT_ACCESS_TOKEN as string
    );
    if (decoded) {
      (req as any).user = decoded;
      return next();
    }
  }

  throw new AppError("Invalid token", 401);
};
