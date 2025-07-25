import React, { useEffect, useRef, useState } from "react";
import { Upload, Download, FileText } from "lucide-react";
import {
  FileDropzone,
  Header,
  InfoCard,
  LanguageSelector,
  ProcessingProgress,
} from "./components";
import { languages, sourceLanguages, allowedExtensions } from "./data";
import { useDocumentTranslation } from "./hooks/useDocumentTranslation";

export interface ProcessingState {
  status: "idle" | "uploading" | "processing" | "completed" | "error";
  progress: number;
  message: string;
}

function App() {
  const [apiKey] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sourceLanguage, setSourceLanguage] = useState<string>("auto");
  const [targetLanguage, setTargetLanguage] = useState<string>("en-US");
  
  const {
    processing,
    processFile,
    setProcessing,
    errorMessage,
    setErrorMessage,
  } = useDocumentTranslation(file, sourceLanguage, targetLanguage, apiKey);

  const handleFileSelect = (selectedFile: File) => {
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    if (ext && allowedExtensions.includes(ext)) {
      setFile(selectedFile);
      setErrorMessage("");
      setProcessing({ status: "idle", progress: 0, message: "" });
    } else {
      setFile(null);
      setProcessing({
        status: "error",
        progress: 0,
        message: "Tipo de arquivo não suportado",
      });
      setErrorMessage(
        `Por favor, selecione apenas arquivos com as extensões permitidas: ${allowedExtensions.join(
          ", "
        )}`
      );
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleExecutedFile = () => {
    setFile(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Header />

          <LanguageSelector
            languages={languages}
            sourceLanguages={sourceLanguages}
            source={{ sourceLanguage, setSourceLanguage }}
            target={{ targetLanguage, setTargetLanguage }}
          />

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <FileDropzone
              handleDrop={handleDrop}
              handleDragOver={handleDragOver}
              file={file}
              fileInputRef={fileInputRef}
              handleFileSelect={handleFileSelect}
              handleExecutedFile={handleExecutedFile}
              allowedExtensions={allowedExtensions}
            />

            {file && (
              <ProcessingProgress
                processing={processing}
                processFile={processFile}
                apiKey={apiKey}
                setProcessing={setProcessing}
                setErrorMessage={setErrorMessage}
                errorMessage={errorMessage}
              />
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <InfoCard
              className="bg-blue-100"
              icon={<Upload className="w-6 h-6 text-blue-600" />}
              title="Processamento Direto"
              description="Seus arquivos são processados diretamente via API DeepL"
            />
            <InfoCard
            className="bg-green-100"
              icon={<FileText className="w-6 h-6 text-green-600" />}
              title="IA Avançada"
              description="Powered by DeepL para traduções de alta qualidade"
            />
            <InfoCard
            className="bg-purple-100"
              icon={<Download className="w-6 h-6 text-purple-600" />}
              title="Download Instantâneo"
              description="Baixe seu arquivo traduzido imediatamente"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
