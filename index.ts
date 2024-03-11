import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import router from "./routes";
import getConnection from "./src/database/db.connect";
import errorHandler from "./src/custom/ErrorHandler";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

//For env File
dotenv.config();
const port = process.env.PORT || 8080;
const frontendDomain =
  process.env.NODE_ENV === "development"
    ? process.env.FRONTEND_DOMAIN_DEVELOPMENT
    : process.env.FRONTEND_DOMAIN_PRODUCTION;

const app: Application = express();

app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

// config cors
app.use(
  cors({
    origin: frontendDomain,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// config file option
// enable temp file will make upload to aws s3 become 0 Byte
app.use(
  fileUpload({
    createParentPath: true,
    // useTempFiles: true,
    // tempFileDir: "/tmp/",
  })
);

//config view engine
app.set("views", "./src/views");
app.set("view engine", "ejs");

//config public assets
app.use(express.static("./public"));

// config routes
app.use("/api/v1", router);
app.get("/", (req: Request, res: Response) => {
  res.render("hello.ejs");
});

// handle global error
app.use(errorHandler);

(async () => {
  try {
    await getConnection();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.log("check error: ", error);
  }
})();
