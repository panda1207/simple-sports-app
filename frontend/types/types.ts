export interface Game {
  id: string;
  homeTeam: {
    name: string;
    abbreviation: string;
  };
  awayTeam: {
    name: string;
    abbreviation: string;
  };
  status: string;
  odds: {
    spread: number;
    favorite: string;
  }
  winner?: string;
  homeScore?: number;
  awayScore?: number;
  period?: string;
  clock?: string;
}

export interface Prediction {
  id: string;
  gameId: string;
  pick: string;
  amount: number;
  result: 'win' | 'loss' | 'pending';
}

export interface User {
  username: string;
  balance: number;
  predictions: Prediction[];
  stats: { wins: number; losses: number; pending: number };
}
