import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";

import { useDocumentTranslation } from "../../hooks/useDocumentTranslation";
import { TranslateResponse } from "../../services/translationService";


const mockFile = new File(["dummy content"], "test.pdf", { type: "application/pdf" });

describe("useDocumentTranslation", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    vi.stubGlobal("open", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should handle missing file", async () => {
    const { result } = renderHook(() =>
      useDocumentTranslation(null, "EN", "PT", "fake-api-key")
    );

    await act(async () => {
      await result.current.processFile();
    });

    expect(result.current.errorMessage).toBe("Por favor, selecione um arquivo");
    expect(result.current.processing.status).toBe("error");
  });

  it("should process the file successfully", async () => {
    const mockResponse: TranslateResponse = {
      downloadUrl: "/files/translated.pdf",
    };

    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockResponse)),
    });

    const { result } = renderHook(() =>
      useDocumentTranslation(mockFile, "EN", "PT", "fake-api-key")
    );

    await act(async () => {
      await result.current.processFile();
    });

    expect(result.current.processing.status).toBe("completed");
    expect(result.current.processing.progress).toBe(100);
    expect(result.current.errorMessage).toBe("");
    expect(window.open).toHaveBeenCalledWith("http://localhost:3001/files/translated.pdf", "_blank");
  });

  it("should handle API error", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      text: () => Promise.resolve(JSON.stringify({ error: "Invalid API Key" })),
    });

    const { result } = renderHook(() =>
      useDocumentTranslation(mockFile, "EN", "PT", "invalid-api-key")
    );

    await act(async () => {
      await result.current.processFile();
    });

    expect(result.current.errorMessage).toBe(JSON.stringify({"error": "Invalid API Key"}));
    expect(result.current.processing.status).toBe("error");
  });

  it("should handle malformed error response", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      text: () => Promise.resolve("Internal Server Error"),
    });

    const { result } = renderHook(() =>
      useDocumentTranslation(mockFile, "EN", "PT", "fake-api-key")
    );

    await act(async () => {
      await result.current.processFile();
    });

    expect(result.current.errorMessage).toBe("Internal Server Error");
    expect(result.current.processing.status).toBe("error");
  });
});
