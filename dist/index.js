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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const db_connect_1 = __importDefault(require("./src/database/db.connect"));
const ErrorHandler_1 = __importDefault(require("./src/custom/ErrorHandler"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
//For env File
dotenv_1.default.config();
const port = process.env.PORT || 8080;
const frontendDomain = process.env.NODE_ENV === "development"
    ? process.env.FRONTEND_DOMAIN_DEVELOPMENT
    : process.env.FRONTEND_DOMAIN_PRODUCTION;
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
app.use(express_1.default.json({ limit: "50mb" }));
app.use((0, cookie_parser_1.default)());
// config cors
app.use((0, cors_1.default)({
    origin: frontendDomain,
    credentials: true,
    optionsSuccessStatus: 200,
}));
// config file option
app.use((0, express_fileupload_1.default)({ createParentPath: true }));
//config view engine
app.set("views", "./src/views");
app.set("view engine", "ejs");
//config public assets
app.use(express_1.default.static("./public"));
// config routes
app.use("/api/v1", routes_1.default);
app.get("/", (req, res) => {
    res.render("hello.ejs");
});
// handle global error
app.use(ErrorHandler_1.default);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_connect_1.default)();
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    }
    catch (error) {
        console.log("check error: ", error);
    }
}))();
