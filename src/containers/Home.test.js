import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './Home';

test('My Music Sheet Repo', () => {
    render(<Home />);
    const linkElement = screen.getByText(/My Music Sheet Repo/i);
    expect(linkElement).toBeInTheDocument();
})