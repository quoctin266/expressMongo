import { NextFunction, Request, Response } from "express";
import { IUser } from "../user/user.interface";
import AppError from "../custom/AppError";

const userAllowRoutes = [
  { path: "/players", method: "GET" },
  { path: "/nations", method: "GET" },
  { path: "/comments", method: "GET" },
  { path: "/comments", method: "POST" },
  { path: "/comments", method: "PATCH" },
  { path: "/comments", method: "DELETE" },

  { path: "/users", method: "PATCH" },

  { path: "/auth/login", method: "POST" },
  { path: "/auth/register", method: "POST" },
  { path: "/auth/google-login", method: "POST" },
  { path: "/auth/refresh", method: "POST" },
  { path: "/auth/reset-password", method: "POST" },
  { path: "/auth/logout", method: "POST" },
];

export const checkRoleMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let user: IUser = (req as any).user;
  if (user) {
    if (user.role !== 0) {
      let allow = userAllowRoutes.some((item) => {
        return req.path.startsWith(item.path) && item.method === req.method;
      });

      if (allow) next();
      else throw new AppError("Not found", 404);
    } else next();
  } else next();
};
