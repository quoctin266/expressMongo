import express from "express";
import FileController from "./file.controller";
import errorCatching from "../custom/ErrorCatching";

const router = express.Router();

router.post("/", errorCatching(FileController.upload));
router.delete("/", errorCatching(FileController.delete));

export default router;
