import { Request, Response, request } from "express";
import FileService from "./file.service";
import AppError from "../custom/AppError";
import { UploadedFile } from "express-fileupload";

export default class FileController {
  static async upload(req: Request, res: Response) {
    if (!req.files || Object.keys(req.files).length === 0) {
      throw new AppError("No files were uploaded", 400);
    }

    let result = await FileService.uploadFile(
      req,
      req.files.file as UploadedFile
    );

    // res.status(result.status).json(result);
    res.status(result.status).json(result);
  }

  static async delete(req: Request, res: Response) {
    let result = await FileService.removeFile(req.body.fileName);

    // res.status(result.status).json(result);
    res.status(result.status).json(result);
  }
}
