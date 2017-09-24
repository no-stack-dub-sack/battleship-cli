const clear    = require('clear');
const Game     = require('./lib/Game');
const chalk    = require('chalk');
const figlet   = require('figlet');
const inquirer = require('inquirer');

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
// game.setInitialState();
// game.playerOne.placeShip('submarine', 'a2', 'r');
// game.playerOne.placeShip('submarine', 'a3', 'down');
// game.playerOne.placeShip('Cruiser', 'D7', 'Up');
// game.playerOne.placeShip('Carrier', 'D2', 'right');
// game.playerOne.placeShip('Destroyer', 'H7', 'left');
// game.playerOne.placeShip('battleship', 'i2', 'u');
// game.playerOne.showBoard;

/** TODO:
    // * Handle player entering invalid coords - right now they lose a turn
    * Provide interface for setting up ships
    * Fix spacing
    * Add appropriate colors to hit, miss, and sunk messages
    * Give options to check score and view ownBord during gameplay
    * Add "ready to play?" prompt that will initialize game and push to the next prompt
    * Set random first player? If so, need way to allow playerOne to configure ships before cpu takes turn
*/

function initializeGame() {
    const questions = [
        {
            type: 'input',
            name: 'ready',
            message: 'Welcome to Battleship CLI! Press enter to continue.',
            validate: function(val) {
                return true;
            }
        }
    ];

    inquirer.prompt(questions).then(function() {
        game.setInitialState();
        playerOneConfigureShips(['Cruiser', 'Submarine', 'Battleship', 'Destroyer', 'Carrier']);
    });
}

function playerOneConfigureShips(ships) {
    var message =
        'Place a ship! e.g. cruiser b3 right' +
        (ships.length === 5 ? '\n  Use coordinates A1-J10 and left, right, up or down\n' : '\n') +
        `  Ships remaining: ${JSON.stringify(ships)}`;

    const questions = [
        {
            type: 'input',
            name: 'placeShip',
            message,
            // default: '',
            validate: function(instruction) {
                const [ ship, coord, direction ] = instruction.split(' ');
                var message = game.playerOne.placeShip(ship, coord, direction);
                if (message) {
                    return message;
                } else {
                    return true;
                }
            }
        }
    ];
    // recurse until all ships are placed
    inquirer.prompt(questions).then(function() {
        if (game.confirmInitialization()) {
            takeTurn();
        } else {
            ships = [];
            for (var ship of game.playerOne.ships) {
                if (!ship.placed) {
                    ships.push(ship.type.slice(0,1).toUpperCase() + ship.type.slice(1));
                }
            }
            playerOneConfigureShips(ships);
        }
    })
}

function takeTurn() {
    const questions = [
        {
            type: 'input',
            name: 'move',
            message: 'Take a guess! Enter coordinates A1-J10, e.g. B7:',
            validate: function(coords) {
                if (game.playerOne.isCoordinateValid(coords)) {
                    return true;
                } else {
                    return "Please enter valid coordinates"
                }
            }
        }
    ];

    inquirer.prompt(questions).then(function(answer) {
        game.attack(answer.move);
        setTimeout(() => game.attack(), 1000);
        setTimeout(() => takeTurn(), 1200);
    });
}

// takeTurn();
initializeGame();






function randomizeCoordinates() {
    const rows = ['A','B','C','D','E','F','G','H','I','J'];
    return rows[Math.floor(Math.random() * 10)] + Math.ceil(Math.random() * 10);
}
