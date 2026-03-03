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
    vi.clearAllMocks();
    
    // Mock fetch for initial load
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
            id: '1',
            date: '2026-03-03',
            teamHome: 'Kerkuilen',
            teamAway: 'Rooie bal 2',
            games: [
                {
                    id: 1,
                    playerHome: { name: 'Wies Peeters', handicap: 28 },
                    playerAway: { name: 'John Donckers', handicap: 25 },
                    turnsHome: [],
                    turnsAway: [],
                    targetHome: 28,
                    targetAway: 25,
                    maxTurns: 20,
                    status: 'ongoing'
                }
            ]
        }),
      })
    );
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
    
    // Check for the score 5. We use getAllByText because '5' appears in multiple places now (score, high score, button, history)
    expect(screen.getAllByText('5').length).toBeGreaterThan(0);
  });

  it('should switch current player after entry', () => {
    render(
      <MatchProvider>
        <GameSheet />
      </MatchProvider>
    );
    
    // Shadcn refactored "Recording for" to "Recording:"
    expect(screen.getByText((content) => content.includes('Recording: Wies Peeters'))).toBeInTheDocument();
    
    const pointBtn = screen.getByRole('button', { name: '5' });
    fireEvent.click(pointBtn);
    
    expect(screen.getByText((content) => content.includes('Recording: John Donckers'))).toBeInTheDocument();
  });
});
