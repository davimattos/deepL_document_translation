import { Router } from 'express';
import { upload } from '../config/multer';
import { translateController } from './translate';
import { downloadController } from './download';

const router = Router();

router.post('/translate', upload.single('file'), translateController);
router.get('/downloads/:filename', downloadController);

export { router as routes };
