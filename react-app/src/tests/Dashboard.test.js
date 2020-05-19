import React from 'react';
import { render } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';

test('renders h1 element', () => {
  const { getByText } = render(<Dashboard />);
  const h1Element = getByText(/Dashboard/);
  expect(h1Element).toBeInTheDocument();
});
