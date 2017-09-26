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
        }),
        '\n'
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
    // * Provide interface for setting up ships
    * Fix spacing
    * Add appropriate colors to hit, miss, and sunk messages
    * Configure end of game / reset prompt
    * import messages from util file
    * move isCoordinateValid to util file
    // * Give options to check score and view ownBord during gameplay
    // * Add "ready to play?" prompt that will initialize game and push to the next prompt
    * Set random first player? If so, need way to allow playerOne to configure ships before cpu takes turn
    * enable difficulty settings (size of board?, cpu makes wild guess every time)
*/

function initializeGame(callback) {
    const question = [
        {
            type: 'input',
            name: 'ready',
            message: 'Welcome to Battleship CLI! Press enter to continue.'
        }
    ];

    inquirer.prompt(question).then(callback);
}

function playerOneConfigureShips(ships) {
    var message =
        'Place a ship! e.g. cruiser b3 right' +
        (ships.length === 5 ? '\n  Use coordinates A1-J10 and left, right, up or down\n' : '\n') +
        `  Ships remaining [type, size]: ${JSON.stringify(ships).replace(/"/g, "'")}`;

    const question = [
        {
            type: 'input',
            name: 'placeShip',
            message: message,
            validate: function(instruction) {
                switch (instruction) {
                    case 'show board':
                        return game.playerOne.showBoard();
                    case 'show score':
                        return game.status;
                    case 'q':
                    case 'quit':
                        console.log('\n\nGoodbye...');
                        process.exit();

                    default:

                    var [ ship, coords, direction ] = instruction.split(' ');
                    // if ship placement is successful,
                    // playerOne.placeShip returns undefined
                    var message = game.playerOne.placeShip(
                        ship.toLowerCase(),
                        coords.toUpperCase(),
                        direction.toLowerCase()
                    );
                    // return error message or continue
                    return message ? message : true;
                }
            }
        }
    ];
    // recurse until all ships are placed
    inquirer.prompt(question).then(function() {
        if (game.playerOneReady()) {
            game.setInitialState();
            startGame();
        } else {
            ships = [];
            for (let ship of game.playerOne.ships) {
                if (!ship.placed) {
                    ships.push(
                        ship.type.slice(0,1).toUpperCase() +
                        ship.type.slice(1) + ', ' +
                        ship.size
                    );
                }
            }
            playerOneConfigureShips(ships);
        }
    })
}

function startGame() {
    const question = [
        {
            type: 'input',
            name: 'ready',
            message: `Ready to play? ${game.message} (press enter to continue)`,
            validate: function(val) {
                return true;
            }
        }
    ];

    inquirer.prompt(question).then(function() {
        if (!game.coinToss) {
            setTimeout(() => game.attack(), 500);
            setTimeout(() => takeTurn(), 900);
        } else {
            takeTurn();
        }
    })
}

function takeTurn() {
    if (game.gameOver) {
        return gameOver();
    }

    const question = [
        {
            type: 'input',
            name: 'coords',
            message: 'Take a guess! Enter coordinates A1-J10, e.g. B7:',
            validate: function(coords) {
                switch (coords) {
                    case 'show board':
                        return game.playerOne.showBoard();
                    case 'show score':
                        return game.status;
                    case 'q':
                    case 'quit':
                        console.log('\n\nGoodbye...');
                        process.exit();

                    default:

                    if (game.playerOne.isCoordinateValid(coords)) {
                        return true;
                    } else {
                        return "Please enter valid coordinates"
                    }
                }
            }
        }
    ];

    inquirer.prompt(question).then(function(move) {
        game.attack(move.coords);
        setTimeout(() => game.attack(), 800);
        setTimeout(() => takeTurn(), 1200);
    });
}

function gameOver() {
    const question = [
        {
            type: 'confirm',
            name: 'newGame',
            message: game.message
        }
    ];

    inquirer.prompt(question).then(function(answer) {
        if (answer.newGame) {
            game.reset();
            game.populateP1Ships();
            console.log('Ready? Here we go again...');
            setTimeout(() => {
                playerOneConfigureShips([
                    'Cruiser, 3',
                    'Submarine, 3',
                    'Battleship, 4',
                    'Destroyer, 2',
                    'Carrier, 5'
                ]);
            }, 1000);
        } else {
            console.log('\n\nThanks for playing Battleship CLI! Goodbye!\n\n');
            process.exit();
        }
    });
}

initializeGame(function() {
    game.populateP1Ships();
    playerOneConfigureShips([
        'Cruiser, 3',
        'Submarine, 3',
        'Battleship, 4',
        'Destroyer, 2',
        'Carrier, 5'
    ]);
});
