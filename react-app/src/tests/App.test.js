import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

test('renders home message', () => {
  const { getAllByText } = render(<App />);
  expect(getAllByText('Home')).toHaveLength(2);
});
