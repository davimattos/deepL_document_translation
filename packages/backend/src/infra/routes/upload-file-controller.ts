import { Request, Response } from "express";
import { UploadDocument } from "../../application/upload-document";
import { File } from "../../application/providers/storage-provider";

export function createUploadFileController(useCase: UploadDocument) {
  return async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado." });
    }

    try {
      const { originalname, mimetype, size, path } = req.file;
      const fileForUseCase: File = {
        originalname,
        mimetype,
        size,
        tempPath: path,
      };

      const { fileKey } = await useCase.execute(fileForUseCase);

      return res.status(201).json({ fileKey });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };
}
