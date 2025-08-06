import { Request, Response } from "express";
import { LocalStorageRepository } from "../infrastructure/repositories/local-storage-repository";
import { DownloadService } from "../application/download-service";

const storage = new LocalStorageRepository();
const downloadService = new DownloadService(storage);

export async function DownloadFileController(req: Request, res: Response) {
  const filename = req.params.filename;
  await downloadService.handleDownload(filename, res);
}
