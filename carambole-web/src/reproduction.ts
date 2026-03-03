import { Match, Game, Turn } from './types';

// Simplified addTurn logic for testing
function addTurnLogic(game: Game, player: 'home' | 'away', points: number): Game {
    const updatedGame = { ...game };
    if (player === 'home') {
        updatedGame.turnsHome = [...game.turnsHome, { points }];
    } else {
        updatedGame.turnsAway = [...game.turnsAway, { points }];
    }
    
    const totalHome = updatedGame.turnsHome.reduce((sum, t) => sum + t.points, 0);
    const totalAway = updatedGame.turnsAway.reduce((sum, t) => sum + t.points, 0);
    const numHome = updatedGame.turnsHome.length;
    const numAway = updatedGame.turnsAway.length;
    
    if (numHome === numAway) {
        if (totalHome >= updatedGame.targetHome || totalAway >= updatedGame.targetAway || numHome >= updatedGame.maxTurns) {
            updatedGame.status = 'finished';
        }
    }
    return updatedGame;
}

let game: Game = {
    id: 1,
    playerHome: { name: 'Home', handicap: 28 },
    playerAway: { name: 'Away', handicap: 25 },
    turnsHome: [],
    turnsAway: [],
    targetHome: 28,
    targetAway: 25,
    maxTurns: 20,
    status: 'ongoing'
};

// Simulate 19 turns
for (let i = 0; i < 19; i++) {
    game = addTurnLogic(game, 'home', 0);
    game = addTurnLogic(game, 'away', 0);
}

console.log(`Turns after 19 innings: Home=${game.turnsHome.length}, Away=${game.turnsAway.length}, Status=${game.status}`);

// 20th turn for Home
game = addTurnLogic(game, 'home', 0);
console.log(`Turns after Home 20th: Home=${game.turnsHome.length}, Away=${game.turnsAway.length}, Status=${game.status}`);

// 20th turn for Away
game = addTurnLogic(game, 'away', 0);
console.log(`Turns after Away 20th: Home=${game.turnsHome.length}, Away=${game.turnsAway.length}, Status=${game.status}`);
