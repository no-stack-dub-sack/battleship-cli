module.exports = {
    INVALID: {
        DIRECTION: 'Please enter a valid direction! e.g. \'Right\', \'Left\', \'Up\', \'Down\', or \'R\', \'L\', \'U\', \'D\'\n',
        SHIP: 'Please enter a valid ship: \'Battleship\', \'Crusier\', \'Carrier\', \'Submarine\', or \'Destroyer\'',
        COORDINATE: 'Please enter valid starting coordinate! i.e. A1 - J10\n',
        INSTRUCTIONS: 'Please provide a ship, a starting coordinate, and a direction. e.g. \'Battleship, B5, Right\''
    },
    P1: {
        HIT_SHIP: 'You hit a ship!',
        MISSED: 'Drats, you missed!',
        SUNK_SHIP: 'You bastard! You sunk the computer\'s ',
        LOST_TURN: 'You already guessed that space! I have zero sympathy, and you lose a turn.',
    },
    CPU: {
        HIT_SHIP: 'Uh oh. The computer hit your ',
        SUNK_SHIP: 'Ha ha! The computer sunk your ',
        MISSED: 'The computer missed. Hard to believe.\n',
    },
    duplicatePlacement: function(ship) {
        return `You have already placed your ${ship.type.slice(0, 1).toUpperCase() + ship.type.slice(1)}!\n`
    },
    outOfBounds: function(failureCoord) {
        return `${failureCoord} is either occupied or out of bounds!\nPlease enter valid, unoccupied coordinates, i.e. A1 - J10\n`;
    }
}
