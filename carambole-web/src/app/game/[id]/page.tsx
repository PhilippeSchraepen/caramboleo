'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMatch } from '@/context/MatchContext';
import Link from 'next/link';

export default function GameSheet() {
  const { id } = useParams();
  const router = useRouter();
  const { match, addTurn, undoTurn } = useMatch();
  
  const gameId = parseInt(id as string);
  const game = match.games.find(g => g.id === gameId);

  if (!game) {
    return <div>Game not found</div>;
  }

  const scoreHome = game.turnsHome.reduce((sum, t) => sum + t.points, 0);
  const scoreAway = game.turnsAway.reduce((sum, t) => sum + t.points, 0);
  
  // If home just played their Nth turn, and away hasn't, it's still Turn N for Away.
  const currentTurn = game.turnsHome.length > game.turnsAway.length 
    ? game.turnsHome.length 
    : game.turnsHome.length + 1;

  const nextPlayer = game.turnsHome.length <= game.turnsAway.length ? 'home' : 'away';

  const handlePointClick = (points: number) => {
    if (game.status === 'finished') return;
    addTurn(gameId, nextPlayer, points);
  };

  return (
    <div>
      <div className="card text-center">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" className="button button-primary">Back to Overview</Link>
          <h2>Game {game.id}: {game.playerHome.name} vs {game.playerAway.name}</h2>
          <span className={`status-badge ${game.status === 'ongoing' ? 'status-ongoing' : 'status-finished'}`}>
            {game.status}
          </span>
        </div>
      </div>

      <div className="grid">
        <div className="card text-center">
          <h3>{game.playerHome.name}</h3>
          <p style={{ fontSize: '3rem', margin: '10px 0' }}>{scoreHome} / {game.targetHome}</p>
          {scoreHome >= game.targetHome && <p className="status-badge status-finished">Target Reached!</p>}
          <p>Innings: {game.turnsHome.length} / {game.maxTurns}</p>
          <p>Average: {game.turnsHome.length > 0 ? (scoreHome / game.turnsHome.length).toFixed(2) : 0}</p>
          <p>Highest: {game.turnsHome.length > 0 ? Math.max(...game.turnsHome.map(t => t.points)) : 0}</p>
        </div>

        <div className="card text-center">
          <h3>{game.playerAway.name}</h3>
          <p style={{ fontSize: '3rem', margin: '10px 0' }}>{scoreAway} / {game.targetAway}</p>
          {scoreAway >= game.targetAway && <p className="status-badge status-finished">Target Reached!</p>}
          <p>Innings: {game.turnsAway.length} / {game.maxTurns}</p>
          <p>Average: {game.turnsAway.length > 0 ? (scoreAway / game.turnsAway.length).toFixed(2) : 0}</p>
          <p>Highest: {game.turnsAway.length > 0 ? Math.max(...game.turnsAway.map(t => t.points)) : 0}</p>
        </div>
      </div>

      <div className="card text-center">
        {game.status === 'ongoing' ? (
          <>
            <h3>Current Turn: {currentTurn}</h3>
            <h4>Recording for: {nextPlayer === 'home' ? game.playerHome.name : game.playerAway.name}</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(pts => (
                <button key={pts} onClick={() => handlePointClick(pts)} className="button button-primary" style={{ fontSize: '1.5rem', minWidth: '60px' }}>
                  {pts}
                </button>
              ))}
            </div>
            <div style={{ marginTop: '20px' }}>
              <button onClick={() => undoTurn(gameId)} className="button button-accent">Undo Last Entry</button>
            </div>
          </>
        ) : (
          <h3>Game Finished!</h3>
        )}
      </div>

      <div className="card">
        <h3>Turn History</h3>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <h4>{game.playerHome.name}</h4>
            <ul>
              {game.turnsHome.map((t, i) => <li key={i}>Turn {i + 1}: {t.points} pts</li>)}
            </ul>
          </div>
          <div style={{ flex: 1 }}>
            <h4>{game.playerAway.name}</h4>
            <ul>
              {game.turnsAway.map((t, i) => <li key={i}>Turn {i + 1}: {t.points} pts</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
