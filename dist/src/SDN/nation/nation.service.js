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
const AppError_1 = __importDefault(require("../../custom/AppError"));
const nation_schema_1 = __importDefault(require("./schema/nation.schema"));
class NationService {
}
_a = NationService;
NationService.gatNationsList = () => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield nation_schema_1.default.find();
    return {
        status: 200,
        message: "Fetch nations list successfully",
        data: result,
    };
});
NationService.getNationDetail = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let nation = yield nation_schema_1.default.findById(id).exec();
    if (!nation)
        throw new AppError_1.default("Nation not found", 404);
    return {
        status: 200,
        message: "Get nation detail successfully",
        data: nation,
    };
});
NationService.createNewNation = (createNationDto) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = createNationDto;
    let nation = yield nation_schema_1.default.findOne({ name }).exec();
    if (nation)
        throw new AppError_1.default("Nation already exist", 409);
    let result = yield nation_schema_1.default.create(Object.assign({}, createNationDto));
    return {
        status: 200,
        message: "Create new nation successfully",
        data: result,
    };
});
NationService.updateNation = (updateNationDto, id) => __awaiter(void 0, void 0, void 0, function* () {
    let nation = yield nation_schema_1.default.findById(id).exec();
    if (!nation)
        throw new AppError_1.default("Nation not found", 404);
    let result = yield nation_schema_1.default.findByIdAndUpdate(id, Object.assign({}, updateNationDto)).select(["+updatedAt", "-name", "-description"]);
    return {
        status: 200,
        message: "Update nation successfully",
        data: result,
    };
});
NationService.deleteNation = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let nation = yield nation_schema_1.default.findById(id).exec();
    if (!nation)
        throw new AppError_1.default("Nation not found", 404);
    let result = yield nation_schema_1.default.findByIdAndDelete(id);
    return {
        status: 200,
        message: "Delete nation successfully",
        data: result,
    };
});
exports.default = NationService;
