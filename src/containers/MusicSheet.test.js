import { render, screen } from '@testing-library/react';
import React from  'react';
import MusicSheet from './MusicSheet';

test('renders learn react link', () => {
  render(<MusicSheet />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
