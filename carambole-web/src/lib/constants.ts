import { Match, Game } from "@/types";

export const INITIAL_GAMES: Game[] = [
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

export const DEFAULT_MATCH: Match = {
  id: '1',
  date: '2026-03-03',
  teamHome: 'Kerkuilen',
  teamAway: 'Rooie bal 2',
  games: INITIAL_GAMES
};

export const LOCAL_STORAGE_KEY = 'carambole_match_data';
