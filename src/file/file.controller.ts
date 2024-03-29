import { Request, Response, request } from "express";
import FileService from "./file.service";
import AppError from "../custom/AppError";
import { UploadedFile } from "express-fileupload";
import fsPromises from "fs/promises";
import path, { join } from "path";

export default class FileController {
  static async upload(req: Request, res: Response) {
    if (!req.files || Object.keys(req.files).length === 0) {
      throw new AppError("No files were uploaded", 400);
    }

    let result = await FileService.uploadFile(
      req,
      req.files.file as UploadedFile
    );

    res.status(result.status).json(result);
  }

  static async uploadChunk(req: Request, res: Response) {
    const { fileName, totalChunks } = req.body;
    const chunk = req.files?.chunk as UploadedFile;

    let result = await FileService.uploadFileChunk(
      fileName,
      +totalChunks,
      chunk,
      req
    );

    res.status(result.status).json(result);
  }

  static async delete(req: Request, res: Response) {
    let result = await FileService.removeFileAWS(req.headers.key as string);

    // res.status(result.status).json(result);
    res.status(result.status).json(result);
  }
}
