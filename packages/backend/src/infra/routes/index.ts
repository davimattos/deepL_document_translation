import { Router } from "express";
import multer from "multer";
import path from "path";

import { createTranslateFileController } from "./translate-file-controller";
import { createDownloadFileController } from "./download-file-controller";
import { createUploadFileController } from "./upload-file-controller";
import { GCSStorageProvider } from "../providers/storage/GCSStorageProvider";
import { UploadDocument } from "../../application/upload-document";
import { SecretKeyAdapter } from "../adapters/secret-key-adapter";
import { DeeplTranslatorAdapter } from "../adapters/deepl-translator-adapter";
import { TranslateDocument } from "../../application/translate-document";
import { DownloadDocument } from "../../application/download-document";


const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, path.resolve("uploads")),
    filename: (_, file, cb) => cb(null, file.originalname),
});

const deeplApiKey = SecretKeyAdapter.get();
const storageProvider = new GCSStorageProvider();
const translator = new DeeplTranslatorAdapter(deeplApiKey);
const uploadUseCase = new UploadDocument(storageProvider);
const translateUseCase = new TranslateDocument(translator, storageProvider);
const downloadService = new DownloadDocument(storageProvider);

const uploadFileController = createUploadFileController(uploadUseCase);
const translationController = createTranslateFileController(translateUseCase)
const downloadController = createDownloadFileController(downloadService)

const router = Router();
const upload = multer({storage});

router.post("/upload", upload.single("file"), uploadFileController);
router.post("/translate", translationController);
router.get("/download/:filename", downloadController);

export { router as routes };
