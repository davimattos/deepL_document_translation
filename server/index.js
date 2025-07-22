import express from 'express';
import cors from 'cors';
import multer from 'multer';
import * as deepl from 'deepl-node';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);
const downloadsDir = path.join(projectRoot, 'downloads');
const uploadsDir = path.join(projectRoot, 'uploads');

// Create downloads directory if it doesn't exist
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
  console.log('Created downloads directory:', downloadsDir);
}

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory:', uploadsDir);
}

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/downloads', express.static(path.join(process.cwd(), 'downloads')));

// Initialize DeepL translator
let translator = null;

const initializeTranslator = (apiKey) => {
  if (!translator || translator.authKey !== apiKey) {
    translator = new deepl.Translator(apiKey);
  }
  return translator;
};

// Configure multer for file uploads
const upload = multer({ dest: uploadsDir });

// Translate document - handles upload, polling and download in one endpoint
app.post('/api/translate', upload.single('file'), async (req, res) => {
  try {
    const { target_lang } = req.body;
    const apiKey = req.headers.authorization?.replace('Bearer ', '');
    
    if (!apiKey) {
      return res.status(401).json({ error: 'API key is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!target_lang) {
      return res.status(400).json({ error: 'Target language is required' });
    }

    console.log('Starting translation for:', req.file.originalname);
    console.log('Target language:', target_lang);
    console.log('File size:', req.file.size);

    const translatorInstance = initializeTranslator(apiKey);

    // Translate document and get result
    const result = await translatorInstance.translateDocument(
      fs.createReadStream(req.file.path),
      path.join(downloadsDir, req.file.originalname),
      'pt',
      target_lang,
      {filename: req.file.originalname}
    );

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = req.file.originalname;
    const fileExtension = originalName.split('.').pop();
    const baseName = originalName.replace(`.${fileExtension}`, '');
    const outputFilename = `translated_${baseName}_${timestamp}.${fileExtension}`;
    const outputPath = path.join(downloadsDir, outputFilename);
    let contentType = 'application/octet-stream';
    
    switch (fileExtension) {
      case 'docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'pptx':
        contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        break;
      case 'xlsx':
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'pdf':
        contentType = 'application/pdf';
        break;
      case 'txt':
        contentType = 'text/plain';
        break;
      case 'html':
      case 'htm':
        contentType = 'text/html';
        break;
      case 'xlf':
      case 'xliff':
        contentType = 'application/xml';
        break;
      case 'srt':
        contentType = 'text/plain';
        break;
      default:
        contentType = 'application/octet-stream';
    }

    // Generate filename for translated document
    const originalFilename = req.file.originalname;
    const filename = `translated_${originalFilename}`;

    // Set appropriate headers for file download
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', result.length);
    res.setHeader('Cache-Control', 'no-cache');
    
    // Send the translated document as buffer
    res.end(result);

  } catch (error) {
    console.error('Translation error:', error);
    
    if (error.message?.includes('quota')) {
      return res.status(429).json({ 
        error: 'API quota exceeded. Please check your DeepL account limits.' 
      });
    // Translate document and save to file
    }
    
    if (error.message?.includes('auth')) {
      return res.status(401).json({ 
        error: 'Invalid API key. Please check your DeepL API key.' 
      });
    }

    console.log('File saved to:', outputPath);
    if (error.message?.includes('file size')) {
      return res.status(413).json({ 
        error: 'File too large. Please check the file size limits for your file type.' 
      });
    }

    res.status(500).json({ 
      error: error.message || 'Failed to translate document' 
    });
  }
});

// Download endpoint
app.get('/downloads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(process.cwd(), 'downloads', filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  // Determine content type based on file extension
  const fileExtension = filename.split('.').pop()?.toLowerCase();
  let contentType = 'application/octet-stream';
  
  switch (fileExtension) {
    case 'docx':
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      break;
    case 'pptx':
      contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      break;
    case 'xlsx':
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      break;
    case 'pdf':
      contentType = 'application/pdf';
      break;
    case 'txt':
      contentType = 'text/plain';
      break;
    case 'html':
    case 'htm':
      contentType = 'text/html';
      break;
    case 'xlf':
    case 'xliff':
      contentType = 'application/xml';
      break;
    case 'srt':
      contentType = 'text/plain';
      break;
    default:
      contentType = 'application/octet-stream';
  }

  // Set headers for download
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Cache-Control', 'no-cache');
  
  // Send file
  res.sendFile(filePath);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`DeepL Translation Server running on http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log('  POST /api/translate - Translate document (upload, process, download)');
  console.log('  GET /api/health - Health check');
  console.log('  GET /downloads/:filename - Download translated files');
});