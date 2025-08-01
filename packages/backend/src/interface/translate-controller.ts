import { Request, Response } from "express";
import { TranslateDocument } from "../application/translate-document";
import { DeeplTranslatorAdapter } from "../infrastructure/adapters/deepl-translator-adapter";
import { LocalStorageRepository } from "../infrastructure/repositories/local-storage-repository";
import { Document } from "../domain/document";
import { IDocumentStorage } from "../domain/document-storage";
import { SecretKeyManager } from "../infrastructure/secret-key-manager";

export const TranslateController = async (req: Request, res: Response) => {
  try {
    const { source_lang, target_lang } = req.body;
    const file = req.file;

    if (!target_lang || !file) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const apiKey = SecretKeyManager.get();

    const document = new Document(file.originalname, file.path);

    const storage: IDocumentStorage = new LocalStorageRepository();
    const translator = new DeeplTranslatorAdapter(apiKey);
    const useCase = new TranslateDocument(translator, storage);

    console.log("Starting translation for:", file.originalname);
    console.log("Source language:", source_lang || "auto-detect");
    console.log("Target language:", target_lang);
    console.log("File size:", file.size);

    const result = await useCase.execute({
      document,
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
