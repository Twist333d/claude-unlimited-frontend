import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../../components/Header';

test('renders header with correct title', () => {
  render(<Header />);
  const titleElement = screen.getByText(/Claude Unlimited/i);
  expect(titleElement).toBeInTheDocument();
});