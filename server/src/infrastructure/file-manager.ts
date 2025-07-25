import fs from "fs";
import path from "path";
import { Response } from "express";

export class FileManager {
  public downloadsDir = path.resolve("downloads");
  public uploadsDir = path.resolve("uploads");

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

  deleteFile(filePath: string) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  downloadFile(filename: string, res: Response) {
    const filePath = path.join(this.downloadsDir, filename);

    console.log("Download requested for:", filename);
    console.log("File path:", filePath);

    if (!fs.existsSync(filePath)) {
      console.log("File not found:", filePath);
      res.status(404).json({ error: "File not found" });
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Download error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Download failed" });
        }
      } else {
        console.log("File downloaded successfully:", filename);
        try {
          this.deleteFile(filePath);
          console.log("Deleted downloaded file:", filePath);
        } catch (deleteErr) {
          console.error("Error deleting downloaded file:", deleteErr);
        }
      }
    });
  }
}
