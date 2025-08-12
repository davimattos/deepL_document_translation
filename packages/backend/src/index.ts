import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { routes } from './infra/routes';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log('POST /api/upload - Upload the document and return the file key');
  console.log('POST /api/translate - Translate document and return download URL');
  console.log('GET /api/download/:filename - Download translated files');
});