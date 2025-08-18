import { useState } from "react";
import { translateDocument } from "../services/translationService";

export type ProcessingState =
  | { status: "idle"; progress: 0; message: "" }
  | { status: "uploading" | "processing"; progress: number; message: string }
  | { status: "completed"; progress: 100; message: string }
  | { status: "error"; progress: 0; message: string };

export function useDocumentTranslation(file: File | null, sourceLang: string, targetLang: string) {
  const [processing, setProcessing] = useState<ProcessingState>({
    status: "idle",
    progress: 0,
    message: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  const processFile = async () => {
    if (!file) {
      setErrorMessage("Por favor, selecione um arquivo");
      setProcessing({
        status: "error",
        progress: 0,
        message: "Arquivo necessário",
      });
      return;
    }

    try {
      setProcessing({
        status: "uploading",
        progress: 10,
        message: "Enviando arquivo...",
      });

      setErrorMessage("");

      setProcessing({
        status: "processing",
        progress: 50,
        message: "Traduzindo documento...",
      });

      const result = await translateDocument({
        file,
        sourceLang,
        targetLang,
      });

      setProcessing({
        status: "processing",
        progress: 90,
        message: "Finalizando download...",
      });

      setProcessing({
        status: "completed",
        progress: 100,
        message: "Documento processado com sucesso!",
      });

      window.open(`http://localhost:3001${result.downloadUrl}`, "_blank");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setErrorMessage(msg);
      setProcessing({
        status: "error",
        progress: 0,
        message: "Erro no processamento",
      });
    }
  };

  return {
    processing,
    errorMessage,
    processFile,
    setErrorMessage,
    setProcessing,
  };
}
