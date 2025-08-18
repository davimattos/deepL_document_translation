import { Request, Response } from "express";
import { DownloadDocument } from "../../application/download-document";

export function createDownloadFileController(useCase: DownloadDocument) {
  return async (req: Request, res: Response) => {
    try {
      const key = req.params.filename;

      if (!key) {
        return res.status(400).json({ error: "A chave do arquivo é obrigatória." });
      }

      const {buffer, mimetype, originalname} = await useCase.execute({ fileKey: key });

      res.setHeader('Content-Type', mimetype);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${originalname}"`
      );

      return res.status(200).send(buffer);

    } catch (err: any) {
      console.error("Falha ao gerar URL de download:", err);
      if (err.code === 404) {
        return res.status(404).json({ error: "Arquivo não encontrado." });
      }
      return res.status(500).json({ error: err.message });
    }
  };
}
