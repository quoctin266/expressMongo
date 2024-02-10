import express from "express";
import errorCatching from "../custom/ErrorCatching";
import InstructorRequestController from "./instructorRequest.controller";

const router = express.Router();

router.post("/", errorCatching(InstructorRequestController.create));

router.get(
  "/",
  errorCatching(InstructorRequestController.getInstructorRequests)
);

router.patch("/:id", errorCatching(InstructorRequestController.processRequest));

export default router;
