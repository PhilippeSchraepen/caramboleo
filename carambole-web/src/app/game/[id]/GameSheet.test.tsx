import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GameSheet from './page';
import { MatchProvider } from '@/context/MatchContext';

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
  useRouter: () => ({ push: vi.fn() }),
}));

describe('GameSheet UI', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render player names and targets', () => {
    render(
      <MatchProvider>
        <GameSheet />
      </MatchProvider>
    );
    
    expect(screen.getAllByText(/Wies Peeters/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/John Donckers/)[0]).toBeInTheDocument();
    expect(screen.getByText(/28/)).toBeInTheDocument();
    expect(screen.getByText(/25/)).toBeInTheDocument();
  });

  it('should update score when clicking point buttons', () => {
    render(
      <MatchProvider>
        <GameSheet />
      </MatchProvider>
    );
    
    const pointBtn5 = screen.getByRole('button', { name: '5' });
    fireEvent.click(pointBtn5);
    
    // Total score for Wies Peeters should now be 5
    expect(screen.getByText('5 / 28')).toBeInTheDocument();
  });

  it('should switch current player after entry', () => {
    render(
      <MatchProvider>
        <GameSheet />
      </MatchProvider>
    );
    
    // Using a more flexible matcher for text split across elements
    expect(screen.getByText((content) => content.includes('Recording for: Wies Peeters'))).toBeInTheDocument();
    
    const pointBtn = screen.getByRole('button', { name: '5' });
    fireEvent.click(pointBtn);
    
    expect(screen.getByText((content) => content.includes('Recording for: John Donckers'))).toBeInTheDocument();
  });
});
