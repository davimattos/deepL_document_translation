import express from 'express';
import cors from 'cors';
import multer from 'multer';
import * as deepl from 'deepl-node';

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 30 * 1024 * 1024 // 30MB limit
  }
});

// Initialize DeepL translator
let translator = null;

const initializeTranslator = (apiKey) => {
  if (!translator || translator.authKey !== apiKey) {
    translator = new deepl.Translator(apiKey);
  }
  return translator;
};

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

    // Use translateDocument method - handles everything internally
    const result = await translatorInstance.translateDocument(
      req.file.buffer,
      null,
      'pt',
      target_lang,
      {filename: req.file.originalname}
    );

    console.log('Translation completed successfully');

    // Generate filename for translated document
    const originalFilename = req.file.originalname;
    const filename = `translated_${originalFilename}`;

    // Set appropriate headers for file download
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Send the translated document directly
    res.send(result);

  } catch (error) {
    console.error('Translation error:', error);
    
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
});