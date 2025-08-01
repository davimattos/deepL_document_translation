import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProcessingProgress } from "../../../components/ProcessingProgress";

describe("ProcessingProgress component", () => {
  const mockProcessFile = vi.fn();
  const mockSetProcessing = vi.fn();
  const mockSetErrorMessage = vi.fn();

  const baseProps = {
    apiKey: "some-api-key",
    processFile: mockProcessFile,
    setProcessing: mockSetProcessing,
    setErrorMessage: mockSetErrorMessage,
    errorMessage: "",
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders translate button enabled when status is idle and apiKey is provided", () => {
    render(
      <ProcessingProgress
        {...baseProps}
        processing={{ status: "idle", progress: 0, message: "" }}
      />
    );

    const button = screen.getByRole("button", { name: /traduzir com deepl/i });
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(mockProcessFile).toHaveBeenCalled();
  });

  it("renders translate button disabled when apiKey is empty", () => {
    render(
      <ProcessingProgress
        {...baseProps}
        apiKey="   "
        processing={{ status: "idle", progress: 0, message: "" }}
      />
    );

    const button = screen.getByRole("button", { name: /traduzir com deepl/i });
    expect(button).toBeDisabled();
  });

  it("renders error retry button and calls setProcessing and setErrorMessage on click", () => {
    render(
      <ProcessingProgress
        {...baseProps}
        processing={{ status: "error", progress: 50, message: "Erro!" }}
      />
    );

    const button = screen.getByRole("button", { name: /tentar novamente/i });
    expect(button).toBeEnabled();

    fireEvent.click(button);

    expect(mockSetProcessing).toHaveBeenCalledWith({
      status: "idle",
      progress: 0,
      message: "",
    });
    expect(mockSetErrorMessage).toHaveBeenCalledWith("");
  });

  it("renders progress bar with correct aria attributes when status is not idle", () => {
    render(
      <ProcessingProgress
        {...baseProps}
        processing={{ status: "processing", progress: 65, message: "Carregando" }}
      />
    );

    const progressbar = screen.getByRole("progressbar", { name: /progresso de tradução/i });
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "100");
    expect(progressbar).toHaveAttribute("aria-valuenow", "65");
  });

  it("renders error message component when errorMessage is set", () => {
    render(
      <ProcessingProgress
        {...baseProps}
        processing={{ status: "error", progress: 0, message: "" }}
        errorMessage="Erro ao processar"
      />
    );

    expect(screen.getByText(/erro ao processar/i)).toBeInTheDocument();
  });

  it("matches snapshot in idle state", () => {
    const { container } = render(
      <ProcessingProgress
        {...baseProps}
        processing={{ status: "idle", progress: 0, message: "" }}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot in processing state", () => {
    const { container } = render(
      <ProcessingProgress
        {...baseProps}
        processing={{ status: "processing", progress: 50, message: "Carregando" }}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot in error state", () => {
    const { container } = render(
      <ProcessingProgress
        {...baseProps}
        processing={{ status: "error", progress: 0, message: "Erro" }}
        errorMessage="Algo deu errado"
      />
    );
    expect(container).toMatchSnapshot();
  });
});
