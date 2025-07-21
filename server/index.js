const express = require('express');
const cors = require('cors');
const multer = require('multer');
const * as deepl from 'deepl-node';

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

// Store active translations
const activeTranslations = new Map();

// Initialize DeepL translator
let translator = null;

const initializeTranslator = (apiKey) => {
  if (!translator || translator.authKey !== apiKey) {
    translator = new deepl.Translator(apiKey);
  }
  return translator;
};

// Upload document for translation
app.post('/api/translate/upload', upload.single('file'), async (req, res) => {
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

    console.log('Uploading document:', req.file.originalname);
    console.log('Target language:', target_lang);
    console.log('File size:', req.file.size);

    const translatorInstance = initializeTranslator(apiKey);

    // Upload document to DeepL
    const uploadResult = await translatorInstance.uploadDocument(
      req.file.buffer,
      req.file.originalname,
      target_lang
    );

    console.log('Upload successful:', uploadResult.documentId);

    // Store the translation info
    activeTranslations.set(uploadResult.documentId, {
      documentKey: uploadResult.documentKey,
      filename: req.file.originalname,
      targetLang: target_lang,
      status: 'translating',
      uploadedAt: new Date()
    });

    res.json({
      document_id: uploadResult.documentId,
      document_key: uploadResult.documentKey
    });

  } catch (error) {
    console.error('Upload error:', error);
    
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

    res.status(500).json({ 
      error: error.message || 'Failed to upload document' 
    });
  }
});

// Check translation status
app.post('/api/translate/status/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    const { document_key } = req.body;
    const apiKey = req.headers.authorization?.replace('Bearer ', '');
    
    if (!apiKey) {
      return res.status(401).json({ error: 'API key is required' });
    }

    const translatorInstance = initializeTranslator(apiKey);
    
    console.log('Checking status for document:', documentId);

    // Check document status
    const status = await translatorInstance.getDocumentStatus(documentId, document_key);
    
    console.log('Document status:', status.status);

    // Update stored translation info
    if (activeTranslations.has(documentId)) {
      const translationInfo = activeTranslations.get(documentId);
      translationInfo.status = status.status;
      activeTranslations.set(documentId, translationInfo);
    }

    res.json({
      status: status.status,
      seconds_remaining: status.secondsRemaining || 0
    });

  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to check document status' 
    });
  }
});

// Download translated document
app.post('/api/translate/download/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    const { document_key } = req.body;
    const apiKey = req.headers.authorization?.replace('Bearer ', '');
    
    if (!apiKey) {
      return res.status(401).json({ error: 'API key is required' });
    }

    const translatorInstance = initializeTranslator(apiKey);
    
    console.log('Downloading document:', documentId);

    // Download the translated document
    const result = await translatorInstance.downloadDocument(documentId, document_key);
    
    // Get original filename
    const translationInfo = activeTranslations.get(documentId);
    const originalFilename = translationInfo?.filename || 'translated_document';
    const filename = `translated_${originalFilename}`;

    // Set appropriate headers
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Send the file buffer
    res.send(result);

    // Clean up stored translation info
    activeTranslations.delete(documentId);
    
    console.log('Download completed:', filename);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to download document' 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    activeTranslations: activeTranslations.size
  });
});

app.listen(port, () => {
  console.log(`DeepL Translation Server running on http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log('  POST /api/translate/upload - Upload document for translation');
  console.log('  POST /api/translate/status/:id - Check translation status');
  console.log('  POST /api/translate/download/:id - Download translated document');
  console.log('  GET /api/health - Health check');
});