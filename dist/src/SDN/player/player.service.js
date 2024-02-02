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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../../custom/AppError"));
const file_service_1 = __importDefault(require("../../file/file.service"));
const player_schema_1 = __importDefault(require("./schema/player.schema"));
require("dotenv").config();
class PlayerService {
}
_a = PlayerService;
PlayerService.getPlayersList = () => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield player_schema_1.default.find().populate("nation").exec();
    let playerList = result.map((player) => {
        const imageUrl = file_service_1.default.createFileLink(player.img);
        const _b = player.toObject(), { img } = _b, rest = __rest(_b, ["img"]);
        return Object.assign(Object.assign({}, rest), { imageUrl });
    });
    return {
        status: 200,
        message: "Get players list successfully",
        data: playerList,
    };
});
PlayerService.createNewPlayer = (createPlayerDto) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = createPlayerDto;
    let existPlayer = yield player_schema_1.default.findOne({ name }).exec();
    if (existPlayer)
        throw new AppError_1.default("Player already exist", 409);
    let result = yield player_schema_1.default.create(Object.assign({}, createPlayerDto));
    return {
        status: 201,
        message: "Create new player successfully",
        data: result,
    };
});
PlayerService.getPlayerDetail = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let player = yield player_schema_1.default.findById(id).exec();
    if (!player)
        throw new AppError_1.default("Player not found", 404);
    const imageUrl = file_service_1.default.createFileLink(player.img);
    return {
        status: 200,
        message: "Get player detail successfully",
        data: Object.assign(Object.assign({}, player.toObject()), { imageUrl }),
    };
});
PlayerService.deletePlayer = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let player = yield player_schema_1.default.findById(id).exec();
    if (!player)
        throw new AppError_1.default("Player not found", 404);
    yield file_service_1.default.removeFile(player.img);
    let result = yield player_schema_1.default.findByIdAndDelete(id);
    return {
        status: 200,
        message: "Delete player successfully",
        data: result,
    };
});
PlayerService.updatePlayer = (id, updatePlayerDto) => __awaiter(void 0, void 0, void 0, function* () {
    let player = yield player_schema_1.default.findById(id).exec();
    if (!player)
        throw new AppError_1.default("Player not found", 404);
    // remove old image if user has new image for player
    if (updatePlayerDto.img)
        yield file_service_1.default.removeFile(player.img);
    let result = yield player_schema_1.default.findByIdAndUpdate(id, Object.assign({}, updatePlayerDto));
    return {
        status: 200,
        message: "Update player successfully",
        data: result,
    };
});
exports.default = PlayerService;
