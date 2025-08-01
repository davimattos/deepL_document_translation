import { Multer } from "multer";

export interface IDocumentStorage {
  getDownloadPath(filename: string): string;
  deleteTempFile(path: string): void;
  fileExists(path: string): boolean;
  getUploadMiddleware(): Multer
}
