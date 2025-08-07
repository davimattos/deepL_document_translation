import { Document } from "../domain/document";
import { IDocumentStorage } from "../domain/document-storage";
import { ITranslatorService } from "../domain/translator-service";
import { TranslateDocument } from "./translate-document";

const makeTranslator = (): jest.Mocked<ITranslatorService> => ({
  translateDocument: jest.fn(),
});

const makeStorage = (): jest.Mocked<IDocumentStorage> => ({
  getDownloadPath: jest.fn(),
  deleteTempFile: jest.fn(),
  fileExists: jest.fn(),
  getUploadMiddleware: jest.fn(),
});

const makeDocument = (): jest.Mocked<Document> => ({
  tempPath: '/tmp/uploaded.pdf',
  originalName: 'file.pdf',
  getExtension: jest.fn().mockReturnValue('pdf'),
  getBaseName: jest.fn().mockReturnValue('file'),
});

const makeSut = () => {
  const translator = makeTranslator();
  const storage = makeStorage();
  const sut = new TranslateDocument(translator, storage);
  return { sut, translator, storage };
};

describe('TranslateDocument', () => {
  it('should translate and delete the temp file', async () => {
    const { sut, translator, storage } = makeSut();
    const document = makeDocument();

    const expectedOutputFilename = expect.stringMatching(/^translated_file_\d+\.pdf$/);
    storage.getDownloadPath.mockImplementation(filename => `/translated/${filename}`);

    const result = await sut.execute({
      document,
      sourceLang: 'en',
      targetLang: 'pt',
    });

    expect(translator.translateDocument).toHaveBeenCalledWith(
      document.tempPath,
      expect.stringContaining('/translated/translated_file_'),
      'en',
      'pt',
      document.originalName
    );

    expect(storage.deleteTempFile).toHaveBeenCalledWith(document.tempPath);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Document translated');
    expect(result.downloadUrl).toMatch(/^\/api\/downloads\/translated_file_\d+\.pdf$/);
    expect(result.filename).toMatch(/^translated_file_\d+\.pdf$/);
    expect(result.originalFilename).toBe(document.originalName);
  });

  it('should use null as sourceLang if auto is passed', async () => {
    const { sut, translator, storage } = makeSut();
    const document = makeDocument();

    storage.getDownloadPath.mockReturnValue('/translated/path.pdf');

    await sut.execute({
      document,
      sourceLang: 'auto',
      targetLang: 'fr',
    });

    expect(translator.translateDocument).toHaveBeenCalledWith(
      document.tempPath,
      '/translated/path.pdf',
      null,
      'fr',
      document.originalName
    );
  });
});
