export interface Player {
  name: string;
  handicap: number;
}

export interface Turn {
  points: number;
}

export interface Game {
  id: number;
  playerHome: Player;
  playerAway: Player;
  turnsHome: Turn[];
  turnsAway: Turn[];
  targetHome: number;
  targetAway: number;
  maxTurns: number;
  status: 'ongoing' | 'finished';
}

export interface Match {
  id: string;
  date: string;
  teamHome: string;
  teamAway: string;
  games: Game[];
}
