'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Match, Game, Turn } from '../types';

interface MatchContextType {
  match: Match;
  addTurn: (gameId: number, player: 'home' | 'away', points: number) => void;
  undoTurn: (gameId: number) => void;
  updateGameStatus: (gameId: number, status: 'ongoing' | 'finished') => void;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

const initialGames: Game[] = [
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

export const MatchProvider = ({ children }: { children: ReactNode }) => {
  const [match, setMatch] = useState<Match>({
    id: '1',
    date: '2026-03-03',
    teamHome: 'Kerkuilen',
    teamAway: 'Rooie bal 2',
    games: initialGames
  });

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
          
          // Check if game should finish
          const totalHome = updatedGame.turnsHome.reduce((sum, t) => sum + t.points, 0);
          const totalAway = updatedGame.turnsAway.reduce((sum, t) => sum + t.points, 0);
          const numHome = updatedGame.turnsHome.length;
          const numAway = updatedGame.turnsAway.length;
          const maxTurns = updatedGame.maxTurns;
          
          // Rule: The game always lasts exactly 20 turns for both players.
          // It only finishes when BOTH players have reached maxTurns.
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
          // Undo last action logic: if turns are equal, undo home. If home > away, undo home. 
          // Simplified: pop the last turn from the one that has more or the same if they are equal (referee usually inputs turn by turn).
          // Actually, let's just pop from home if home.length >= away.length, else away.
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

  return (
    <MatchContext.Provider value={{ match, addTurn, undoTurn, updateGameStatus }}>
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
