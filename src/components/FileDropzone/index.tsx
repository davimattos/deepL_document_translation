import { Upload, CheckCircle } from "lucide-react";
import { Props } from "./types";

export function FileDropzone({
  handleDrop,
  handleDragOver,
  file,
  fileInputRef,
  handleFileSelect,
  allowedExtensions,
  handleExecutedFile
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
          accept=".docx,.pptx,.xlsx,.pdf,.htm,.html,.txt,.xlf,.xliff,.srt"
          onChange={(e) =>
            e.target.files?.[0] && handleFileSelect(e.target.files[0])
          }
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
              onClick={handleExecutedFile}
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
                {allowedExtensions.join(", ")}
              </p>
            </div>

            {/* File Format Limits Table */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                Limites por Formato de Arquivo
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-center py-2 font-medium text-gray-700">
                        Formato
                      </th>
                      <th className="text-center py-2 font-medium text-gray-700">
                        DeepL Suporte
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-mono">Word (.docx / .doc) </td>
                      <td className="text-center py-2">
                        30 MB
                        <br />
                        1M chars
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-mono">PowerPoint (.pptx) </td>
                      <td className="text-center py-2">
                        30 MB
                        <br />
                        1M chars
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-mono">Excel (.xlsx) </td>
                      <td className="text-center py-2">
                        30 MB
                        <br />
                        1M chars
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-mono">PDF (.pdf) </td>
                      <td className="text-center py-2">
                        30 MB
                        <br />
                        1M chars
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-mono">Text (.txt)</td>
                      <td className="text-center py-2">
                        1 MB
                        <br />
                        1M chars
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-mono">HTML (.html)</td>
                      <td className="text-center py-2">
                        5 MB
                        <br />
                        1M chars
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-mono">XLIFF (.xlf/.xliff)*</td>
                      <td className="text-center py-2">
                        10 MB
                        <br />
                        1M chars
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono">SRT (.srt) </td>
                      <td className="text-center py-2">
                        150 KB
                        <br />
                        1M chars
                      </td>
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
  );
}
