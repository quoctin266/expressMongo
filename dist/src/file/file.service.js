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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importStar(require("path"));
const fs_1 = __importDefault(require("fs"));
const node_fs_1 = require("node:fs");
const promises_1 = require("node:fs/promises");
const AppError_1 = __importDefault(require("../custom/AppError"));
const acceptTypes = [
    "image/png",
    "image/jpeg",
    "text/plain",
    "video/mp4",
    "video/webm",
];
class FileService {
    static findFilePath(fileName, directoryPath = __dirname) {
        const files = fs_1.default.readdirSync(directoryPath);
        for (const file of files) {
            const filePath = path_1.default.join(directoryPath, file);
            const stats = fs_1.default.statSync(filePath);
            if (stats.isDirectory()) {
                // Recursively search in subdirectories
                const subdirectoryPath = path_1.default.join(directoryPath, file);
                const foundPath = this.findFilePath(fileName, subdirectoryPath);
                if (foundPath) {
                    return foundPath;
                }
            }
            else if (stats.isFile() && file === fileName) {
                // Check if the current file matches the target fileName
                return filePath;
            }
        }
        // File not found
        return null;
    }
}
_a = FileService;
// get root directory of project
FileService.getRootPath = () => {
    return process.cwd();
};
FileService.createPath = (req, file) => {
    var _b, _c, _d, _e;
    const folderType = (_c = (_b = req.headers) === null || _b === void 0 ? void 0 : _b.folder_type) !== null && _c !== void 0 ? _c : "others";
    const folderName = (_e = (_d = req.headers) === null || _d === void 0 ? void 0 : _d.folder_name) !== null && _e !== void 0 ? _e : "default";
    const extName = path_1.default.extname(file.name);
    const baseName = path_1.default.basename(file.name, extName);
    const fileName = baseName + "_" + new Date().getTime() + extName;
    const uploadPath = (0, path_1.join)(_a.getRootPath(), `public/${folderType}/${folderName}/` + fileName);
    return { uploadPath, fileName };
};
FileService.createFileLink = (fileName) => {
    var _b;
    const backendDomain = process.env.NODE_ENV === "development"
        ? process.env.BACKEND_DOMAIN_DEVELOPMENT
        : process.env.BACKEND_DOMAIN_PRODUCTION;
    return (backendDomain +
        ((_b = _a.findFilePath(fileName, (0, path_1.join)(_a.getRootPath(), "public"))) === null || _b === void 0 ? void 0 : _b.replace((0, path_1.join)(_a.getRootPath(), "public"), "")));
};
FileService.uploadFile = (req, file) => __awaiter(void 0, void 0, void 0, function* () {
    if (!acceptTypes.includes(file.mimetype))
        throw new AppError_1.default("Invalid file type. Expected type: image/jpeg|image/png|text/plain|video/mp4|video/webm", 422);
    if (file.size > 1024 * 1024 * 30)
        throw new AppError_1.default("Max size allowed is 30mb", 400);
    const { uploadPath, fileName } = _a.createPath(req, file);
    yield file.mv(uploadPath);
    return {
        status: 201,
        message: "Upload succesfully",
        data: {
            fileName,
            // originalName: file.name,
            error: null,
        },
    };
});
FileService.removeFile = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = _a.findFilePath(fileName, (0, path_1.join)(_a.getRootPath(), "public"));
    if ((0, node_fs_1.existsSync)(filePath)) {
        yield (0, promises_1.unlink)(filePath);
        return {
            status: 200,
            message: "Remove file successfully",
            data: {
                fileDeleted: fileName,
            },
        };
    }
    else
        return {
            status: 404,
            message: "File not found",
            data: {
                fileDeleted: null,
            },
        };
});
exports.default = FileService;
