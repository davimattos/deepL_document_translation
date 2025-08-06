import fs from "fs";
import path from "path";
import multer from "multer";
import { IDocumentStorage } from "../../domain/document-storage";

export class LocalStorageRepository implements IDocumentStorage {
  private downloadsDir = path.resolve("downloads");
  private uploadsDir = path.resolve("uploads");

  constructor() {
    if (!fs.existsSync(this.downloadsDir)) {
      fs.mkdirSync(this.downloadsDir, { recursive: true });
      console.log("Created downloads directory:", this.downloadsDir);
    }

    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
      console.log("Created uploads directory:", this.uploadsDir);
    }
  }

  getUploadMiddleware() {
    const storage = multer.diskStorage({
      destination: (_, __, cb) => cb(null, this.uploadsDir),
      filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
    });

    return multer({ storage });
  }

  getDownloadPath(filename: string): string {
    return path.join(this.downloadsDir, filename);
  }

  deleteTempFile(filePath: string): void {
    if (this.fileExists(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }
}
