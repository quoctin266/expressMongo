import AppError from "../custom/AppError";
import { CreateVideoDto } from "./dto/create-video.dto";
import FileService from "../file/file.service";
import { Request } from "express";
import { UploadedFile } from "express-fileupload";
import Video from "./schema/video.schema";
import Course from "../course/schema/course.schema";
import { UpdateVideoDto } from "./dto/update-video.dto";

export default class VideoService {
  static create = async (
    req: Request,
    createVideoDto: CreateVideoDto,
    courseId: string
  ) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      throw new AppError("No files were uploaded", 400);
    }

    let res = await FileService.uploadFileAWS(
      req,
      req.files.file as UploadedFile
    );

    let createRes = await Video.create({
      ...createVideoDto,
      fileName: res.data,
      courseId,
    });

    return {
      status: 201,
      message: "Create video successfully",
      data: createRes,
    };
  };

  static getCourseVideos = async (courseId: string) => {
    let course = await Course.findById(courseId).exec();
    if (!course) throw new AppError("Course not found", 400);

    let result = await Video.find({ courseId, isDeleted: false });

    let videoList = result.map((video) => {
      const videoUrl = video.fileName?.url;

      const { fileName, ...rest } = video.toObject();

      return {
        ...rest,
        videoUrl,
      };
    });

    return {
      status: 200,
      message: "Get course's videos successfully",
      data: videoList,
    };
  };

  static getSectionVideos = async (sectionId: string) => {
    let result = await Video.find({ sectionId, isDeleted: false }).select([
      "-courseId",
      "-sectionId",
    ]);

    let videoList = result.map((video) => {
      const videoUrl = video.fileName?.url;

      const { fileName, ...rest } = video.toObject();

      return {
        ...rest,
        videoUrl,
      };
    });

    return {
      status: 200,
      message: "Get section's videos successfully",
      data: videoList,
    };
  };

  static updateInfo = async (
    videoId: string,
    updateVideoDto: UpdateVideoDto
  ) => {
    let video = await Video.findById(videoId).exec();
    if (!video) throw new AppError("Video does not exist", 400);

    let res = await Video.findByIdAndUpdate(videoId, {
      ...updateVideoDto,
    });

    return {
      status: 200,
      message: "Update video info successfully",
      data: res,
    };
  };

  static updateFile = async (req: Request, videoId: string) => {
    let video = await Video.findById(videoId).exec();
    if (!video) throw new AppError("Video does not exist", 400);

    if (!req.files || Object.keys(req.files).length === 0) {
      throw new AppError("No files were uploaded", 400);
    }

    let res = await FileService.uploadFileAWS(
      req,
      req.files.file as UploadedFile
    );

    await FileService.removeFileAWS(video.fileName?.key as string);

    await Video.findByIdAndUpdate(videoId, { fileName: res.data });

    return {
      status: 200,
      message: "Update video file successfully",
      data: null,
    };
  };

  static delete = async (videoId: string) => {
    let video = await Video.findById(videoId).exec();
    if (!video) throw new AppError("Video does not exist", 400);

    let res = await Video.findByIdAndUpdate(videoId, { isDeleted: true });

    return {
      status: 200,
      message: "Delete video successfully",
      data: res,
    };
  };
}
