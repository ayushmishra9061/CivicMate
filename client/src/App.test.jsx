import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';

describe('Landing', () => {
  it('renders CivicMate name', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Landing />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getAllByText('CivicMate').length).toBeGreaterThan(0);
  });
});
