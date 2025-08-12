import axios from 'axios';

export interface TranslateParams {
  file: File;
  sourceLang: string;
  targetLang: string;
}

export interface TranslateResponse {
  success: boolean;
  message: string;
  downloadUrl: string;
  filename: string;
  originalFilename: string;
}

export async function uploadAndStartTranslation({
  file,
  sourceLang,
  targetLang,
}: TranslateParams): Promise<TranslateResponse> {
  console.log("Passo 1: Iniciando o upload do arquivo...");

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("source_lang", sourceLang);
    formData.append("target_lang", targetLang);

    const uploadResponse = await axios.post("http://localhost:3001/api/upload", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    const { fileKey } = uploadResponse.data;

    console.log(`Passo 1 concluído. Chave do arquivo: ${fileKey}`);
    console.log("Passo 2: Solicitando a tradução...");

    const translateResponse = await axios.post("http://localhost:3001/api/translate", {
      fileKey,
      originalFilename: file.name,
      target_lang: targetLang,
      source_lang: sourceLang,
    });

    console.log("Tradução concluída:", translateResponse.data);
    return translateResponse.data;

  } catch (err) {
    console.error("Erro na composição de upload + tradução:", err);
    throw err;
  }
}
