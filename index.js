const clear    = require('clear');
const Game     = require('./lib/Game');
const chalk    = require('chalk');
const figlet   = require('figlet');
const inquirer = require('inquirer');
const CLI      = require('clui');
const Spinner  = CLI.Spinner;
const game     = new Game();

const P1_SHIPS = [
    'Cruiser, 3',
    'Submarine, 3',
    'Battleship, 4',
    'Destroyer, 2',
    'Carrier, 5'
];

/** TODO:
* import messages from util file
* move isCoordinateValid to util file
* enable difficulty settings (size of board?, cpu makes wild guess every time)
* add instructions option/prompt at game initialization
* also make instructions available via 'help' command at any time via commandCenter
*/


/**
 * ASCII ART!
*/

clear();
console.log(
    chalk.cyan(
        figlet.textSync('Battleship CLI', {
            font: 'graffiti',
            horizontalLayout: 'full'
        }),
        '\n'
    )
);

/**
 * GAME PROMPTS:
*/

function initializeGame(callback) {
    const questions = [
        {
            type: 'input',
            name: 'ready',
            message: 'Welcome to Battleship CLI! Press enter to continue.',
            validate: value => {
                return commandCenter(value, () => {
                    return true;
                });
            }
        },
        {
            type: 'list',
            name: 'options',
            message: 'Would you like to see instructions?',
            choices: ['No thanks, let\'s play!', 'Yes, please' ],
            default: 0
        }
    ];

    inquirer.prompt(questions).then(callback);
}

function configureP1Ships(ships) {
    var message =
        `Ships remaining [type, size]: ${chalk.dim(JSON.stringify(ships).replace(/"/g, "'"))}` +
        (ships.length === 5 ? '\n  Use coordinates A1-J10 and left, right, up or down\n' : '\n') +
        ` Place a ship! ${chalk.dim(' e.g. cruiser b3 right')}`;

    const question = [
        {
            type: 'input',
            name: 'placeShip',
            message: message,
            validate: value => {
                return commandCenter(value, () => {
                    const instructions = value.split(' ');

                    if (instructions.length !== 3) {
                        return 'Please provide a ship, a starting coordinate, and a direction. e.g. \'Battleship, B5, Right\'';
                    }

                    var [ ship, coords, direction ] = instructions;

                    // if ship placement is successful,
                    // playerOne.placeShip returns undefined
                    var message = game.playerOne.placeShip(
                        ship.toLowerCase(),
                        coords.toLowerCase(),
                        direction.toLowerCase()
                    );
                    // return error message or continue
                    return message ? message : true;
                });
            }
        }
    ];
    // recurse until all ships are placed
    inquirer.prompt(question).then(() => {
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
            configureP1Ships(ships);
        }
    })
}

function startGame() {
    const question = [
        {
            type: 'input',
            name: 'ready',
            message: `Ready to play? ${game.message} ${chalk.dim('(press enter to continue)')}`,
            validate: val => {
                return commandCenter(val, () => {
                    return true;
                });
            }
        }
    ];

    inquirer.prompt(question).then(() => {
        if (!game.coinToss) {
            const spinner = new Spinner('');
            spinner.start();
            setTimeout(() => {
                spinner.stop();
                spinner.start();
                game.attack();
            }, 500);
            setTimeout(() => {
                spinner.stop();
                takeTurn();
            }, 900);
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
            message: `Take a guess! Enter coordinates A1-J10: ${chalk.dim(' (e.g. B7)')}`,
            validate: value => {
                return commandCenter(value, () => {
                    if (game.playerOne.isCoordinateValid(value)) {
                        return true;
                    } else {
                        return "Please enter valid coordinates"
                    }
                });
            }
        }
    ];

    inquirer.prompt(question).then(move => {
        const spinner = new Spinner('');
        game.attack(move.coords);
        spinner.start();
        setTimeout(() => {
            spinner.stop();
            spinner.start();
            game.attack();
        }, 800);
        setTimeout(() => {
            spinner.stop();
            takeTurn();
        }, 1200);
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

    inquirer.prompt(question).then(answer => {
        if (answer.newGame) {
            game.reset();
            console.log('Ready? Here we go again...');
            setTimeout(() => {
                game.populateP1Ships();
                configureP1Ships(P1_SHIPS);
            }, 1000);
        } else {
            console.log('\n\nThanks for playing Battleship CLI! Goodbye!\n\n');
            process.exit();
        }
    });
}

/**
 * UTILITY FUNCTIONS:
*/

function commandCenter(value, validations) {
    switch (value) {
        case 'show board':
            return game.playerOne.showBoard();
        case 'show score':
            return game.status;
        case 'q':
        case 'quit':
            console.log('\n\nGoodbye...');
            process.exit();
        default:
            return validations();
    }
}

function __continue(callback) {
    const question = [
        {
            type: 'input',
            name: 'continue',
            message: 'Press enter to continue',
            validate: value => {
                return commandCenter(value, () => {
                    return true;
                });
            }
        }
    ];

    inquirer.prompt(question).then(callback);
}

/**
 * EXECUTE PROGRAM:
*/

initializeGame(answer => {
    if (answer.options === 'Yes, please') {
         var instructions = `
Type '${chalk.red.underline('help')}' at any time to show these instructions.

Other helpful commands:
  - Type '${chalk.keyword('orange').underline('show board')}' at any time to see your own board including ship configuration, ships hit, and misses.
  - Type '${chalk.keyword('orange').underline('show score')}' at any time to check the status of the game.
  - Type '${chalk.keyword('orange').underline('quit')}' at any time to quit the game.

Gameplay:
  - To play, configure your five ships on your 10x10 board in any pattern you'd like (diagonal placements are not allowed), the computer will do the same.
  - To configure your ships, follow the prompts, and use instructions that include a ship name, a starting coordinate, and a direction in which to place your ship.
  - Once both players have configured their boards, the race is on to sink your opponents ships before they sink yours!
  - Fire torpedos at your opponents ships by guessing coordinates on the 10x10 board.
  - Rows are represented by the letters A-J, and columns with the numbers 1-10. Valid guesses include a row followed by a column, e.g. A1, B7, J10, etc.
  - To configure your ships, use the name of the

`;

        console.log(instructions)
        __continue(() => {
            game.populateP1Ships();
            configureP1Ships(P1_SHIPS);
        });
    } else {
        game.populateP1Ships();
        configureP1Ships(P1_SHIPS);
    }
});
