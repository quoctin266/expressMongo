import express from "express";
import errorCatching from "../custom/ErrorCatching";
import CourseRequestController from "./courseRequest.controller";

const router = express.Router();

router.get("/", errorCatching(CourseRequestController.getCourseRequests));

export default router;
