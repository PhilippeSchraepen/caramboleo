import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MatchProvider, useMatch } from '@/context/MatchContext';
import { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <MatchProvider>{children}</MatchProvider>
);

const mockGames = [
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
];

describe('MatchContext - 20 Inning Rule & Sync', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    
    // Default fetch mock response with full game data
    (global.fetch as any).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
            id: '1',
            date: '2026-03-03',
            teamHome: 'Kerkuilen',
            teamAway: 'Rooie bal 2',
            games: mockGames
        }),
      })
    );
  });

  it('should initialize and try to fetch from Redis', async () => {
    const { result } = renderHook(() => useMatch(), { wrapper });
    
    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/match/1'));
    });
  });

  it('should not finish the game even if someone reaches the target early', async () => {
    const { result } = renderHook(() => useMatch(), { wrapper });
    
    // Wait for initial fetch to finish and populate games
    await waitFor(() => expect(result.current.match.games.length).toBeGreaterThan(0));
    
    const target = result.current.match.games[0].targetHome;
    
    act(() => {
      result.current.addTurn(1, 'home', target);
      result.current.addTurn(1, 'away', 0);
    });

    const game1 = result.current.match.games.find(g => g.id === 1);
    expect(game1?.status).toBe('ongoing');
  });

  it('should only finish when both players reach 20 turns', async () => {
    const { result } = renderHook(() => useMatch(), { wrapper });
    
    await waitFor(() => expect(result.current.match.games.length).toBeGreaterThan(0));

    act(() => {
      for (let i = 0; i < 19; i++) {
        result.current.addTurn(1, 'home', 0);
        result.current.addTurn(1, 'away', 0);
      }
    });

    let game1 = result.current.match.games.find(g => g.id === 1);
    expect(game1?.status).toBe('ongoing');

    act(() => {
      result.current.addTurn(1, 'home', 0);
      result.current.addTurn(1, 'away', 0);
    });
    
    game1 = result.current.match.games.find(g => g.id === 1);
    expect(game1?.status).toBe('finished');
  });
});
