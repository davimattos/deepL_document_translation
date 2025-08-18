import { Upload, CheckCircle } from "lucide-react";
import { Props } from "./types";

export function FileDropzone({
  handleDrop,
  handleDragOver,
  file,
  fileInputRef,
  handleFileSelect,
  allowedExtensions,
}: Props) {
  return (
    <div className="p-8">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
          file
            ? "border-green-300 bg-green-50"
            : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedExtensions.toString()}
          onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
        />

        {file ? (
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Arquivo Selecionado</h3>
              <p className="text-gray-600 mb-1">{file.name}</p>
              <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Selecionar outro arquivo
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-16 h-16 text-gray-400 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Carregar Documento</h3>
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
              <p className="font-mono text-xs">{allowedExtensions.join(", ")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
