import { Request, Response } from "express";
import { TranslateDocument } from "../../application/translate-document";

export function createTranslateFileController(useCase: TranslateDocument) {
  return async (req: Request, res: Response) => {
    try {
      const { fileKey, originalFilename, source_lang, target_lang } = req.body;

      if (!target_lang || !fileKey) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      console.log("Starting translation for:", originalFilename);
      console.log("Source language:", source_lang || "auto-detect");
      console.log("Target language:", target_lang);

      const result = await useCase.execute({
        fileKey,
        originalFilename,
        sourceLang: source_lang,
        targetLang: target_lang,
      });

      console.log("Translation completed successfully");
      console.log("Output file saved to:", result.downloadUrl);

      return res.json(result);
    } catch (err: any) {
      console.error("Translation failed:", err);
      return res.status(500).json({ error: err.message });
    }
  };
}
