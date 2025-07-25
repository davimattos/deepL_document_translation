import multer from 'multer';
import path from 'path';

const uploadsDir = path.resolve('uploads');

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadsDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

export const upload = multer({ storage });
