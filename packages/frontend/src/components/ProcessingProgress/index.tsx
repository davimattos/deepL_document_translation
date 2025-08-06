import { FileText, Loader2, AlertCircle } from "lucide-react";
import { ErrorMessage } from "../ErrorMessage";
import { Props } from "./types";

export function ProcessingProgress({
  processing,
  processFile,
  apiKey,
  setProcessing,
  setErrorMessage,
  errorMessage,
}: Props) {
  return (
    <div className="border-t border-gray-100 p-8">
      <div className="space-y-6">
        {/* Progress Bar */}
        {processing.status !== "idle" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {processing.message}
              </span>
              <span className="text-sm text-gray-500">
                {processing.progress}%
              </span>
            </div>
            <div
              className="w-full bg-gray-200 rounded-full h-2"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={processing.progress}
              aria-label="Progresso de tradução"
            >
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  processing.status === "error"
                    ? "bg-red-500"
                    : processing.status === "completed"
                    ? "bg-green-500"
                    : "bg-blue-500"
                }`}
                style={{ width: `${processing.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {processing.status === "idle" && (
            <button
              onClick={processFile}
              disabled={!apiKey.trim()}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                apiKey.trim()
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <FileText className="w-5 h-5" />
              Traduzir com DeepL
            </button>
          )}

          {(processing.status === "uploading" ||
            processing.status === "processing") && (
            <button
              disabled
              className="flex-1 bg-blue-400 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              Processando...
            </button>
          )}

          {processing.status === "error" && (
            <button
              onClick={() => {
                setProcessing({
                  status: "idle",
                  progress: 0,
                  message: "",
                });
                setErrorMessage("");
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <AlertCircle className="w-5 h-5" />
              Tentar Novamente
            </button>
          )}
        </div>

        {/* Error Message */}
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
      </div>
    </div>
  );
}
