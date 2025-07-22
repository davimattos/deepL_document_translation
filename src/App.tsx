import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ProcessingState {
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [processedFile, setProcessedFile] = useState<Blob | null>(null);
  const [processing, setProcessing] = useState<ProcessingState>({
    status: 'idle',
    progress: 0,
    message: ''
  });
  const [apiKey, setApiKey] = useState<string>('');
  const [targetLanguage, setTargetLanguage] = useState<string>('en-US');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedExtensions = ['docx', 'pptx', 'xlsx', 'pdf', 'htm', 'html', 'txt', 'xlf', 'xliff', 'srt'];

  const handleFileSelect = (selectedFile: File) => {
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension && allowedExtensions.includes(fileExtension)) {
      setFile(selectedFile);
      setProcessedFile(null);
      setErrorMessage('');
      setProcessing({ status: 'idle', progress: 0, message: '' });
    } else {
      setErrorMessage(`Por favor, selecione apenas arquivos com as extensões permitidas: ${allowedExtensions.join(', ')}`);
      setProcessing({
        status: 'error',
        progress: 0,
        message: 'Tipo de arquivo não suportado'
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const processFile = async () => {
    if (!file || !apiKey.trim()) {
      setErrorMessage('Por favor, forneça a chave da API do DeepL');
      setProcessing({
        status: 'error',
        progress: 0,
        message: 'Chave da API necessária'
      });
      return;
    }

    setProcessing({ status: 'uploading', progress: 10, message: 'Enviando arquivo...' });
    setErrorMessage('');

    try {
      // Tradução completa do documento (upload, processamento e download)
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('target_lang', targetLanguage);

      console.log('Iniciando tradução completa...');
      console.log('API Key:', apiKey.substring(0, 10) + '...');
      console.log('Target Language:', targetLanguage);
      console.log('File:', file.name);

      setProcessing({ status: 'processing', progress: 50, message: 'Traduzindo documento...' });

      const response = await fetch('http://localhost:3001/api/translate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: uploadFormData,
      });

      console.log('Translation response status:', response.status);

      if (!response.ok) {
        const responseText = await response.text();
        console.error('Translation error response:', responseText);
        
        let errorMessage = `Erro na tradução (${response.status})`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = `Erro na tradução: ${errorData.error || errorData.message || response.statusText}`;
        } catch {
          errorMessage = `Erro na tradução: ${responseText || response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      setProcessing({ status: 'processing', progress: 90, message: 'Finalizando download...' });

      // O response contém informações do arquivo traduzido
      const result = await response.json();
      console.log('Translation completed:', result);

      // Download automático do arquivo em nova aba
      const downloadUrl = `http://localhost:3001${result.downloadUrl}`;
      window.open(downloadUrl, '_blank');

      setProcessing({ status: 'completed', progress: 100, message: 'Documento processado com sucesso!' });

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('Processing error:', error);
      setErrorMessage(errorMsg);
      setProcessing({
        status: 'error',
        progress: 0,
        message: 'Erro no processamento'
      });
    }
  };

  const resetUpload = () => {
    setFile(null);
    setProcessedFile(null);
    setErrorMessage('');
    setProcessing({ status: 'idle', progress: 0, message: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const languages = [
    { code: 'AR', name: 'Árabe' },
    { code: 'BG', name: 'Búlgaro' },
    { code: 'CS', name: 'Tcheco' },
    { code: 'DA', name: 'Dinamarquês' },
    { code: 'DE', name: 'Alemão' },
    { code: 'EL', name: 'Grego' },
    { code: 'en-US', name: 'Inglês' },
    { code: 'ES', name: 'Espanhol' },
    { code: 'ET', name: 'Estoniano' },
    { code: 'FI', name: 'Finlandês' },
    { code: 'FR', name: 'Francês' },
    { code: 'HE', name: 'Hebraico' },
    { code: 'HU', name: 'Húngaro' },
    { code: 'ID', name: 'Indonésio' },
    { code: 'IT', name: 'Italiano' },
    { code: 'JA', name: 'Japonês' },
    { code: 'KO', name: 'Coreano' },
    { code: 'LT', name: 'Lituano' },
    { code: 'LV', name: 'Letão' },
    { code: 'NB', name: 'Norueguês (Bokmål)' },
    { code: 'NL', name: 'Holandês' },
    { code: 'PL', name: 'Polonês' },
    { code: 'PT', name: 'Português' },
    { code: 'RO', name: 'Romeno' },
    { code: 'RU', name: 'Russo' },
    { code: 'SK', name: 'Eslovaco' },
    { code: 'SL', name: 'Esloveno' },
    { code: 'SV', name: 'Sueco' },
    { code: 'TH', name: 'Tailandês' },
    { code: 'TR', name: 'Turco' },
    { code: 'UK', name: 'Ucraniano' },
    { code: 'VI', name: 'Vietnamita' },
    { code: 'ZH', name: 'Chinês' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-blue-600 p-3 rounded-xl">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Tradutor de Documentos
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Traduza seus documentos usando a API do DeepL
            </p>
          </div>

          {/* Configuration Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Configuração</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                    Chave da API DeepL
                  </label>
                  <input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Sua chave da API DeepL"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Obtenha gratuitamente em{' '}
                    <a 
                      href="https://www.deepl.com/pro-api" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      deepl.com/pro-api
                    </a>
                  </p>
                </div>

                <div>
                  <label htmlFor="targetLanguage" className="block text-sm font-medium text-gray-700 mb-2">
                    Idioma de Destino
                  </label>
                  <select
                    id="targetLanguage"
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Upload Area */}
            <div className="p-8">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                  file 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".docx,.pptx,.xlsx,.pdf,.htm,.html,.txt,.xlf,.xliff,.srt"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />

                {file ? (
                  <div className="space-y-4">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Arquivo Selecionado
                      </h3>
                      <p className="text-gray-600 mb-1">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={resetUpload}
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Selecionar outro arquivo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Carregar Documento
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Arraste e solte seu arquivo aqui ou clique para selecionar
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Selecionar Arquivo
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p className="mb-2">Extensões suportadas:</p>
                      <p className="font-mono text-xs">
                        {allowedExtensions.join(', ')}
                      </p>
                    </div>
                    
                    {/* File Format Limits Table */}
                    <div className="mt-6 bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Limites por Formato de Arquivo</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-center py-2 font-medium text-gray-700">Formato</th>
                              <th className="text-center py-2 font-medium text-gray-700">API Pro</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-600">
                            <tr className="border-b border-gray-100">
                              <td className="py-2 font-mono">.docx / .doc</td>
                              <td className="text-center py-2">30 MB<br/>1M chars</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="py-2 font-mono">.pptx</td>
                              <td className="text-center py-2">30 MB<br/>1M chars</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="py-2 font-mono">.xlsx</td>
                              <td className="text-center py-2">30 MB<br/>1M chars</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="py-2 font-mono">.pdf</td>
                              <td className="text-center py-2">30 MB<br/>1M chars</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="py-2 font-mono">.txt</td>
                              <td className="text-center py-2">1 MB<br/>1M chars</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="py-2 font-mono">.html</td>
                              <td className="text-center py-2">5 MB<br/>1M chars</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="py-2 font-mono">.xlf / .xliff</td>
                              <td className="text-center py-2">10 MB<br/>1M chars</td>
                            </tr>
                            <tr>
                              <td className="py-2 font-mono">.srt</td>
                              <td className="text-center py-2">150 KB<br/>1M chars</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="text-xs text-gray-500 mt-3">
                        * Os limites aplicam-se por documento individual
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Processing Section */}
            {file && (
              <div className="border-t border-gray-100 p-8">
                <div className="space-y-6">
                  {/* Progress Bar */}
                  {processing.status !== 'idle' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {processing.message}
                        </span>
                        <span className="text-sm text-gray-500">
                          {processing.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            processing.status === 'error' 
                              ? 'bg-red-500' 
                              : processing.status === 'completed'
                              ? 'bg-green-500'
                              : 'bg-blue-500'
                          }`}
                          style={{ width: `${processing.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4">
                    {processing.status === 'idle' && (
                      <button
                        onClick={processFile}
                        disabled={!apiKey.trim()}
                        className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                          apiKey.trim()
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <FileText className="w-5 h-5" />
                        Traduzir com DeepL
                      </button>
                    )}

                    {(processing.status === 'uploading' || processing.status === 'processing') && (
                      <button
                        disabled
                        className="flex-1 bg-blue-400 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                      >
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processando...
                      </button>
                    )}

                    {processing.status === 'error' && (
                      <button
                        onClick={() => {
                          setProcessing({ status: 'idle', progress: 0, message: '' });
                          setErrorMessage('');
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <AlertCircle className="w-5 h-5" />
                        Tentar Novamente
                      </button>
                    )}
                  </div>

                  {/* Error Message */}
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-red-700 text-sm">{errorMessage}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Processamento Direto</h3>
              <p className="text-gray-600 text-sm">
                Seus arquivos são processados diretamente via API DeepL
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">IA Avançada</h3>
              <p className="text-gray-600 text-sm">
                Powered by DeepL para traduções de alta qualidade
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Download Instantâneo</h3>
              <p className="text-gray-600 text-sm">
                Baixe seu arquivo traduzido imediatamente
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;