const clear  = require('clear');
const Game   = require('./lib/Game');
const chalk  = require('chalk');
const figlet = require('figlet');

clear();
console.log(
    chalk.yellow(
        figlet.textSync('Battleship CLI', {
            font: 'graffiti',
            horizontalLayout: 'full'
        })
    )
);

const game = new Game();
game.setInitialState();
game.playerOne.placeShip('submarine', 'a2', 'r');
// game.playerOne.placeShip('submarine', 'a3', 'down');
game.playerOne.placeShip('Cruiser', 'D7', 'Up');
game.playerOne.placeShip('Carrier', 'D2', 'right');
game.playerOne.placeShip('Destroyer', 'H7', 'left');
game.playerOne.placeShip('battleship', 'i2', 'u');
game.playerOne.showBoard;
//
game.attack(randomizeCoordinates());
game.attack();
game.attack(randomizeCoordinates());
game.attack();
game.attack(randomizeCoordinates());
game.attack();
game.attack(randomizeCoordinates());
game.attack();
game.attack(randomizeCoordinates());
game.attack();
game.attack(randomizeCoordinates());
game.attack();
game.attack(randomizeCoordinates());
game.attack();
game.attack(randomizeCoordinates());
game.attack();
game.attack(randomizeCoordinates());
game.attack();
game.attack(randomizeCoordinates());
game.attack();
game.attack(randomizeCoordinates());
game.attack();
game.attack(randomizeCoordinates());
game.attack();
game.attack(randomizeCoordinates());
game.attack();
game.attack(randomizeCoordinates());
game.attack();
game.attack(randomizeCoordinates());
game.attack();
game.attack(randomizeCoordinates());
game.attack();
game.attack(randomizeCoordinates());
game.attack();
game.attack(randomizeCoordinates());
game.attack();
game.attack(randomizeCoordinates());
game.attack();
game.attack(randomizeCoordinates());
game.attack();
game.attack(randomizeCoordinates());
game.attack();
game.attack(randomizeCoordinates());
game.attack();
game.attack(randomizeCoordinates());
game.attack();
game.attack(randomizeCoordinates());
game.attack();
game.attack(randomizeCoordinates());
// game.reset();


function randomizeCoordinates() {
    const rows = ['A','B','C','D','E','F','G','H','I','J'];
    return rows[Math.floor(Math.random() * 10)] + Math.ceil(Math.random() * 10);
}
