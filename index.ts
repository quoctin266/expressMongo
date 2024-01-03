import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import router from "./routes";
import getConnection from "./src/database/db.connect";
import errorHandler from "./src/custom/ErrorHandler";
import cors from "cors";
import cookieParser from "cookie-parser";

//For env File
dotenv.config();
const port = process.env.PORT || 8080;

const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// config cors
app.use(
  cors({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
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
