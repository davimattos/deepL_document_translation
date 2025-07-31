import { LocalStorageRepository } from "../infrastructure/local-storage-repository";
import { Response } from "express";

export class DownloadService {
  constructor(private storage: LocalStorageRepository) {}

  async handleDownload(filename: string, res: Response): Promise<void> {
    const filePath = this.storage.getDownloadPath(filename);

    if (!this.storage.fileExists(filePath)) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Download error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Download failed" });
        }
      } else {
        try {
          this.storage.deleteTempFile(filePath);
          console.log("File downloaded and deleted:", filename);
        } catch (deleteErr) {
          console.error("Error deleting downloaded file:", deleteErr);
        }
      }
    });
  }
}
