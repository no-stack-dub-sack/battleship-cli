#!/usr/bin/env node
const clear    = require('clear');
const Game     = require('./lib/Game');
const chalk    = require('chalk');
const figlet   = require('figlet');
const inquirer = require('inquirer');
const CLI      = require('clui');
const Spinner  = CLI.Spinner;
const game     = new Game();

require('dotenv').config()

const { HELPER, INSTRUCTIONS } = require('./utils/instructions');
const { isCoordinateValid }    = require('./utils/helpers');

const P1_SHIPS = [
    'Cruiser, 3',
    'Submarine, 3',
    'Battleship, 4',
    'Destroyer, 2',
    'Carrier, 5'
];

/** TODO:
  * enable difficulty settings (size of board?, cpu makes wild guess every time)
  * fux istructions now that emoji shit been added
  * add more messages for hits and misses and randomize
  * make AI smarter
**/

clear(); // clears terminal before rendering for cleaner presentation

/* ASCII ART! */
console.log(
    chalk.cyan(
        figlet.textSync('Battleship CLI', {
            font: 'graffiti',
            horizontalLayout: 'full'
        }),
        '\n'
    )
);

/* GAME PROMPTS: */
function menu(itr) {
    const WELCOME = ' Welcome to Battleship CLI!';
    const NOTE = chalk.dim(' (Note: if your terminal does not support Emojis, please turn off Emoji support in settings)');
    const MENU = ' Battleship CLI Menu:';
    const MESSAGE = itr === 0 ? MENU : WELCOME + NOTE;

    const questions = [
        {
            type: 'list',
            name: 'selection',
            message: MESSAGE,
            choices: [' Let\'s Play!', ' See Instructions', ' Settings', ' Exit'],
            default: 0
        },
        {
            type: 'list',
            name: 'emoji',
            message: ' Enable Emoji Support:',
            choices: [' Yes', ' No'],
            default: 0
        }
    ];

    inquirer.prompt(questions[0]).then(__menu => {
        switch (__menu.selection) {
            case ' See Instructions':
                console.log(INSTRUCTIONS)
                menu(1);
                break;
            case ' Settings':
                inquirer.prompt(questions[1]).then(option => {
                    if (option.emoji === ' Yes') {
                        process.env.EMOJI = true;
                    } else {
                        process.env.EMOJI = false;
                    }
                    menu(1);
                });
                break;
            case ' Exit':
                console.log('\n\nGoodbye...\n\n');
                process.exit();
                break;
            default:
                game.populateP1Ships();
                configureP1Ships(P1_SHIPS);
        }
    });
}

function configureP1Ships(ships) {
    if (ships.length === 5) {
        console.log('\n' + game.playerOne.board + HELPER);
    }

    const INSTRUCTION =
    ` Ships remaining [type, size]: ${chalk.dim(JSON.stringify(ships).replace(/"/g, "'"))}` +
    (ships.length === 5 ? '\n   Use coordinates A1-J10 and left, right, up or down\n' : '\n') +
    `   Place a ship! ${chalk.dim('e.g. cruiser b3 right')}`;

    const question = [
        {
            type: 'input',
            name: 'configureShip',
            message: INSTRUCTION,
            validate: value => {
                return commandCenter(value, () => {
                    let instructions = value.replace(/\s+/g, ' ').split(' ');

                    if (instructions.length !== 3) {
                        return 'Please provide a ship, a starting coordinate, and a direction. e.g. \'Battleship B5 Right\'';
                    }

                    var [ ship, coords, direction ] = instructions;

                    // if ship placement is successful,
                    // playerOne.configureShip returns undefined
                    var message = game.playerOne.configureShip(
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
        if (ships.length === 1) {
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
            message: ` Ready to play? ${game.message} ${chalk.dim('(press enter to continue)')}`,
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
            message: ` Take a guess! Enter coordinates A1-J10: ${chalk.dim('(e.g. B7)')}`,
            validate: value => {
                return commandCenter(value, () => {
                    if (isCoordinateValid(value)) {
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
            console.log('   Ready? Here we go again...');
            setTimeout(() => {
                game.reset();
                game.populateP1Ships();
                configureP1Ships(P1_SHIPS);
            }, 1000);
        } else {
            console.log('\n\nThanks for playing Battleship CLI! Goodbye!\n\n');
            process.exit();
        }
    });
}

/* UTILITY FUNCTIONS: */
function commandCenter(value, validations) {
    switch (value) {
        case 'help':
            return INSTRUCTIONS;
        case 'show board':
            return game.playerOne.board;
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

/* EXECUTE PROGRAM: */
menu();
