import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { InfoCard } from "../../../components/InfoCard";
import { FileText } from "lucide-react";

describe("InfoCard component", () => {
  const icon = <FileText aria-label="info icon" role="img" />;

  it("should render icon, title and description", () => {
    render(
      <InfoCard
        icon={icon}
        title="Título de exemplo"
        description="Esta é a descrição do cartão de informação."
      />
    );

    expect(screen.getByRole("img", { name: /info icon/i })).toBeInTheDocument();

    expect(screen.getByRole("heading", { level: 3, name: /título de exemplo/i })).toBeInTheDocument();

    expect(screen.getByText(/descrição do cartão de informação/i)).toBeInTheDocument();
  });

  it("renders with default className", () => {
    render(
      <InfoCard
        icon={icon}
        title="Teste"
        description="Descrição"
      />
    );

    const iconContainer = screen.getByRole("img", { name: /info icon/i }).parentElement;
    expect(iconContainer).toHaveClass("bg-gray-100");
  });

  it("renders with custom className", () => {
    render(
      <InfoCard
        icon={icon}
        title="Teste"
        description="Descrição"
        className="bg-red-500"
      />
    );

    const iconContainer = screen.getByRole("img", { name: /info icon/i }).parentElement;
    expect(iconContainer).toHaveClass("bg-red-500");
  });

  it("matches snapshot", () => {
    const { container } = render(
      <InfoCard
        icon={icon}
        title="Snapshot Title"
        description="Snapshot description"
      />
    );
    expect(container).toMatchSnapshot();
  });
});
