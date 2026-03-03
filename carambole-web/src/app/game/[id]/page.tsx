'use client';

import { useParams } from 'next/navigation';
import { useMatch } from '@/context/MatchContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, RotateCcw, Target } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { calculateTotalPoints, calculateAverage, calculateHighestSeries } from '@/lib/utils';

export default function GameSheet() {
  const { id } = useParams();
  const { match, addTurn, undoTurn } = useMatch();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const gameId = parseInt(id as string);
  const game = match.games.find(g => g.id === gameId);

  // Auto-scroll to bottom when turns change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [game?.turnsHome.length, game?.turnsAway.length]);

  if (!game) {
    return <div className="p-8 text-center">Game not found</div>;
  }

  const scoreHome = calculateTotalPoints(game.turnsHome);
  const scoreAway = calculateTotalPoints(game.turnsAway);
  
  const currentTurn = game.turnsHome.length > game.turnsAway.length 
    ? game.turnsHome.length 
    : game.turnsHome.length + 1;

  const nextPlayer = game.turnsHome.length <= game.turnsAway.length ? 'home' : 'away';

  const handlePointClick = (points: number) => {
    if (game.status === 'finished') return;
    addTurn(gameId, nextPlayer, points);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href="/">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <h2 className="text-xl font-bold italic text-muted-foreground">
          Game {game.id}
        </h2>
        <Badge variant={game.status === 'ongoing' ? 'secondary' : 'default'} className="px-3 py-1">
          {game.status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Home Player Card */}
        <Card className={nextPlayer === 'home' && game.status === 'ongoing' ? 'ring-2 ring-primary' : ''}>
          <CardHeader className="pb-2 text-center">
            <CardTitle>{game.playerHome.name}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <div className="text-5xl font-black tabular-nums">
              {scoreHome} <span className="text-2xl text-muted-foreground font-normal">/ {game.targetHome}</span>
            </div>
            {scoreHome >= game.targetHome && (
              <Badge variant="success" className="bg-green-500 hover:bg-green-600 gap-1">
                <Target className="h-3 w-3" /> Target Reached
              </Badge>
            )}
            <div className="grid grid-cols-3 gap-2 text-sm pt-4 border-t">
              <div>
                <div className="text-muted-foreground">Innings</div>
                <div className="font-bold">{game.turnsHome.length} / {game.maxTurns}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Avg</div>
                <div className="font-bold">{calculateAverage(scoreHome, game.turnsHome.length)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">High</div>
                <div className="font-bold">{calculateHighestSeries(game.turnsHome)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Away Player Card */}
        <Card className={nextPlayer === 'away' && game.status === 'ongoing' ? 'ring-2 ring-primary' : ''}>
          <CardHeader className="pb-2 text-center">
            <CardTitle>{game.playerAway.name}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <div className="text-5xl font-black tabular-nums">
              {scoreAway} <span className="text-2xl text-muted-foreground font-normal">/ {game.targetAway}</span>
            </div>
            {scoreAway >= game.targetAway && (
              <Badge variant="success" className="bg-green-500 hover:bg-green-600 gap-1">
                <Target className="h-3 w-3" /> Target Reached
              </Badge>
            )}
            <div className="grid grid-cols-3 gap-2 text-sm pt-4 border-t">
              <div>
                <div className="text-muted-foreground">Innings</div>
                <div className="font-bold">{game.turnsAway.length} / {game.maxTurns}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Avg</div>
                <div className="font-bold">{calculateAverage(scoreAway, game.turnsAway.length)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">High</div>
                <div className="font-bold">{calculateHighestSeries(game.turnsAway)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Input Section */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          {game.status === 'ongoing' ? (
            <div className="text-center space-y-6">
              <div className="space-y-1">
                <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Current Inning: {currentTurn}</div>
                <div className="text-xl font-bold">Recording: {nextPlayer === 'home' ? game.playerHome.name : game.playerAway.name}</div>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(pts => (
                  <Button 
                    key={pts} 
                    onClick={() => handlePointClick(pts)} 
                    variant={pts === 0 ? "outline" : "default"}
                    className="h-14 w-14 text-xl font-bold"
                  >
                    {pts}
                  </Button>
                ))}
              </div>

              <div className="pt-4 border-t">
                <Button variant="ghost" size="sm" onClick={() => undoTurn(gameId)} className="gap-2 text-destructive hover:text-destructive">
                  <RotateCcw className="h-4 w-4" />
                  Undo Last Entry
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-2xl font-bold">Game Finished</h3>
              <p className="text-muted-foreground">Both players have completed 20 innings.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Turn Log (Optional/Toggleable if it gets too long) */}
      <Card>
        <CardHeader className="py-3 border-b">
          <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Inning History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div 
            ref={scrollContainerRef}
            className="grid grid-cols-2 divide-x h-48 overflow-y-auto italic text-sm scroll-smooth"
          >
            <div className="p-4 space-y-1">
              {game.turnsHome.map((t, i) => (
                <div key={i} className="flex justify-between border-b border-muted/50 pb-1">
                  <span className="text-muted-foreground">Inning {i + 1}</span>
                  <span className="font-mono font-bold text-base">{t.points}</span>
                </div>
              ))}
            </div>
            <div className="p-4 space-y-1">
              {game.turnsAway.map((t, i) => (
                <div key={i} className="flex justify-between border-b border-muted/50 pb-1">
                  <span className="text-muted-foreground">Inning {i + 1}</span>
                  <span className="font-mono font-bold text-base">{t.points}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
