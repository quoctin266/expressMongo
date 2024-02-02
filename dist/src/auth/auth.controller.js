"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("./auth.service"));
require("dotenv").config();
class AuthController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield auth_service_1.default.registerNewUser(req.body);
            res.status(result.status).json(result);
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield auth_service_1.default.loginUser(req.body, res);
            res.status(result.status).json(result);
        });
    }
    static googleAuth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield auth_service_1.default.googleAuth(req.body, res);
            res.status(result.status).json(result);
        });
    }
    static logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = req.user;
            let result = yield auth_service_1.default.logoutUser(user, res);
            res.status(result.status).json(result);
        });
    }
    static getNewToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // let refreshToken: string = req.cookies["refresh_token"];
            const { refreshToken } = req.body;
            let result = yield auth_service_1.default.processNewToken(refreshToken, res);
            res.status(result.status).json(result);
        });
    }
    static verifyPW(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, currentPassword, } = req.body;
            let result = yield auth_service_1.default.verifyPassword(userId, currentPassword);
            res.status(result.status).json(result);
        });
    }
    static changePW(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, newPassword, confirmNewPassword, } = req.body;
            let result = yield auth_service_1.default.changePassword(userId, newPassword, confirmNewPassword);
            res.status(result.status).json(result);
        });
    }
    static checkOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const { otp } = req.body;
            let result = yield auth_service_1.default.checkOtp(userId, otp);
            res.status(result.status).json(result);
        });
    }
    static resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            yield auth_service_1.default.resendOtp(userId);
            res.status(200).json({
                status: 200,
            });
        });
    }
    static forgetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            let result = yield auth_service_1.default.forgetPassword(email);
            res.status(result.status).json(result);
        });
    }
    static verifyRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { requestId } = req.query;
            const frontendDomain = process.env.NODE_ENV === "development"
                ? process.env.FRONTEND_DOMAIN_DEVELOPMENT
                : process.env.FRONTEND_DOMAIN_PRODUCTION;
            let result = yield auth_service_1.default.verifyRequest(requestId);
            if (result.status === 200)
                res.redirect(`${frontendDomain}/set-new-password?userId=${result.userId}`);
            else
                res.redirect(`${frontendDomain}/broken-link`);
        });
    }
}
exports.default = AuthController;
