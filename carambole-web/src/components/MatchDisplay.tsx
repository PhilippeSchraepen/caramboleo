'use client';

import Link from 'next/link';
import { useMatch } from '@/context/MatchContext';
import { Match } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';
import { calculateTotalPoints, calculateMatchPoints } from '@/lib/utils';

interface MatchDisplayProps {
  initialMatch: Match;
}

export default function MatchDisplay({ initialMatch }: MatchDisplayProps) {
  const { match, resetMatch } = useMatch();

  return (
    <div className="space-y-6">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-3xl">{match.teamHome} vs {match.teamAway}</CardTitle>
          <CardDescription>{match.date}</CardDescription>
          {match.lastReset && (
            <p className="text-xs text-muted-foreground">
              Last reset: {match.lastReset}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={resetMatch} 
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Match
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Game Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Game</TableHead>
                <TableHead>Player Home</TableHead>
                <TableHead>Player Away</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {match.games.map((game) => {
                const scoreHome = calculateTotalPoints(game.turnsHome);
                const scoreAway = calculateTotalPoints(game.turnsAway);
                const matchPointsHome = calculateMatchPoints(scoreHome, game.targetHome);
                const matchPointsAway = calculateMatchPoints(scoreAway, game.targetAway);

                return (
                  <TableRow key={game.id}>
                    <TableCell className="font-medium">Game {game.id}</TableCell>
                    <TableCell>
                      <div className="font-semibold">{game.playerHome.name} ({game.targetHome})</div>
                      <div className="text-xs text-muted-foreground italic">MP: {matchPointsHome}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">{game.playerAway.name} ({game.targetAway})</div>
                      <div className="text-xs text-muted-foreground italic">MP: {matchPointsAway}</div>
                    </TableCell>
                    <TableCell className="font-mono text-lg">{scoreHome} - {scoreAway}</TableCell>
                    <TableCell>
                      <Badge variant={game.status === 'ongoing' ? 'secondary' : 'default'}>
                        {game.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant={game.status === 'ongoing' ? 'default' : 'outline'} size="sm">
                        <Link href={`/game/${game.id}`}>
                          {game.status === 'ongoing' ? 'Referee' : 'View'}
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Match Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-around text-center">
          <div>
            <div className="text-sm text-muted-foreground">Total MP {match.teamHome}</div>
            <div className="text-3xl font-bold">
              {match.games.reduce((sum, g) => sum + parseFloat(calculateMatchPoints(calculateTotalPoints(g.turnsHome), g.targetHome)), 0).toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Total MP {match.teamAway}</div>
            <div className="text-3xl font-bold">
              {match.games.reduce((sum, g) => sum + parseFloat(calculateMatchPoints(calculateTotalPoints(g.turnsAway), g.targetAway)), 0).toFixed(2)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
