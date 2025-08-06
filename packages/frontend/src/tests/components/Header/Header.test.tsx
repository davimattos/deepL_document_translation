import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Header } from "../../../components/Header";

describe("Header component", () => {
  it("should render icon, heading and description", () => {
    render(<Header />);

    const svgIcon = screen.getByRole("img", { hidden: true });
    expect(svgIcon).toBeInTheDocument();

    const heading = screen.getByRole("heading", { level: 1, name: /tradutor de documentos/i });
    expect(heading).toBeInTheDocument();

    const description = screen.getByText(/traduza seus documentos usando a api do deepl/i);
    expect(description).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(<Header />);
    expect(container).toMatchSnapshot();
  });
});
