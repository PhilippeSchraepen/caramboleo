'use client';

import Link from 'next/link';
import { useMatch } from '@/context/MatchContext';

export default function MatchOverview() {
  const { match, resetMatch } = useMatch();

  const calculateTotalPoints = (turns: { points: number }[]) => {
    return turns.reduce((sum, t) => sum + t.points, 0);
  };

  const calculateMatchPoints = (total: number, target: number) => {
    return ((total / target) * 10).toFixed(2);
  };

  return (
    <div>
      <div className="card text-center">
        <h1>{match.teamHome} vs {match.teamAway}</h1>
        <p>{match.date}</p>
        <button 
          onClick={resetMatch} 
          className="button button-accent" 
          style={{ marginTop: '10px' }}
        >
          Reset Match
        </button>
      </div>

      <div className="card">
        <h2>Game Overview</h2>
        <table>
          <thead>
            <tr>
              <th>Game</th>
              <th>Player Home</th>
              <th>Player Away</th>
              <th>Score</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {match.games.map((game) => {
              const scoreHome = calculateTotalPoints(game.turnsHome);
              const scoreAway = calculateTotalPoints(game.turnsAway);
              const matchPointsHome = calculateMatchPoints(scoreHome, game.targetHome);
              const matchPointsAway = calculateMatchPoints(scoreAway, game.targetAway);

              return (
                <tr key={game.id}>
                  <td>Game {game.id}</td>
                  <td>
                    {game.playerHome.name} ({game.targetHome})
                    <br />
                    <small>MP: {matchPointsHome}</small>
                  </td>
                  <td>
                    {game.playerAway.name} ({game.targetAway})
                    <br />
                    <small>MP: {matchPointsAway}</small>
                  </td>
                  <td>{scoreHome} - {scoreAway}</td>
                  <td>
                    <span className={`status-badge ${game.status === 'ongoing' ? 'status-ongoing' : 'status-finished'}`}>
                      {game.status}
                    </span>
                  </td>
                  <td>
                    <Link href={`/game/${game.id}`} className="button button-primary">
                      {game.status === 'ongoing' ? 'Referee' : 'View'}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Match Summary</h3>
        <p>Total Match Points Home: {match.games.reduce((sum, g) => sum + parseFloat(calculateMatchPoints(calculateTotalPoints(g.turnsHome), g.targetHome)), 0).toFixed(2)}</p>
        <p>Total Match Points Away: {match.games.reduce((sum, g) => sum + parseFloat(calculateMatchPoints(calculateTotalPoints(g.turnsAway), g.targetAway)), 0).toFixed(2)}</p>
      </div>
    </div>
  );
}
