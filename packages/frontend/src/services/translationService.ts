export interface TranslateParams {
  file: File;
  sourceLang: string;
  targetLang: string;
}

export interface TranslateResponse {
  downloadUrl: string;
}

export async function translateDocument({
  file,
  sourceLang,
  targetLang,
}: TranslateParams): Promise<TranslateResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("source_lang", sourceLang);
  formData.append("target_lang", targetLang);

  const response = await fetch("http://localhost:3001/api/translate", {
    method: "POST",
    body: formData,
  });

  const responseText = await response.text();

  if (!response.ok) {
    try {
      const errorData = JSON.parse(responseText);
      throw new Error(
        errorData.error || errorData.message || "Erro na tradução"
      );
    } catch {
      throw new Error(responseText || "Erro desconhecido");
    }
  }

  return JSON.parse(responseText);
}
