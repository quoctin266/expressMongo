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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../custom/AppError"));
const jwt_service_1 = require("../middleware/jwt.service");
const user_schema_1 = __importDefault(require("../user/schema/user.schema"));
const user_service_1 = __importDefault(require("../user/user.service"));
const mail_config_1 = require("../util/mail.config");
const passReset_schema_1 = __importDefault(require("./schema/passReset.schema"));
const moment_1 = __importDefault(require("moment"));
require("dotenv").config();
const frontendDomain = process.env.NODE_ENV === "development"
    ? process.env.FRONTEND_DOMAIN_DEVELOPMENT
    : process.env.FRONTEND_DOMAIN_PRODUCTION;
class AuthService {
}
_a = AuthService;
AuthService.registerNewUser = (registerUserDto) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = registerUserDto;
    let existUser = yield user_schema_1.default.findOne({ email }).exec();
    if (existUser)
        throw new AppError_1.default("Email already exist", 409);
    const hashPassword = yield user_service_1.default.hashPassword(password);
    registerUserDto.password = hashPassword;
    let result = yield user_schema_1.default.create(Object.assign(Object.assign({}, registerUserDto), { status: 0 }));
    yield _a.sendMailOtp(email);
    return {
        status: 200,
        message: "Register successfully",
        data: result,
    };
});
AuthService.validateUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    let user = yield user_schema_1.default.findOne({ email }).select("+password").exec();
    if (user) {
        const checkPW = yield user_service_1.default.checkPassword(user.password, password);
        if (checkPW === true) {
            const result = {
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                status: user.status,
                dob: (_b = user.dob) === null || _b === void 0 ? void 0 : _b.toISOString(),
                phone: user.phone,
                address: user.address,
                googleAuth: user.googleAuth,
            };
            return result;
        }
    }
    return null;
});
AuthService.loginUser = (loginUserDto, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = loginUserDto;
    const payload = yield _a.validateUser(email, password);
    if (!payload)
        throw new AppError_1.default("Invalid email or password", 401);
    const accessToken = (0, jwt_service_1.createJWT)(payload, process.env.JWT_ACCESS_TOKEN, process.env.JWT_ACCESS_EXPIRE);
    // update new refresh token for user
    const refreshToken = (0, jwt_service_1.createJWT)(payload, process.env.JWT_REFRESH_TOKEN, process.env.JWT_REFRESH_EXPIRE);
    if (refreshToken)
        yield user_service_1.default.updateToken(refreshToken, payload.id);
    // res.cookie("refresh_token", refreshToken, {
    //   httpOnly: true,
    //   maxAge: ms(process.env.JWT_REFRESH_EXPIRE as string),
    // });
    return {
        status: 200,
        message: "Login successfully",
        data: {
            accessToken,
            refreshToken,
            userCredentials: payload,
        },
    };
});
AuthService.googleAuth = (googleAuthDto, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, firstName, lastName } = googleAuthDto;
    let user = yield user_schema_1.default.findOne({ email }).exec();
    let payload = {
        id: "",
        username: "",
        email: "",
        role: 1,
        status: 1,
        googleAuth: true,
    };
    if (!user) {
        let result = yield user_schema_1.default.create(Object.assign(Object.assign({}, googleAuthDto), { googleAuth: true, status: 1 }));
        payload.id = result.id;
        payload.email = email;
        payload.username = username;
        payload.firstName = firstName;
        payload.lastName = lastName;
    }
    else {
        payload.id = user.id;
        payload.email = user.email;
        payload.username = user.username;
        payload.firstName = user.firstName;
        payload.lastName = user.lastName;
        payload.role = user.role;
    }
    const accessToken = (0, jwt_service_1.createJWT)(payload, process.env.JWT_ACCESS_TOKEN, process.env.JWT_ACCESS_EXPIRE);
    // update new refresh token for user
    const refreshToken = (0, jwt_service_1.createJWT)(payload, process.env.JWT_REFRESH_TOKEN, process.env.JWT_REFRESH_EXPIRE);
    if (refreshToken)
        yield user_service_1.default.updateToken(refreshToken, payload.id);
    // res.cookie("refresh_token", refreshToken, {
    //   httpOnly: true,
    //   maxAge: ms(process.env.JWT_REFRESH_EXPIRE as string),
    // });
    return {
        status: 200,
        message: "Login successfully",
        data: {
            accessToken,
            refreshToken,
            userCredentials: payload,
        },
    };
});
AuthService.logoutUser = (user, res) => __awaiter(void 0, void 0, void 0, function* () {
    // res.clearCookie("refresh_token");
    yield user_service_1.default.updateToken("", user.id);
    return {
        status: 200,
        message: "Logout successfully",
        data: null,
    };
});
AuthService.processNewToken = (refreshToken, response) => __awaiter(void 0, void 0, void 0, function* () {
    let payload = (0, jwt_service_1.verifyJWT)(refreshToken, process.env.JWT_REFRESH_TOKEN);
    if (!payload)
        throw new AppError_1.default("Invalid refresh token", 400);
    const newAccessToken = (0, jwt_service_1.createJWT)(payload, process.env.JWT_ACCESS_TOKEN, process.env.JWT_ACCESS_EXPIRE);
    // update new refresh token for user
    const newRefreshToken = (0, jwt_service_1.createJWT)(payload, process.env.JWT_REFRESH_TOKEN, process.env.JWT_REFRESH_EXPIRE);
    if (newRefreshToken)
        yield user_service_1.default.updateToken(newRefreshToken, payload.id);
    // response.clearCookie("refresh_token");
    // response.cookie("refresh_token", newRefreshToken, {
    //   httpOnly: true,
    //   maxAge: ms(process.env.JWT_REFRESH_EXPIRE as string),
    // });
    return {
        status: 200,
        message: "Get new token successfully",
        data: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            userCredentials: payload,
        },
    };
});
AuthService.verifyPassword = (id, password) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield user_schema_1.default.findById(id).select("+password").exec();
    if (user) {
        const checkPW = yield user_service_1.default.checkPassword(user.password, password);
        if (!checkPW)
            throw new AppError_1.default("Incorrect password", 401);
    }
    return {
        status: 200,
        message: "Pasword verified",
        data: null,
    };
});
AuthService.changePassword = (id, newPassword, confirmPW) => __awaiter(void 0, void 0, void 0, function* () {
    if (newPassword !== confirmPW)
        throw new AppError_1.default("Passwords do not match", 400);
    const hashPassword = yield user_service_1.default.hashPassword(newPassword);
    let res = yield user_schema_1.default.findByIdAndUpdate(id, { password: hashPassword });
    return {
        status: 200,
        message: "Update password succesfully",
        data: res,
    };
});
AuthService.sendMailOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield user_schema_1.default.findOne({ email });
    let otp = Math.floor(Math.random() * 899999 + 100000);
    yield user_schema_1.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, { otp });
    let template = "otp.ejs";
    let subject = "Active your account";
    let context = {
        otp: otp,
        username: user === null || user === void 0 ? void 0 : user.username,
        redirectUrl: `${frontendDomain}/verify-account?userId=${user === null || user === void 0 ? void 0 : user._id}`,
    };
    yield (0, mail_config_1.sendMail)(template, context, email, subject);
});
AuthService.resendOtp = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield user_schema_1.default.findById(userId);
    let otp = Math.floor(Math.random() * 899999 + 100000);
    yield user_schema_1.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, { otp });
    let template = "otp.ejs";
    let subject = "Active your account";
    let context = {
        otp: otp,
        username: user === null || user === void 0 ? void 0 : user.username,
        redirectUrl: `${frontendDomain}/verify-account?userId=${user === null || user === void 0 ? void 0 : user._id}`,
    };
    yield (0, mail_config_1.sendMail)(template, context, user === null || user === void 0 ? void 0 : user.email, subject);
});
AuthService.checkOtp = (userId, otp) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield user_schema_1.default.findById(userId);
    if ((user === null || user === void 0 ? void 0 : user.otp) !== +otp)
        throw new AppError_1.default("Invalid otp", 401);
    yield user_schema_1.default.findByIdAndUpdate(userId, { status: 1 });
    return {
        status: 200,
        message: "Account verified",
        data: null,
    };
});
AuthService.forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield user_schema_1.default.findOne({ email }).exec();
    if (!user)
        throw new AppError_1.default("Email not found", 404);
    let res = yield passReset_schema_1.default.create({ userId: user._id });
    const backendDomain = process.env.NODE_ENV === "development"
        ? process.env.BACKEND_DOMAIN_DEVELOPMENT
        : process.env.BACKEND_DOMAIN_PRODUCTION;
    let template = "resetRequest.ejs";
    let subject = "Reset password";
    let context = {
        url: `${backendDomain}/api/v1/auth/verify-request?requestId=${res._id}`,
    };
    yield (0, mail_config_1.sendMail)(template, context, email, subject);
    return {
        status: 201,
        message: "Send request succesfully",
        data: null,
    };
});
AuthService.verifyRequest = (requestId) => __awaiter(void 0, void 0, void 0, function* () {
    let request = yield passReset_schema_1.default.findById(requestId)
        .select("+createdAt")
        .exec();
    if (!request)
        return { status: 404 };
    let hours = (0, moment_1.default)().diff((0, moment_1.default)(request === null || request === void 0 ? void 0 : request.createdAt), "hours");
    if (hours > 24)
        return { status: 400 };
    return {
        status: 200,
        userId: request.userId,
    };
});
exports.default = AuthService;
