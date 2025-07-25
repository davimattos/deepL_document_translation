import { translateDocument } from "../../services/translationService"; // ajuste esse path conforme necessário
    
describe("translateDocument", () => {
  const fakeFile = new File(["file content"], "test.docx", {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  const fakeSourceLang = "EN";
  const fakeTargetLang = "PT";
  const fakeApiKey = "fake-api-key";

  const fetchMock = vi.fn();
  (globalThis.fetch as typeof fetchMock) = fetchMock;

  beforeEach(() => {
    (globalThis.fetch as unknown) = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("retorna os dados corretamente em caso de sucesso", async () => {
    const mockResponseData = { downloadUrl: "https://example.com/file-translated.docx" };
    const mockFetchResponse = {
      ok: true,
      text: vi.fn().mockResolvedValue(JSON.stringify(mockResponseData)),
    };

    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockFetchResponse);

    const result = await translateDocument({
      file: fakeFile,
      sourceLang: fakeSourceLang,
      targetLang: fakeTargetLang,
      apiKey: fakeApiKey,
    });

    expect(globalThis.fetch).toHaveBeenCalledOnce();
    expect(result).toEqual(mockResponseData);

    const fetchCall = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = fetchCall[1]?.body as FormData;
    expect(body.get("file")).toBe(fakeFile);
    expect(body.get("source_lang")).toBe(fakeSourceLang);
    expect(body.get("target_lang")).toBe(fakeTargetLang);
  });

  it("lança erro com mensagem vinda do campo `error` no JSON", async () => {
    const errorJson = { error: "Token inválido" };
    const mockFetchResponse = {
      ok: false,
      text: vi.fn().mockResolvedValue(JSON.stringify(errorJson)),
    };

    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockFetchResponse);

    await expect(
      translateDocument({
        file: fakeFile,
        sourceLang: fakeSourceLang,
        targetLang: fakeTargetLang,
        apiKey: fakeApiKey,
      })
    ).rejects.toThrow("Token inválido");
  });

  it("lança erro com mensagem vinda do campo `message` no JSON", async () => {
    const errorJson = { message: "Arquivo inválido" };
    const mockFetchResponse = {
      ok: false,
      text: vi.fn().mockResolvedValue(JSON.stringify(errorJson)),
    };

    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockFetchResponse);

    await expect(
      translateDocument({
        file: fakeFile,
        sourceLang: fakeSourceLang,
        targetLang: fakeTargetLang,
        apiKey: fakeApiKey,
      })
    ).rejects.toThrow("Arquivo inválido");
  });

  it("lança erro com mensagem de texto simples", async () => {
    const mockFetchResponse = {
      ok: false,
      text: vi.fn().mockResolvedValue("Erro inesperado"),
    };

    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockFetchResponse);

    await expect(
      translateDocument({
        file: fakeFile,
        sourceLang: fakeSourceLang,
        targetLang: fakeTargetLang,
        apiKey: fakeApiKey,
      })
    ).rejects.toThrow("Erro inesperado");
  });

  it("lança erro genérico caso texto vazio", async () => {
    const mockFetchResponse = {
      ok: false,
      text: vi.fn().mockResolvedValue(""),
    };

    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockFetchResponse);

    await expect(
      translateDocument({
        file: fakeFile,
        sourceLang: fakeSourceLang,
        targetLang: fakeTargetLang,
        apiKey: fakeApiKey,
      })
    ).rejects.toThrow("Erro desconhecido");
  });
});
