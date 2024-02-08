import express from "express";
import errorCatching from "../custom/ErrorCatching";
import CourseRequestController from "./courseRequest.controller";

const router = express.Router();

router.get("/", errorCatching(CourseRequestController.getCourseRequests));

router.patch("/:id", errorCatching(CourseRequestController.processRequest));

export default router;
