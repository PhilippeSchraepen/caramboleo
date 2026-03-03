import { Game } from './types';

function addTurnLogic(game: Game, player: 'home' | 'away', points: number): Game {
    const updatedGame = { ...game };
    if (player === 'home') {
        updatedGame.turnsHome = [...game.turnsHome, { points }];
    } else {
        updatedGame.turnsAway = [...game.turnsAway, { points }];
    }
    const numHome = updatedGame.turnsHome.length;
    const numAway = updatedGame.turnsAway.length;
    if (numHome === updatedGame.maxTurns && numAway === updatedGame.maxTurns) {
        updatedGame.status = 'finished';
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

// Simulate 14 turns
for (let i = 0; i < 14; i++) {
    game = addTurnLogic(game, 'home', 0);
    game = addTurnLogic(game, 'away', 0);
}

// 15th turn: Home scores 28 (target)
game = addTurnLogic(game, 'home', 28);
console.log(`After Home scores target in turn 15: Status=${game.status}, HomeTurns=${game.turnsHome.length}, AwayTurns=${game.turnsAway.length}`);

// 15th turn: Away scores 0
game = addTurnLogic(game, 'away', 0);
console.log(`After Away scores in turn 15: Status=${game.status}, HomeTurns=${game.turnsHome.length}, AwayTurns=${game.turnsAway.length}`);
