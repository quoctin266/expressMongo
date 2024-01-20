import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import path, { join } from "path";
import fs from "fs";
import { existsSync } from "node:fs";
import { unlink } from "node:fs/promises";
import AppError from "../custom/AppError";

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

  static createPath = (req: Request, file: UploadedFile) => {
    const folderType = req.headers?.folder_type ?? "others";
    const folderName = req.headers?.folder_name ?? "default";

    const extName = path.extname(file.name);
    const baseName = path.basename(file.name, extName);

    const fileName = baseName + "_" + new Date().getTime() + extName;
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

  static createFileLink = (fileName: string) => {
    const domainName = process.env.DOMAIN as string;
    const port = process.env.PORT || "";

    return (
      domainName +
      port +
      this.findFilePath(fileName, join(this.getRootPath(), "public"))?.replace(
        join(this.getRootPath(), "public"),
        ""
      )
    );
  };

  static uploadFile = async (req: Request, file: UploadedFile) => {
    if (!acceptTypes.includes(file.mimetype))
      throw new AppError(
        "Invalid file type. Expected type: image/jpeg|image/png|text/plain|video/mp4|video/webm",
        422
      );

    if (file.size > 1024 * 1024 * 30)
      throw new AppError("Max size allowed is 30mb", 400);

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
}
