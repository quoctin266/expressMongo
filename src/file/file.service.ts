import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import path, { join } from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import { existsSync } from "node:fs";
import { unlink } from "node:fs/promises";
import AppError from "../custom/AppError";
import AWS from "aws-sdk";
import { IMobileFile } from "../user/dto/update-user.dto";
require("dotenv").config();

const BUCKET = process.env.BUCKET as string;
const acceptTypes = [
  "image/png",
  "image/jpeg",
  "text/plain",
  "video/mp4",
  "video/webm",
];

export default class FileService {
  // get root directory of project
  static getRootPath = () => {
    return process.cwd();
  };

  static createFileName = (file: UploadedFile | IMobileFile) => {
    const extName = path.extname(file.name);
    const baseName = path.basename(file.name, extName);

    const fileName = baseName + "_" + new Date().getTime() + extName;

    return fileName;
  };

  static createPath = (req: Request, file?: UploadedFile) => {
    const folderType = req.headers?.folder_type ?? "others";
    const folderName = req.headers?.folder_name ?? "default";

    const fileName = file ? this.createFileName(file) : "";

    const uploadPath = join(
      this.getRootPath(),
      `public/${folderType}/${folderName}/` + fileName
    );

    return { uploadPath, fileName };
  };

  static findFilePath(
    fileName: string,
    directoryPath = __dirname
  ): string | null {
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        // Recursively search in subdirectories
        const subdirectoryPath = path.join(directoryPath, file);
        const foundPath = this.findFilePath(fileName, subdirectoryPath);

        if (foundPath) {
          return foundPath;
        }
      } else if (stats.isFile() && file === fileName) {
        // Check if the current file matches the target fileName
        return filePath;
      }
    }

    // File not found
    return null;
  }

  static uploadFile = async (req: Request, file: UploadedFile) => {
    if (!acceptTypes.includes(file.mimetype))
      throw new AppError(
        "Invalid file type. Expected type: image/jpeg|image/png|text/plain|video/mp4|video/webm",
        422
      );

    if (file.size > 1024 * 1024 * 50)
      throw new AppError("Max size allowed is 50mb", 400);

    const { uploadPath, fileName } = this.createPath(req, file);

    await file.mv(uploadPath);

    return {
      status: 201,
      message: "Upload succesfully",
      data: {
        fileName,
        // originalName: file.name,
        error: null,
      },
    };
  };

  static uploadFileChunk = async (
    fileName: string,
    totalChunks: number,
    chunk: UploadedFile,
    req: Request
  ) => {
    // move chunk to tmp folder
    const saveChunkPath = join(
      process.cwd(),
      `public/${fileName}` + chunk.tempFilePath
    );
    await chunk.mv(saveChunkPath);

    // find all file names in tmp folder
    const tmpPath = join(process.cwd(), `public/${fileName}/tmp`);
    const fileNames = await fsPromises.readdir(tmpPath);

    if (fileNames.length === +totalChunks) {
      // find and read each file to an array of buffer
      const fileBuffers = await Promise.all(
        fileNames.map(async (name) => {
          const filePath = path.join(tmpPath, name);
          return fsPromises.readFile(filePath);
        })
      );

      const { uploadPath } = this.createPath(req);
      const filePath = uploadPath + `${new Date().getTime()}_${fileName}`;
      for (const buffer of fileBuffers) {
        if (!fs.existsSync(uploadPath)) {
          // If not, create the directory
          fs.mkdirSync(uploadPath, { recursive: true });
        }

        await fsPromises.appendFile(filePath, buffer);
      }

      // remove tmp folder after finish uploading and appending
      fsPromises.rm(join(process.cwd(), `public/${fileName}`), {
        recursive: true,
      });
    }

    return {
      status: 201,
      message: "Upload succesfully",
      data: null,
    };
  };

  static removeFile = async (fileName: string) => {
    const filePath = FileService.findFilePath(
      fileName,
      join(this.getRootPath(), "public")
    ) as string;
    if (existsSync(filePath)) {
      await unlink(filePath);
      return {
        status: 200,
        message: "Remove file successfully",
        data: {
          fileDeleted: fileName,
        },
      };
    } else
      return {
        status: 404,
        message: "File not found",
        data: {
          fileDeleted: null,
        },
      };
  };

  static createFileLink = (fileName: string) => {
    const backendDomain =
      process.env.NODE_ENV === "development"
        ? (process.env.BACKEND_DOMAIN_DEVELOPMENT as string)
        : (process.env.BACKEND_DOMAIN_PRODUCTION as string);

    return (
      backendDomain +
      this.findFilePath(fileName, join(this.getRootPath(), "public"))?.replace(
        join(this.getRootPath(), "public"),
        ""
      )
    );
  };

  // AWS service
  static uploadFileAWS = async (
    req: Request,
    file: UploadedFile | IMobileFile
  ) => {
    console.log(file.data);
    if (!acceptTypes.includes(file.mimetype))
      throw new AppError(
        "Invalid file type. Expected type: image/jpeg|image/png|text/plain|video/mp4|video/webm",
        422
      );

    if (file.size > 1024 * 1024 * 30)
      throw new AppError("Max size allowed is 30mb", 400);

    const folderType = req.headers?.folder_type ?? "others";
    const folderName = req.headers?.folder_name ?? "default";

    const fileName = this.createFileName(file);

    let fileContent = null;
    if ((file as IMobileFile).isMobile) {
      fileContent = Buffer.from(file.data as string, "base64");
    } else fileContent = Buffer.from(file.data);

    const s3 = new AWS.S3();
    let res = await s3
      .upload({
        Body: fileContent,
        Bucket: BUCKET,
        Key: `${folderType}/${folderName}/${fileName}`,
        ContentType: (file as IMobileFile).isMobile ? file.mimetype : undefined,
        ContentEncoding: (file as IMobileFile).isMobile ? "base64" : undefined,
      })
      .promise();

    return {
      status: 201,
      message: "Upload succesfully",
      data: {
        url: res.Location,
        key: res.Key,
      },
    };
  };

  static removeFileAWS = async (key: string) => {
    const s3 = new AWS.S3();

    const params = {
      Bucket: BUCKET,
      Key: key,
    };

    try {
      // check file exist
      await s3.headObject(params).promise();
      await s3.deleteObject(params).promise();

      return {
        status: 200,
        message: "Remove file successfully",
        data: null,
      };
    } catch (error) {
      console.log(">>> Check AWS error", error);
      return {
        status: 404,
        message: "File not found",
        data: {
          fileDeleted: null,
        },
      };
    }
  };
}
