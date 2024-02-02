"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserJWT = exports.verifyJWT = exports.createJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = __importDefault(require("../custom/AppError"));
require("dotenv").config();
const nonSecurePaths = [
    { path: "/players", method: "GET" },
    { path: "/nations", method: "GET" },
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
const extractToken = (req) => {
    if (req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer") {
        return req.headers.authorization.split(" ")[1];
    }
    return null;
};
const createJWT = (payload, secret, expireTime) => {
    let token = null;
    try {
        token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: expireTime });
    }
    catch (e) {
        console.log(e);
    }
    return token;
};
exports.createJWT = createJWT;
const verifyJWT = (token, secret) => {
    let data = null;
    try {
        data = jsonwebtoken_1.default.verify(token, secret, { ignoreExpiration: false });
        delete data.exp;
        delete data.iat;
    }
    catch (e) {
        console.log(e);
    }
    return data;
};
exports.verifyJWT = verifyJWT;
const checkUserJWT = (req, res, next) => {
    let allow = nonSecurePaths.some((item) => {
        return req.path.startsWith(item.path) && item.method === req.method;
    });
    if (allow)
        return next();
    if (req.public)
        return next();
    const accessToken = extractToken(req);
    if (accessToken) {
        let decoded = (0, exports.verifyJWT)(accessToken, process.env.JWT_ACCESS_TOKEN);
        if (decoded) {
            req.user = decoded;
            return next();
        }
    }
    throw new AppError_1.default("Invalid token", 401);
};
exports.checkUserJWT = checkUserJWT;
