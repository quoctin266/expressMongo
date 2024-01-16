import express from "express";
import errorCatching from "../custom/ErrorCatching";
import { checkSchema } from "express-validator";
import { validateError } from "../middleware/error.validate";
import VideoController from "./video.controller";

const router = express.Router();

const validateCreateVideo = {
  title: {
    notEmpty: true,
    errorMessage: "Video title must not be empty",
  },
  description: {
    notEmpty: true,
    errorMessage: "Video description must not be empty",
  },
};

// router.get("/", errorCatching(CategoryController.getList));

router.post(
  "/courses/:courseId",
  checkSchema(validateCreateVideo),
  validateError,
  errorCatching(VideoController.create)
);

router.get("/courses/:courseId", errorCatching(VideoController.getVideos));

// router.patch("/:readingId", errorCatching(ReadingController.update));

// router.delete("/:readingId", errorCatching(ReadingController.delete));

export default router;
