import { render, screen } from "@testing-library/react";

import { ErrorMessage } from "../../../components/ErrorMessage";

describe("ErrorMessage component", () => {
  const errorText = "Something went wrong";

  it("renders the error message", () => {
    render(<ErrorMessage errorMessage={errorText} />);

    const paragraph = screen.getByText(errorText);
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent(errorText);
    expect(paragraph).toHaveClass("text-red-700");
  });

  it("renders the alert icon with correct role", () => {
    render(<ErrorMessage errorMessage={errorText} />);
    
    const svgIcon = screen.getByTestId("alert-icon");
    expect(svgIcon).toBeInTheDocument();
    expect(svgIcon).toHaveClass("text-red-500");
  });

  it("matches snapshot", () => {
    const { container } = render(<ErrorMessage errorMessage={errorText} />);
    expect(container).toMatchSnapshot();
  });
});
