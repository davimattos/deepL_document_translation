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

// Create directories if they don't exist
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
  console.log('Created downloads directory:', downloadsDir);
}

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory:', uploadsDir);
}

const app = express();
const port = 3001;

// Middleware
app.use(cors());

app.use(express.json());

// Configure multer for file uploads
const upload = multer({ dest: uploadsDir });

// Initialize DeepL translator
let translator = null;

const initializeTranslator = (apiKey) => {
  if (!translator || translator.authKey !== apiKey) {
    translator = new deepl.Translator(apiKey);
  }
  return translator;
};

// Translate document endpoint
app.post('/api/translate', upload.single('file'), async (req, res) => {
  try {
    const { source_lang, target_lang, api_key } = req.body;
    
    if (!api_key) {
      return res.status(400).json({ error: 'DeepL API key is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!target_lang) {
      return res.status(400).json({ error: 'Target language is required' });
    }

    console.log('Starting translation for:', req.file.originalname);
    console.log('Source language:', source_lang || 'auto-detect');
    console.log('Target language:', target_lang);
    console.log('File size:', req.file.size);

    const translatorInstance = initializeTranslator(api_key);

    // Generate unique filename for translated document
    const timestamp = Date.now();
    const originalName = req.file.originalname;
    const fileExtension = originalName.split('.').pop();
    const baseName = originalName.replace(`.${fileExtension}`, '');
    const outputFilename = `translated_${baseName}_${timestamp}.${fileExtension}`;
    const outputPath = path.join(downloadsDir, outputFilename);

    // Translate document using translateDocument function
    const result = await translatorInstance.translateDocument(
      fs.createReadStream(req.file.path),
      outputPath,
      source_lang === 'auto' ? null : source_lang, // null for auto-detection
      target_lang,
      {
        filename: req.file.originalname
      }
    );

    console.log('Translation completed successfully');
    console.log('Output file saved to:', outputPath);

    // Clean up uploaded file
    try {
      fs.unlinkSync(req.file.path);
      console.log('Deleted uploaded file:', req.file.path);
    } catch (cleanupErr) {
      console.error('Error deleting uploaded file:', cleanupErr);
    }

    // Return download URL
    const downloadUrl = `/api/downloads/${outputFilename}`;
    
    res.json({
      success: true,
      message: 'Document translated successfully',
      downloadUrl: downloadUrl,
      filename: outputFilename,
      originalFilename: req.file.originalname
    });

  } catch (error) {
    console.error('Translation error:', error);
    
    // Clean up uploaded file even if translation fails
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('Deleted uploaded file after error:', req.file.path);
      } catch (cleanupErr) {
        console.error('Error deleting uploaded file after error:', cleanupErr);
      }
    }
    
    // Handle specific DeepL errors
    if (error.message?.includes('quota')) {
      return res.status(429).json({ 
        error: 'API quota exceeded. Please check your DeepL account limits.' 
      });
    }
    
    if (error.message?.includes('auth')) {
      return res.status(401).json({ 
        error: 'Invalid API key. Please check your DeepL API key.' 
      });
    }

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
app.get('/api/downloads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(downloadsDir, filename);
  
  console.log('Download requested for:', filename);
  console.log('File path:', filePath);
  
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
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
  
  // Send file and cleanup after download
  res.download(filePath, filename, (err) => {
    if (err) {
      console.error('Download error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Download failed' });
      }
    } else {
      console.log('File downloaded successfully:', filename);
      // Delete the file after successful download
      try {
        fs.unlinkSync(filePath);
        console.log('Deleted downloaded file:', filePath);
      } catch (deleteErr) {
        console.error('Error deleting downloaded file:', deleteErr);
      }
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    directories: {
      uploads: uploadsDir, 
      downloads: downloadsDir
    }
  });
});

app.listen(port, () => {
  console.log(`DeepL Translation Server running on http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log('  POST /api/translate - Translate document and return download URL');
  console.log('  GET /api/downloads/:filename - Download translated files');
  console.log('  GET /api/health - Health check');
  console.log('');
  console.log('Directories:');
  console.log('  Uploads:', uploadsDir);
  console.log('  Downloads:', downloadsDir);
});