import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MatchProvider, useMatch } from '@/context/MatchContext';
import { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <MatchProvider>{children}</MatchProvider>
);

describe('MatchContext - 20 Inning Rule', () => {
  it('should not finish the game even if someone reaches the target early', () => {
    const { result } = renderHook(() => useMatch(), { wrapper });
    const target = result.current.match.games[0].targetHome;
    
    act(() => {
      // Home reaches target in turn 1
      result.current.addTurn(1, 'home', target);
      result.current.addTurn(1, 'away', 0);
    });

    const game1 = result.current.match.games.find(g => g.id === 1);
    expect(game1?.status).toBe('ongoing');
    expect(game1?.turnsHome).toHaveLength(1);
  });

  it('should only finish when both players reach 20 turns', () => {
    const { result } = renderHook(() => useMatch(), { wrapper });
    
    act(() => {
      // Fill 19 turns
      for (let i = 0; i < 19; i++) {
        result.current.addTurn(1, 'home', 0);
        result.current.addTurn(1, 'away', 0);
      }
    });

    let game1 = result.current.match.games.find(g => g.id === 1);
    expect(game1?.status).toBe('ongoing');

    act(() => {
      result.current.addTurn(1, 'home', 0);
    });
    game1 = result.current.match.games.find(g => g.id === 1);
    expect(game1?.status).toBe('ongoing'); // Home has 20, Away has 19

    act(() => {
      result.current.addTurn(1, 'away', 0);
    });
    game1 = result.current.match.games.find(g => g.id === 1);
    expect(game1?.status).toBe('finished'); // Both have 20
  });

  it('should allow scoring more than the target', () => {
    const { result } = renderHook(() => useMatch(), { wrapper });
    const target = result.current.match.games[0].targetHome; // 28
    
    act(() => {
      result.current.addTurn(1, 'home', target + 10); // Score 38
      result.current.addTurn(1, 'away', 0);
    });

    const game1 = result.current.match.games.find(g => g.id === 1);
    const scoreHome = game1?.turnsHome.reduce((sum, t) => sum + t.points, 0);
    expect(scoreHome).toBe(38);
    expect(game1?.status).toBe('ongoing');
  });
});
