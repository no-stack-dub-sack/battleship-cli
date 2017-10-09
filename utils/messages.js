const { salmon } = require('../utils/helpers');
const chalk      = require('chalk');

module.exports = {
    INVALID: {
        DIRECTION: `Please enter a valid direction! e.g. ${salmon('Right')}, ${salmon('Left')}, ${salmon('Up')}, ${salmon('Down')}, or ${salmon('R')}, ${salmon('L')}, ${salmon('U')}, ${salmon('D')}\n`,
        SHIP: `Please enter a valid ship: ${salmon('Battleship')}, ${salmon('Crusier')}, ${salmon('Carrier')}, ${salmon('Submarine')}, or ${salmon('Destroyer')}`,
        COORDINATE: () => `Please enter a valid starting coordinate! i.e. A1-${require('../index').lastCoord}\n`
    },
    P1: {
        HIT_SHIP: 'You hit a ship!',
        MISSED: 'Drats, you missed!',
        SUNK_SHIP: 'You bastard! You sunk the computer\'s ',
        LOST_TURN: salmon('You already guessed that space! I have zero sympathy, and you lose a turn.'),
    },
    CPU: {
        HIT_SHIP: 'Uh oh. The computer hit your ',
        SUNK_SHIP: 'Ha ha! The computer sunk your ',
        MISSED: 'The computer missed. Hard to believe.',
        LOST_TURN: 'Wow, the computer is wasting torpedoes, it already guessed that space!',
    },
    duplicatePlacement: function(ship) {
        return `You have already placed your ${ship.type.slice(0, 1).toUpperCase() + ship.type.slice(1)}!\n`
    },
    outOfBounds: function(failureCoord) {
        return `${failureCoord} is either occupied or out of bounds! Please enter valid, unoccupied coordinates, i.e. A1-${require('../index').lastCoord}\n`;
    },
    BUG_MESSAGE: 'Hey! You discovered a bug. Please take a screenshot of your last several moves and open an issue here: https://github.com/no-stack-dub-sack/battleship-cli/issues/new. Thanks!'
}
