import React from 'react';
import { render } from '@testing-library/react';
import Home from '../pages/Home';

test('renders h1 element', () => {
  const { getByText } = render(<Home />);
  const h1Element = getByText(/Home/);
  expect(h1Element).toBeInTheDocument();
});
