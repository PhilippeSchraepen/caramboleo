'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Match, Game } from '../types';
import { DEFAULT_MATCH, LOCAL_STORAGE_KEY } from '@/lib/constants';

interface MatchContextType {
  match: Match;
  addTurn: (gameId: number, player: 'home' | 'away', points: number) => void;
  undoTurn: (gameId: number) => void;
  updateGameStatus: (gameId: number, status: 'ongoing' | 'finished') => void;
  resetMatch: () => void;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider = ({ children }: { children: ReactNode }) => {
  const [match, setMatch] = useState<Match>(DEFAULT_MATCH);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount and try to fetch from Redis
  useEffect(() => {
    const savedMatch = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedMatch) {
      try {
        setMatch(JSON.parse(savedMatch));
      } catch (e) {
        console.error('Failed to parse saved match data', e);
      }
    }

    const fetchMatch = async () => {
        try {
            const response = await fetch(`/api/match/${DEFAULT_MATCH.id}`);
            if (response.ok) {
                const cloudMatch = await response.json();
                setMatch(cloudMatch);
            }
        } catch (e) {
            console.error('Could not fetch from Redis (might not be configured)', e);
        }
        setIsInitialized(true);
    };
    
    fetchMatch();
  }, []);

  // Sync to Redis and LocalStorage on changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(match));
      
      const syncToCloud = async () => {
          try {
              await fetch(`/api/match/${match.id}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(match),
              });
          } catch (e) {
              console.error('Cloud sync failed', e);
          }
      };
      
      syncToCloud();
    }
  }, [match, isInitialized]);

  // LIVE POLLING: Check for updates every 5 seconds if we are not the one updating
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/match/${match.id}`);
        if (response.ok) {
          const cloudMatch = await response.json();
          // Simple check: if turns count is different, update
          const totalTurnsCloud = cloudMatch.games.reduce((sum: number, g: Game) => sum + g.turnsHome.length + g.turnsAway.length, 0);
          const totalTurnsLocal = match.games.reduce((sum: number, g: Game) => sum + g.turnsHome.length + g.turnsAway.length, 0);
          
          if (totalTurnsCloud !== totalTurnsLocal) {
            setMatch(cloudMatch);
          }
        }
      } catch (e) {
        // Silent error
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [match.id, match.games]);

  const addTurn = (gameId: number, player: 'home' | 'away', points: number) => {
    setMatch(prev => {
      const updatedGames = prev.games.map(game => {
        if (game.id === gameId) {
          const updatedGame = { ...game };
          if (player === 'home') {
            updatedGame.turnsHome = [...game.turnsHome, { points }];
          } else {
            updatedGame.turnsAway = [...game.turnsAway, { points }];
          }
          
          const numHome = updatedGame.turnsHome.length;
          const numAway = updatedGame.turnsAway.length;
          const maxTurns = updatedGame.maxTurns;
          
          if (numHome >= maxTurns && numAway >= maxTurns) {
            updatedGame.status = 'finished';
          }
          
          return updatedGame;
        }
        return game;
      });
      return { ...prev, games: updatedGames };
    });
  };

  const undoTurn = (gameId: number) => {
    setMatch(prev => {
      const updatedGames = prev.games.map(game => {
        if (game.id === gameId) {
          const updatedGame = { ...game };
          if (updatedGame.turnsHome.length > updatedGame.turnsAway.length) {
             updatedGame.turnsHome = updatedGame.turnsHome.slice(0, -1);
          } else if (updatedGame.turnsAway.length > 0) {
             updatedGame.turnsAway = updatedGame.turnsAway.slice(0, -1);
          } else if (updatedGame.turnsHome.length > 0) {
             updatedGame.turnsHome = updatedGame.turnsHome.slice(0, -1);
          }
          updatedGame.status = 'ongoing';
          return updatedGame;
        }
        return game;
      });
      return { ...prev, games: updatedGames };
    });
  };

  const updateGameStatus = (gameId: number, status: 'ongoing' | 'finished') => {
    setMatch(prev => {
      const updatedGames = prev.games.map(game => {
        if (game.id === gameId) {
          return { ...game, status };
        }
        return game;
      });
      return { ...prev, games: updatedGames };
    });
  };

  const resetMatch = () => {
    if (confirm('Are you sure you want to reset all data for this match?')) {
      const resetMatchData = {
        ...DEFAULT_MATCH,
        lastReset: new Date().toLocaleString()
      };
      setMatch(resetMatchData);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  return (
    <MatchContext.Provider value={{ match, addTurn, undoTurn, updateGameStatus, resetMatch }}>
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
};
