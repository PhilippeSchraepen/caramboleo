'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Match, Game, Turn } from '../types';

interface MatchContextType {
  match: Match;
  addTurn: (gameId: number, player: 'home' | 'away', points: number) => void;
  undoTurn: (gameId: number) => void;
  updateGameStatus: (gameId: number, status: 'ongoing' | 'finished') => void;
  resetMatch: () => void;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'carambole_match_data';

const initialGames: Game[] = [
  // ... (keeping the same initial games structure)
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
  },
  {
    id: 2,
    playerHome: { name: 'Hugo Hectors', handicap: 18 },
    playerAway: { name: 'Cis Suykerbuyk', handicap: 15 },
    turnsHome: [],
    turnsAway: [],
    targetHome: 18,
    targetAway: 15,
    maxTurns: 20,
    status: 'ongoing'
  },
  {
    id: 3,
    playerHome: { name: 'Jef Schrooyen', handicap: 51 },
    playerAway: { name: 'Fred Dictus', handicap: 59 },
    turnsHome: [],
    turnsAway: [],
    targetHome: 51,
    targetAway: 59,
    maxTurns: 20,
    status: 'ongoing'
  },
  {
    id: 4,
    playerHome: { name: 'Cyriel van Ginneken', handicap: 20 },
    playerAway: { name: 'Leo Costermans', handicap: 15 },
    turnsHome: [],
    turnsAway: [],
    targetHome: 20,
    targetAway: 15,
    maxTurns: 20,
    status: 'ongoing'
  },
  {
    id: 5,
    playerHome: { name: 'Hubert Uytdewilge', handicap: 33 },
    playerAway: { name: 'Ed Ossenblock', handicap: 35 },
    turnsHome: [],
    turnsAway: [],
    targetHome: 33,
    targetAway: 35,
    maxTurns: 20,
    status: 'ongoing'
  },
  {
    id: 6,
    playerHome: { name: 'Stan Elst', handicap: 42 },
    playerAway: { name: 'Willy Lodewycks', handicap: 40 },
    turnsHome: [],
    turnsAway: [],
    targetHome: 42,
    targetAway: 40,
    maxTurns: 20,
    status: 'ongoing'
  }
];

const defaultMatch: Match = {
  id: '1',
  date: '2026-03-03',
  teamHome: 'Kerkuilen',
  teamAway: 'Rooie bal 2',
  games: initialGames
};

export const MatchProvider = ({ children }: { children: ReactNode }) => {
  const [match, setMatch] = useState<Match>(defaultMatch);
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
            const response = await fetch(`/api/match/${defaultMatch.id}`);
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
        ...defaultMatch,
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
