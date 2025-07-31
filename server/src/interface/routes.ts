import { Router } from 'express';
import { TranslateController } from './translate-controller';
import { LocalStorageRepository } from '../infrastructure/local-storage-repository';
import { DownloadFileController } from './download-file-controller';

const router = Router();
const localStorage = new LocalStorageRepository();
const upload = localStorage.getUploadMiddleware();

router.post('/translate', upload.single('file'), TranslateController);
router.get('/downloads/:filename', DownloadFileController);

export { router as routes };
