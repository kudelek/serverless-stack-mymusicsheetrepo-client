import { render, screen } from '@testing-library/react';
import React from  'react';
import NotFound from './NotFound';

test('renders learn react link', () => {
  render(<NotFound />);
  const linkElement = screen.getByText(/Sorry, page not found!/i);
  expect(linkElement).toBeInTheDocument();
});
