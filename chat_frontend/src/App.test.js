import { render, screen } from '@testing-library/react';
import App from './App';

test('renders auth screen when not logged in', () => {
  render(<App />);
  const titleElement = screen.getByText(/Welcome back/i);
  expect(titleElement).toBeInTheDocument();
});
