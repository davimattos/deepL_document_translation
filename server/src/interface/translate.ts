import { Request, Response } from 'express';
import { TranslateDocumentUseCase } from '../application/translate-document.use-case';
import { DeeplTranslatorService } from '../infrastructure/deepl-translator';
import { FileManager } from '../infrastructure/file-manager';
import { Document } from '../domain/document';

export const translateController = async (req: Request, res: Response) => {
  const fileManager = new FileManager();

  try {
    const { source_lang, target_lang } = req.body;
    const apiKey = req.headers.authorization?.replace('Bearer ', '');
    const file = req.file;

    if (!apiKey || !target_lang || !file) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const document = new Document(file.originalname, file.path);
    const useCase = new TranslateDocumentUseCase(
      new DeeplTranslatorService(apiKey),
      new FileManager()
    );

    console.log('Starting translation for:', file.originalname);
    console.log('Source language:', source_lang || 'auto-detect');
    console.log('Target language:', target_lang);
    console.log('File size:', file.size);

    const result = await useCase.execute({
      document,
      sourceLang: source_lang,
      targetLang: target_lang
    });

    console.log('Translation completed successfully');
    console.log('Output file saved to:', result.downloadUrl);

    try {
      fileManager.deleteFile(file.path)
      console.log('Deleted uploaded file:', file.path);
    } catch (cleanupErr) {
      console.error('Error deleting uploaded file:', cleanupErr);
    }

    return res.json(result);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
