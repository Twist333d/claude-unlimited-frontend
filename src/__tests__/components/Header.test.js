// src/__tests__/components/Header.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "../../components/layout/Header";

test("renders header with correct title", () => {
  const mockUsage = { total_tokens: 0, total_cost: 0 };
  render(<Header usage={mockUsage} />);
  const titleElement = screen.getByText(/Claude Unlimited/i);
  expect(titleElement).toBeInTheDocument();
});
