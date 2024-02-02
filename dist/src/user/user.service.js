"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const user_schema_1 = __importDefault(require("./schema/user.schema"));
const bcryptjs_1 = __importStar(require("bcryptjs"));
const AppError_1 = __importDefault(require("../custom/AppError"));
class UserService {
    static findOneByToken(refreshToken) {
        return user_schema_1.default.findOne({ refreshToken });
    }
}
_a = UserService;
UserService.hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcryptjs_1.default.genSalt(10);
    let hashPassword = yield bcryptjs_1.default.hash(password, salt);
    return hashPassword;
});
UserService.checkPassword = (hash, password) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, bcryptjs_1.compare)(password, hash);
});
UserService.updateToken = (token, id) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_schema_1.default.findByIdAndUpdate(id, { refreshToken: token });
});
UserService.createNewUser = (createUserDto) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = createUserDto;
    let existUser = yield user_schema_1.default.findOne({ email }).exec();
    if (existUser)
        throw new AppError_1.default("Email already exist", 409);
    const hashPassword = yield _a.hashPassword(password);
    createUserDto.password = hashPassword;
    let result = yield user_schema_1.default.create(Object.assign({}, createUserDto));
    return {
        status: 200,
        message: "Create new user successfully",
        data: result,
    };
});
UserService.getDetail = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let res = yield user_schema_1.default.findById(id);
    return {
        status: 200,
        message: "Get user detail successfully",
        data: res,
    };
});
UserService.updateUser = (id, updateUserDto) => __awaiter(void 0, void 0, void 0, function* () {
    let res = yield user_schema_1.default.findByIdAndUpdate(id, Object.assign({}, updateUserDto));
    return {
        status: 200,
        message: "Update user successfully",
        data: res,
    };
});
UserService.getList = (filter, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    let { searchQuery } = filter, filterUser = __rest(filter, ["searchQuery"]);
    const defaultLimit = limit ? limit : 10;
    const skip = ((page ? page : 1) - 1) * defaultLimit;
    const resultCount = (yield user_schema_1.default.find(Object.assign({ username: new RegExp(searchQuery, "i") }, filterUser))).length;
    const totalPages = Math.ceil(resultCount / defaultLimit);
    let res = yield user_schema_1.default.find(Object.assign({ username: new RegExp(searchQuery, "i") }, filterUser))
        .skip(skip)
        .limit(defaultLimit);
    return {
        status: 200,
        message: "Get user list successfully",
        data: {
            pageIndex: page ? page : 1,
            pageSize: defaultLimit,
            totalPages,
            resultCount,
            items: res,
        },
    };
});
exports.default = UserService;
