import axios from "axios";

export async function getDownloadLink(
  translatedFileKey: string
): Promise<any> {
  if (!translatedFileKey) {
    throw new Error("A chave do arquivo traduzido é necessária.");
  }

  try {
    const response = await axios.get(`http://localhost:3001/api/download/${translatedFileKey}`, {
      responseType: "blob",
    });

    console.log("response.headers['content-type']", response.headers['content-type']);
    console.log("response.data", response.data);

    return response;
  } catch (error) {
    console.error("Falha no download:", error);
  } finally {
    // setIsLoading(false);
  }
}
