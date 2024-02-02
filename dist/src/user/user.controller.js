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
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("./user.service"));
class UserController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield user_service_1.default.createNewUser(req.body);
            res.status(result.status).json(result);
        });
    }
    static getDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            let result = yield user_service_1.default.getDetail(id);
            res.status(result.status).json(result);
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            let result = yield user_service_1.default.updateUser(id, req.body);
            res.status(result.status).json(result);
        });
    }
    static getUsersList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = req.query, { pageIndex, pageSize } = _a, filter = __rest(_a, ["pageIndex", "pageSize"]);
            let result = yield user_service_1.default.getList(filter, +pageIndex, +pageSize);
            res.status(result.status).json(result);
        });
    }
}
exports.default = UserController;
